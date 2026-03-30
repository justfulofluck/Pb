from rest_framework import viewsets, generics, permissions, status
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
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "is_top_rated"]
    search_fields = ["name", "description"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductSerializer

    def list(self, request, *args, **kwargs):
        cache_key = f"products_list_{request.GET.urlencode()}"
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"Cache get failed: {e}")

        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        try:
            cache.set(cache_key, serializer.data, 300)
        except Exception as e:
            print(f"Cache set failed: {e}")
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


class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer


class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer


from .utils import get_razorpay_client, send_email
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
        user = request.user
        items = request.data.get("items", [])
        shipping_address = request.data.get("shipping_address", {})

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

            # Send Email
            send_email(
                request.user.email,
                f"Order Confirmed #{order.id}",
                f"Thank you for your order! Your payment ID is {razorpay_payment_id}. We are processing it.",
            )

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
                if rule.is_enabled:
                    response.data["points_earned"] = rule.points
                else:
                    response.data["points_earned"] = 0
            except RewardRule.DoesNotExist:
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
from .video_processor import process_google_drive_video_to_gif


class ProcessDriveVideoView(APIView):
    permission_classes = [permissions.AllowAny]  # Or permissions.IsAuthenticated

    def post(self, request):
        drive_url = request.data.get("drive_url")
        if not drive_url:
            return Response(
                {"error": "drive_url is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            gif_url = process_google_drive_video_to_gif(drive_url)
            return Response({"mediaUrl": gif_url})
        except Exception as e:
            import traceback

            traceback.print_exc()
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Serve Single Page Application
index_view = never_cache(TemplateView.as_view(template_name="index.html"))
