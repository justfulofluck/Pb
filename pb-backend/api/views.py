from rest_framework import viewsets, generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache
from .models import (
    Category,
    Product,
    Review,
    Event,
    BlogPost,
    Story,
    HeroSlide,
    Order,
    OrderItem,
    UserProfile,
    VisitorForm,
    VisitorSubmission,
    NewsletterSubscriber,
    Announcement,
    DistributorApplication,
    RewardRule,
    RewardTransaction,
    WishlistItem,
)
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductListSerializer,
    ReviewSerializer,
    EventSerializer,
    BlogPostSerializer,
    StorySerializer,
    HeroSlideSerializer,
    OrderSerializer,
    OrderItemSerializer,
    UserSerializer,
    UserProfileSerializer,
    VisitorFormSerializer,
    VisitorSubmissionSerializer,
    RequestPasswordResetSerializer,
    VerifyOTPSerializer,
    SetNewPasswordSerializer,
    NewsletterSubscribeSerializer,
    NewsletterSubscriberSerializer,
    AnnouncementSerializer,
    DistributorApplicationSerializer,
    RewardRuleSerializer,
    RewardTransactionSerializer,
    WishlistItemSerializer,
    CustomerManagementSerializer,
)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=False).order_by("-date_joined")
    serializer_class = CustomerManagementSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = [
        "get",
        "delete",
        "post",
    ]  # Only allow list, retrieve, delete, and our custom action

    @action(detail=True, methods=["post"])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({"status": "active" if user.is_active else "inactive"})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "is_top_rated"]
    search_fields = ["name", "description"]
    pagination_class = ProductPagination

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        cache_key = f"product_detail_{pk}"
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"Cache get failed: {e}")

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        try:
            cache.set(cache_key, serializer.data, 300)
        except Exception as e:
            print(f"Cache set failed: {e}")
        return Response(serializer.data)

    def perform_update(self, serializer):
        try:
            super().perform_update(serializer)
            cache.delete(f"product_detail_{serializer.instance.pk}")
        except Exception as e:
            print(f"ERROR in perform_update: {e}")
            import traceback

            traceback.print_exc()
            raise

    def perform_destroy(self, instance):
        pk = instance.pk
        super().perform_destroy(instance)
        cache.delete(f"product_detail_{pk}")


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        instance = serializer.save(user=user)

        if user:
            from .utils import award_points

            points = award_points(user, "review")
            # Store points temporarily on the instance so they can be returned in the response
            instance.points_earned = points
        else:
            instance.points_earned = 0

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Add points_earned to the response data
        data = serializer.data
        data["points_earned"] = getattr(serializer.instance, "points_earned", 0)

        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_queryset(self):
        return BlogPost.objects.filter(is_active=True).order_by("-id")


class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer

    def create(self, request, *args, **kwargs):
        print("DEBUG: Story Post Data:", request.data)
        return super().create(request, *args, **kwargs)


class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer


from .utils import get_razorpay_client, send_email, send_order_confirmation_emails
from django.conf import settings


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_update(self, serializer):
        instance = serializer.instance
        old_status = instance.status
        order = serializer.save()

        if old_status != order.status:
            subject = f"Order #{order.id} Update: {order.status}"
            contents = f"Hello {order.user.username},\n\nYour order #{order.id} status has been updated to: {order.status}."

            if order.status == "Shipped":
                contents += "\n\nIt is on its way to you!"
            elif order.status == "Delivered":
                contents += "\n\nWe hope you enjoy your purchase!"
            elif order.status == "Cancelled":
                contents += "\n\nIf you have any questions, please contact support."

            contents += "\n\nBest regards,\nPinobite Team"

            # Use the utility function which uses yagmail
            send_email(order.user.email, subject, contents)

    @action(detail=False, methods=["post"])
    def initiate(self, request):
        from django.db import transaction
        from .utils import deduct_points

        user = request.user
        items = request.data.get("items", [])
        shipping_address = request.data.get("shipping_address", {})
        use_points = request.data.get("use_points", False)
        points_to_redeem = request.data.get("points_to_redeem", 0)

        if not items:
            return Response(
                {"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        total_amount = 0
        order_items_data = []

        for item in items:
            try:
                product = Product.objects.get(id=item["id"])
                quantity = item.get("quantity", 1)
                price = product.price
                total_amount += price * quantity

                order_items_data.append(
                    {
                        "product": product,
                        "price": price,
                        "quantity": quantity,
                        "product_name": product.name,
                    }
                )
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Product {item['id']} not found"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Create localized Order record
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            status="Pending",
            # Map shipping_address to model fields
            address=f"{shipping_address.get('street', '')}, {shipping_address.get('city', '')}, {shipping_address.get('state', '')}, {shipping_address.get('zip', '')}",
            city=shipping_address.get("city", ""),
            state=shipping_address.get("state", ""),
            pin_code=shipping_address.get("zip", ""),
            phone=request.data.get("phone", ""),
            user_email=request.data.get(
                "email", user.email if user.is_authenticated else ""
            ),
            first_name=request.data.get(
                "first_name", user.first_name if user.is_authenticated else ""
            ),
            last_name=request.data.get(
                "last_name", user.last_name if user.is_authenticated else ""
            ),
        )

        for item_data in order_items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data["product"],
                product_name=item_data["product_name"],
                price=item_data["price"],
                quantity=item_data["quantity"],
            )

        # Update User Profile with address details if authenticated
        if request.user.is_authenticated:
            profile = request.user.profile
            profile.phone = request.data.get("phone", profile.phone)
            # Use the concatenated address or just street? Frontend matches 'address' to street.
            # Let's use the shipping_address dict parts
            shipping_addr = request.data.get("shipping_address", {})
            profile.address = shipping_addr.get("street", profile.address)
            profile.city = shipping_addr.get("city", profile.city)
            profile.state = shipping_addr.get("state", profile.state)
            profile.pin_code = shipping_addr.get("zip", profile.pin_code)
            profile.save()

        # Process points redemption if requested
        points_discount = 0
        points_deducted = 0
        if use_points and points_to_redeem > 0 and request.user.is_authenticated:
            max_redeemable = min(points_to_redeem, int(total_amount * 10))
            if max_redeemable > 0:
                success, message = deduct_points(
                    request.user, max_redeemable, f"Redeemed on Order #{order.id}"
                )
                if success:
                    points_discount = max_redeemable / 10
                    points_deducted = max_redeemable
                    total_amount -= points_discount

        # Update order total with discount
        order.total_amount = total_amount
        order.save()

        # Create Razorpay Order
        # Create Razorpay Order
        razorpay_amount = int(total_amount * 100)  # Amount in paise
        try:
            client = get_razorpay_client()
            razorpay_order = client.order.create(
                {
                    "amount": razorpay_amount,
                    "currency": "INR",
                    "receipt": str(order.id),
                    "payment_capture": 1,
                }
            )
            order.razorpay_order_id = razorpay_order["id"]
        except Exception as e:
            print(f"Razorpay Order Creation Failed (Using Mock): {e}")
            # Fallback to Mock ID if keys are invalid or API fails
            order.razorpay_order_id = f"order_mock_{order.id}"
            razorpay_order = {"id": order.razorpay_order_id}

        order.razorpay_order_id = razorpay_order["id"]
        order.save()

        return Response(
            {
                "order_id": order.id,
                "razorpay_order_id": razorpay_order["id"],
                "amount": razorpay_amount,
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID,
                "points_discount": points_discount,
                "points_deducted": points_deducted,
                "new_total": float(total_amount),
            }
        )

    @action(detail=False, methods=["post"])
    def verify(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id", "")
        razorpay_payment_id = request.data.get("razorpay_payment_id", "")
        razorpay_signature = request.data.get("razorpay_signature", "")
        order_id = request.data.get("order_id")

        # Check for Mock Order
        if razorpay_order_id.startswith("order_mock_"):
            try:
                order = Order.objects.get(id=order_id)
                if order.razorpay_order_id == razorpay_order_id:
                    order.status = "Processing"
                    order.razorpay_payment_id = razorpay_payment_id
                    order.save()

                    total_awarded = 0
                    from .utils import award_points

                    spend_points = int(order.total_amount / 100) * 10
                    if spend_points > 0:
                        total_awarded += award_points(
                            request.user,
                            "purchase",
                            custom_points=spend_points,
                            reason_override=f"Points earned on Order #{order.id}",
                        )

                    order_count = Order.objects.filter(
                        user=request.user,
                        status__in=["Processing", "Paid", "Shipped", "Delivered"],
                    ).count()
                    if order_count == 1:
                        total_awarded += award_points(request.user, "first_order")

                    # Send Confirmation Emails (Internal + Customer)
                    send_order_confirmation_emails(order, razorpay_payment_id)

                    return Response(
                        {
                            "status": "Payment verified successfully (Mock)",
                            "points_earned": total_awarded,
                        }
                    )
                else:
                    return Response(
                        {"error": "Invalid mock order details"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except Order.DoesNotExist:
                return Response(
                    {"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND
                )

        client = get_razorpay_client()

        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )

            order = Order.objects.get(id=order_id, razorpay_order_id=razorpay_order_id)
            order.status = "Processing"  # Or Paid
            order.razorpay_payment_id = razorpay_payment_id
            order.save()

            total_awarded = 0
            from .utils import award_points

            # 1. Standard Spend Points (₹100 = 10 pts)
            spend_points = int(order.total_amount / 100) * 10
            if spend_points > 0:
                total_awarded += award_points(
                    request.user,
                    "purchase",
                    custom_points=spend_points,
                    reason_override=f"Points earned on Order #{order.id}",
                )

            # 2. First Order Bonus
            order_count = Order.objects.filter(
                user=request.user,
                status__in=["Processing", "Paid", "Shipped", "Delivered"],
            ).count()
            if order_count == 1:
                total_awarded += award_points(request.user, "first_order")

            # Send Emails (Customer + Admin)
            send_order_confirmation_emails(order, razorpay_payment_id)

            return Response(
                {
                    "status": "Payment verified successfully",
                    "points_earned": total_awarded,
                }
            )

        except Exception as e:
            print(f"Verification Failed: {e}")
            return Response(
                {"error": "Signature verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["post"])
    def redeem_points(self, request):
        """
        Redeem points for discount on an order.
        POST: { "order_id": int, "points": int }
        Returns: { "discount": float, "points_deducted": int, "new_total": float }
        """
        from django.db import transaction
        from .utils import deduct_points

        points_to_redeem = request.data.get("points", 0)
        order_id = request.data.get("order_id")

        if not order_id:
            return Response(
                {"error": "Order ID required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not points_to_redeem or points_to_redeem <= 0:
            return Response(
                {"error": "Valid points amount required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if order.status not in ["PENDING", "Pending"]:
            return Response(
                {"error": "Order already processed"}, status=status.HTTP_400_BAD_REQUEST
            )

        points_to_redeem = int(points_to_redeem)
        max_redeemable = min(points_to_redeem, int(float(order.total_amount) * 10))

        # Deduct points
        with transaction.atomic():
            success, message = deduct_points(
                request.user, max_redeemable, f"Redeemed on Order #{order.id}"
            )

        if not success:
            return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

        discount = max_redeemable / 10
        new_total = float(order.total_amount) - discount

        return Response(
            {
                "discount": discount,
                "points_deducted": max_redeemable,
                "new_total": new_total,
            }
        )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            from .models import RewardRule

            try:
                rule = RewardRule.objects.get(event_name="signup")
                response.data["points_earned"] = rule.points if rule.is_enabled else 0
            except Exception as e:
                print(f"Error getting signup rule: {e}")
                response.data["points_earned"] = 0
        return response


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def update_profile(self, request):
        user = request.user
        profile = user.profile

        # Update User fields if provided
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")

        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        user.save()

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Return full user data
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisitorFormViewSet(viewsets.ModelViewSet):
    queryset = VisitorForm.objects.all()
    serializer_class = VisitorFormSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class VisitorSubmissionViewSet(viewsets.ModelViewSet):
    queryset = VisitorSubmission.objects.all()
    serializer_class = VisitorSubmissionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        submission = serializer.save()

        # Send Confirmation Email
        try:
            subject = f"Registration Confirmed: {submission.form.title}"

            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: sans-serif; background-color: #f9f9f9; padding: 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
                    .header {{ text-align: center; margin-bottom: 30px; }}
                    .logo {{ font-size: 24px; font-weight: bold; color: #1a2333; }}
                    .logo span {{ color: #008a45; }}
                    .content {{ color: #444; line-height: 1.6; }}
                    .footer {{ margin-top: 30px; text-align: center; font-size: 12px; color: #888; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Pino<span>bite</span> Global</div>
                    </div>
                    <div class="content">
                        <h2>Hello {submission.name},</h2>
                        <p>Thank you for registering for <strong>{submission.form.title}</strong>.</p>
                        <p>We have successfully received your details.</p>
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; color: #166534;"><strong>Event:</strong> {submission.form.event_name}</p>
                            <p style="margin: 5px 0 0; color: #166534;"><strong>Date:</strong> {submission.submitted_at.strftime("%B %d, %Y")}</p>
                        </div>
                        <p>We look forward to seeing you there!</p>
                    </div>
                    <div class="footer">
                        &copy; 2026 Pinobite Global. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            """

            send_mail(
                subject,
                f"Thank you for registering for {submission.form.title}.",
                settings.EMAIL_HOST_USER,
                [submission.email],
                fail_silently=True,
                html_message=html_message,
            )
        except Exception as e:
            print(f"Error sending email: {e}")


from .models import PasswordResetOTP
from django.core.mail import send_mail
from django.conf import settings
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


class RequestPasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            try:
                user = User.objects.get(email=email)

                # Generate OTP
                otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
                PasswordResetOTP.objects.create(user=user, otp=otp)

                # Modern HTML Email Template
                html_message = f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Password Reset OTP</title>
                    <style>
body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
.container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }}
.header {{ background-color: #1a2333; padding: 40px 20px; text-align: center; }}
.logo {{ color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }}
.logo span {{ color: #008a45; }}
.content {{ padding: 40px 30px; color: #333333; }}
.greeting {{ font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a2333; }}
.message {{ line-height: 1.6; margin-bottom: 30px; color: #555555; }}
.otp-box {{ background-color: #f0fdf4; border: 2px dashed #008a45; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }}
.otp-code {{ font-size: 32px; font-weight: 800; color: #008a45; letter-spacing: 5px; }}
.expiry {{ font-size: 12px; color: #666666; margin-top: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }}
.footer {{ background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">Pino<span>bite</span> Global</div>
                        </div>
                        <div class="content">
                            <div class="greeting">Secure Access Request</div>
                            <p class="message">
                                We received a request to reset the password for your administrative account. 
                                Use the One-Time Password (OTP) below to verify your identity.
                            </p>
                            
                            <div class="otp-box">
                                <div class="otp-code">{otp}</div>
                                <div class="expiry">Valid for 5 Minutes</div>
                            </div>
                            
                            <p class="message" style="margin-bottom: 0; font-size: 14px;">
                                If you did not request this, please ignore this email or contact the system administrator immediately.
                            </p>
                        </div>
                        <div class="footer">
                            &copy; 2026 Pinobite Global. All rights reserved.<br>
                            Internal Administrative System
                        </div>
                    </div>
                </body>
                </html>
                """

                # Send Email using the establish utility
                if send_email(email, "Password Reset OTP - Pinobite", html_message):
                    return Response({"message": "OTP sent to email."})
                else:
                    return Response(
                        {"error": "Failed to deliver email. Please try again later."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            except User.DoesNotExist:
                # Security: Don't reveal user existence
                return Response({"message": "OTP sent to email."})
            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            otp = serializer.validated_data["otp"]
            try:
                user = User.objects.get(email=email)
                otp_record = (
                    PasswordResetOTP.objects.filter(user=user, otp=otp)
                    .order_by("-created_at")
                    .first()
                )

                if otp_record and otp_record.is_valid():
                    return Response({"message": "OTP verified.", "valid": True})
                else:
                    return Response(
                        {"error": "Invalid or expired OTP."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid details."}, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SetNewPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            otp = serializer.validated_data["otp"]
            new_password = serializer.validated_data["new_password"]

            try:
                user = User.objects.get(email=email)
                otp_record = (
                    PasswordResetOTP.objects.filter(user=user, otp=otp)
                    .order_by("-created_at")
                    .first()
                )

                if otp_record and otp_record.is_valid():
                    user.set_password(new_password)
                    user.save()
                    # Invalidate OTP - or just rely on expiry. Deleting ensures one-time use.
                    otp_record.delete()
                    return Response({"message": "Password reset successfully."})
                else:
                    return Response(
                        {"error": "Invalid or expired OTP."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid details."}, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterSubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]

            subscriber, created = NewsletterSubscriber.objects.get_or_create(
                email=email, defaults={"is_active": True}
            )

            if not created and not subscriber.is_active:
                subscriber.is_active = True
                subscriber.save()
                return Response({"message": "Welcome back! You've been resubscribed."})
            elif not created and subscriber.is_active:
                return Response({"message": "You're already subscribed!"})

            return Response({"message": "Successfully subscribed to newsletter!"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterUnsubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            subscriber = NewsletterSubscriber.objects.get(email=email)
            subscriber.is_active = False
            subscriber.save()
            return Response(
                {"message": "You've been unsubscribed from the newsletter."}
            )
        except NewsletterSubscriber.DoesNotExist:
            return Response(
                {"error": "Email not found in our subscribers list."},
                status=status.HTTP_404_NOT_FOUND,
            )


class NewsletterSubscriberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsletterSubscriber.objects.filter(is_active=True)
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [permissions.IsAuthenticated]


from django.utils import timezone


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        # Admin can see all announcements
        if self.request.user and self.request.user.is_staff:
            return Announcement.objects.all().order_by("-created_at")

        # Others only see active and scheduled ones
        qs = Announcement.objects.filter(is_active=True)
        now = timezone.now()
        return qs.filter(start_date__lte=now, end_date__gte=now).order_by("-created_at")

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class DistributorApplicationViewSet(viewsets.ModelViewSet):
    queryset = DistributorApplication.objects.all().order_by("-created_at")
    serializer_class = DistributorApplicationSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class RewardRuleViewSet(viewsets.ModelViewSet):
    queryset = RewardRule.objects.all()
    serializer_class = RewardRuleSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsStaffUser()]

    def create(self, request, *args, **kwargs):
        return Response(
            {"error": "Reward Rules are hardcoded. You cannot add new ones."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"error": "Reward Rules are hardcoded. You cannot delete them."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class RewardTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RewardTransaction.objects.all().order_by("-timestamp")
    serializer_class = RewardTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return RewardTransaction.objects.all().order_by("-timestamp")
        return RewardTransaction.objects.filter(user=self.request.user).order_by(
            "-timestamp"
        )


from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from .video_processor import process_google_drive_video_to_mp4


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).order_by("-added_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def toggle(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response(
                {"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
            wishlist_item = WishlistItem.objects.filter(
                user=request.user, product=product
            ).first()
            if wishlist_item:
                wishlist_item.delete()
                return Response({"status": "removed"})
            else:
                WishlistItem.objects.create(user=request.user, product=product)
                return Response({"status": "added"})
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["post"])
    def share(self, request):
        """Create a shareable wishlist link"""
        from .models import WishlistShareLink
        import secrets
        from django.utils import timezone
        from datetime import timedelta

        items = WishlistItem.objects.filter(user=request.user)
        if not items.exists():
            return Response(
                {"error": "Wishlist is empty"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Generate unique token
        token = secrets.token_urlsafe(32)

        # Create share link (expires in 30 days)
        share_link = WishlistShareLink.objects.create(
            user=request.user,
            token=token,
            expires_at=timezone.now() + timedelta(days=30),
        )

        frontend_url = getattr(settings, "FRONTEND_URL", "https://pinobite.com")
        share_url = f"{frontend_url}/wishlist/shared/{token}"

        return Response(
            {
                "share_url": share_url,
                "token": token,
                "items_count": items.count(),
                "expires_at": share_link.expires_at,
            }
        )

    @action(detail=False, methods=["get"])
    def get_shared(self, request):
        """Get a shared wishlist by token (public endpoint)"""
        from .models import WishlistShareLink
        from django.utils import timezone

        token = request.query_params.get("token")
        if not token:
            return Response(
                {"error": "Token required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            share_link = WishlistShareLink.objects.get(token=token, is_active=True)
        except WishlistShareLink.DoesNotExist:
            return Response(
                {"error": "Invalid or expired share link"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if share_link.expires_at < timezone.now():
            share_link.is_active = False
            share_link.save()
            return Response(
                {"error": "Share link has expired"}, status=status.HTTP_404_NOT_FOUND
            )

        # Get user's wishlist items
        items = WishlistItem.objects.filter(user=share_link.user)
        serializer = WishlistItemSerializer(items, many=True)

        return Response(
            {
                "user": share_link.user.username,
                "items": serializer.data,
                "expires_at": share_link.expires_at,
            }
        )

    @action(detail=False, methods=["post"])
    def add_all_to_cart(self, request):
        """Add all wishlist items to user's cart (authenticated user imports shared wishlist)"""
        source_token = request.data.get("token")
        if not source_token:
            return Response(
                {"error": "token required"}, status=status.HTTP_400_BAD_REQUEST
            )

        from .models import WishlistShareLink
        from django.utils import timezone

        try:
            share_link = WishlistShareLink.objects.get(
                token=source_token, is_active=True
            )
        except WishlistShareLink.DoesNotExist:
            return Response(
                {"error": "Invalid share link"}, status=status.HTTP_404_NOT_FOUND
            )

        if share_link.expires_at < timezone.now():
            return Response(
                {"error": "Share link expired"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Add source user's wishlist items to current user's cart
        source_items = WishlistItem.objects.filter(user=share_link.user)
        added_count = 0

        for item in source_items:
            # Check if already in my wishlist
            existing = WishlistItem.objects.filter(
                user=request.user, product=item.product
            ).first()
            if not existing:
                WishlistItem.objects.create(user=request.user, product=item.product)
                added_count += 1

        return Response({"status": "added", "added_count": added_count})


class ProcessDriveVideoView(APIView):
    permission_classes = [permissions.AllowAny]  # Or permissions.IsAuthenticated

    def post(self, request):
        drive_url = request.data.get("drive_url")
        if not drive_url:
            return Response(
                {"error": "drive_url is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            video_data = process_google_drive_video_to_mp4(drive_url)
            return Response(
                {
                    "mediaUrl": video_data["loop_url"],
                    "fullVideoUrl": video_data["full_url"],
                    "mediaType": "video",
                }
            )
        except Exception as e:
            import traceback

            traceback.print_exc()
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Serve Single Page Application
index_view = never_cache(TemplateView.as_view(template_name="index.html"))
