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
    UsageIdea,
    FormVerificationOTP,
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
    FormSendOTPSerializer,
    FormVerifyOTPSerializer,
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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        cache_key = "category_list"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, 86400)  # Cache for 24 hours
        return response


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "is_top_rated"]
    search_fields = ["name", "description"]
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductSerializer

    def list(self, request, *args, **kwargs):
        # Generate a cache key based on query parameters
        query_params = request.query_params.urlencode()
        cache_key = f"product_list_{query_params}"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"Cache get failed: {e}")

        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        try:
            # Cache for 5 minutes (300 seconds)
            cache.set(cache_key, data, 300)
            
            # Keep track of list cache keys for invalidation
            list_keys = cache.get("product_list_keys", set())
            if isinstance(list_keys, set):
                list_keys.add(cache_key)
                cache.set("product_list_keys", list_keys, 86400) # 24h
        except Exception as e:
            print(f"Cache set failed: {e}")
            
        return Response(data)

    def get_object(self):
        queryset = self.get_queryset()
        lookup = self.kwargs.get('pk')
        if lookup is not None:
            try:
                return queryset.get(slug=lookup)
            except (Product.DoesNotExist, ValueError):
                return queryset.get(pk=lookup)
        return super().get_object()

    def retrieve(self, request, *args, **kwargs):
        lookup = kwargs.get("pk", "")
        cache_key = f"product_detail_{lookup}"
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

    def _invalidate_product_caches(self, pk):
        try:
            # Invalidate detail cache
            cache.delete(f"product_detail_{pk}")
            
            # Invalidate all list caches
            list_keys = cache.get("product_list_keys", set())
            if isinstance(list_keys, set):
                for key in list_keys:
                    cache.delete(key)
                cache.delete("product_list_keys")
            
            # Also clear category-related caches if any
            cache.delete("category_list")
        except Exception as e:
            print(f"Cache invalidation failed: {e}")

    def _handle_usage_ideas(self, product, request):
        """Sync usage ideas from request data for a product."""
        usage_ideas_data = request.data.get('usage_ideas', None)
        if usage_ideas_data is None:
            return  # Not provided in request, don't touch existing ideas

        # Delete all existing usage ideas and recreate from payload
        product.usage_ideas.all().delete()

        if not isinstance(usage_ideas_data, list):
            return

        for idx, idea_data in enumerate(usage_ideas_data):
            if not isinstance(idea_data, dict):
                continue
            title = idea_data.get('title', '').strip()
            description = idea_data.get('description', '').strip()
            image_data = idea_data.get('image', '')
            order = idea_data.get('order', idx)

            if not title:
                continue  # Skip empty titled ideas

            idea = UsageIdea(
                product=product,
                title=title,
                description=description,
                order=order,
            )

            # Handle base64 image
            if image_data and isinstance(image_data, str) and image_data.startswith('data:'):
                import base64
                from django.core.files.base import ContentFile
                try:
                    format_part, img_str = image_data.split(';base64,')
                    ext = format_part.split('/')[-1]
                    if ext == 'jpeg':
                        ext = 'jpg'
                    decoded = base64.b64decode(img_str)
                    idea.image.save(
                        f"usage_{product.id}_{idx}.{ext}",
                        ContentFile(decoded),
                        save=False
                    )
                except Exception as e:
                    print(f"Error saving usage idea image: {e}")
            elif image_data and isinstance(image_data, str) and not image_data.startswith('data:'):
                # It's an existing URL path — just keep reference
                # Strip /media/ prefix if present for the FileField
                clean_path = image_data
                if clean_path.startswith('/media/'):
                    clean_path = clean_path[7:]
                elif clean_path.startswith('http'):
                    # External URL or full URL — store the path part
                    from urllib.parse import urlparse
                    parsed = urlparse(clean_path)
                    clean_path = parsed.path
                    if clean_path.startswith('/media/'):
                        clean_path = clean_path[7:]
                idea.image.name = clean_path

            idea.save()

    def perform_update(self, serializer):
        try:
            super().perform_update(serializer)
            self._handle_usage_ideas(serializer.instance, self.request)
            self._invalidate_product_caches(serializer.instance.pk)
        except Exception as e:
            print(f"ERROR in perform_update: {e}")
            import traceback
            traceback.print_exc()
            raise

    def perform_destroy(self, instance):
        pk = instance.pk
        super().perform_destroy(instance)
        self._invalidate_product_caches(pk)

    def perform_create(self, serializer):
        super().perform_create(serializer)
        self._handle_usage_ideas(serializer.instance, self.request)
        self._invalidate_product_caches(serializer.instance.pk)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        from django.utils import timezone
        from django.db.models import Q
        from datetime import datetime

        try:
            today = datetime.now().date()
            # Show: active OR scheduled for future
            return Event.objects.filter(
                Q(is_active=True) | Q(scheduled_date__gt=today)
            ).order_by("-id")
        except:
            # Fallback to just active
            return Event.objects.filter(is_active=True).order_by("-id")


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # pagination_class = PageNumberPagination

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_object(self):
        queryset = self.get_queryset()
        lookup = self.kwargs.get('pk')
        if lookup is not None:
            try:
                return queryset.get(slug=lookup)
            except (BlogPost.DoesNotExist, ValueError):
                return queryset.get(pk=lookup)
        return super().get_object()

    def get_queryset(self):
        # Admin list view: show all posts (including inactive/scheduled)
        # Public list view: only show active posts
        if self.action == 'list':
            if self.request.user.is_staff:
                return BlogPost.objects.all().order_by("-id")
            return BlogPost.objects.filter(is_active=True).order_by("-id")
        return BlogPost.objects.all().order_by("-id")

    def _handle_usage_recipes(self, post, request):
        usage_recipes = request.data.get('usage_recipes', None)
        if usage_recipes is None:
            return

        import base64
        import uuid
        import json
        from django.core.files.base import ContentFile
        from django.core.files.storage import default_storage

        new_recipes = []
        if isinstance(usage_recipes, str):
            try:
                usage_recipes = json.loads(usage_recipes)
            except json.JSONDecodeError:
                usage_recipes = []

        if not isinstance(usage_recipes, list):
            return

        for idx, recipe_data in enumerate(usage_recipes):
            if not isinstance(recipe_data, dict):
                continue
            
            image_data = recipe_data.get('image', '')
            if image_data and isinstance(image_data, str) and image_data.startswith('data:'):
                try:
                    format_part, img_str = image_data.split(';base64,')
                    ext = format_part.split('/')[-1]
                    if ext == 'jpeg':
                        ext = 'jpg'
                    decoded = base64.b64decode(img_str)
                    file_name = f"blog/recipes/recipe_{post.id}_{uuid.uuid4().hex[:8]}.{ext}"
                    path = default_storage.save(file_name, ContentFile(decoded))
                    recipe_data['image'] = f"/media/{path}"
                except Exception as e:
                    print(f"Error saving blog usage recipe image: {e}")
            elif image_data and isinstance(image_data, str) and not image_data.startswith('data:'):
                clean_path = image_data
                if clean_path.startswith('/media/'):
                    clean_path = clean_path[7:]
                elif clean_path.startswith('http'):
                    from urllib.parse import urlparse
                    parsed = urlparse(clean_path)
                    clean_path = parsed.path
                    if clean_path.startswith('/media/'):
                        clean_path = clean_path[7:]
                recipe_data['image'] = f"/media/{clean_path}" if not clean_path.startswith('/media/') else clean_path
                
            new_recipes.append(recipe_data)

        post.usage_recipes = new_recipes
        post.save(update_fields=['usage_recipes'])

    def perform_update(self, serializer):
        super().perform_update(serializer)
        self._handle_usage_recipes(serializer.instance, self.request)

    def perform_create(self, serializer):
        super().perform_create(serializer)
        self._handle_usage_recipes(serializer.instance, self.request)


class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        print("DEBUG: Story Post Data:", request.data)
        return super().create(request, *args, **kwargs)


class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


from .utils import get_razorpay_client, send_email, send_order_confirmation_emails
from django.conf import settings
import hmac
import hashlib
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


@method_decorator(csrf_exempt, name="dispatch")
class RazorpayWebhookView(APIView):
    """
    Razorpay Webhook Endpoint — Server-to-server payment confirmation.

    Razorpay sends a POST request here whenever a payment event occurs.
    This ensures orders are marked as paid even if the user's browser
    closes before the frontend /verify/ call completes.
    """

    permission_classes = [AllowAny]
    authentication_classes = []  # No auth — Razorpay can't send JWT tokens

    def post(self, request):
        # 1. Get the raw body and Razorpay signature from headers
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        if not webhook_secret:
            print("[Webhook] ERROR: RAZORPAY_WEBHOOK_SECRET is not configured")
            return Response(
                {"error": "Webhook secret not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        webhook_signature = request.META.get("HTTP_X_RAZORPAY_SIGNATURE", "")
        webhook_body = request.body.decode("utf-8")

        # 2. Verify the signature (HMAC SHA256 handshake)
        expected_signature = hmac.new(
            key=webhook_secret.encode("utf-8"),
            msg=webhook_body.encode("utf-8"),
            digestmod=hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected_signature, webhook_signature):
            print("[Webhook] ERROR: Signature mismatch — rejecting request")
            return Response(
                {"error": "Invalid signature"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3. Parse the event
        try:
            payload = json.loads(webhook_body)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event = payload.get("event", "")
        print(f"[Webhook] Received event: {event}")

        # 4. Handle payment.captured event
        if event == "payment.captured":
            payment_entity = (
                payload.get("payload", {}).get("payment", {}).get("entity", {})
            )
            razorpay_order_id = payment_entity.get("order_id", "")
            razorpay_payment_id = payment_entity.get("id", "")

            if not razorpay_order_id:
                print("[Webhook] WARNING: No order_id in payment entity")
                return Response({"status": "ok"})

            try:
                order = Order.objects.get(razorpay_order_id=razorpay_order_id)

                # Only process if the order hasn't already been marked as paid
                if order.status == "PENDING":
                    # Deduct points if any were earmarked during initiate
                    if order.points_deducted > 0 and order.user:
                        from .utils import deduct_points
                        deduct_points(
                            order.user,
                            order.points_deducted,
                            f"Redeemed on Order #{order.id}",
                        )

                    order.status = "PAID"
                    order.razorpay_payment_id = razorpay_payment_id
                    order.save()

                    # Award points
                    from .utils import award_points

                    original_amount = float(order.total_amount) + (order.points_deducted / 10)
                    spend_points = int(original_amount / 100) * 10
                    if spend_points > 0 and order.user:
                        award_points(
                            order.user,
                            "purchase",
                            custom_points=spend_points,
                            reason_override=f"Points earned on Order #{order.id}",
                        )

                    # First order bonus
                    if order.user:
                        order_count = Order.objects.filter(
                            user=order.user,
                            status__in=["PAID", "SHIPPED", "DELIVERED"],
                        ).count()
                        if order_count == 1:
                            award_points(order.user, "first_order")

                    # Send confirmation emails
                    send_order_confirmation_emails(order, razorpay_payment_id)

                    print(
                        f"[Webhook] ✅ Order #{order.id} marked as Processing via webhook"
                    )
                else:
                    print(
                        f"[Webhook] Order #{order.id} already in status '{order.status}' — skipping"
                    )

            except Order.DoesNotExist:
                print(
                    f"[Webhook] WARNING: No order found for razorpay_order_id={razorpay_order_id}"
                )

        elif event == "payment.failed":
            payment_entity = (
                payload.get("payload", {}).get("payment", {}).get("entity", {})
            )
            razorpay_order_id = payment_entity.get("order_id", "")
            print(
                f"[Webhook] ⚠️ Payment failed for razorpay_order_id={razorpay_order_id}"
            )

        # Always return 200 so Razorpay doesn't keep retrying
        return Response({"status": "ok"})


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

            if order.status == "SHIPPED":
                contents += "\n\nIt is on its way to you!"
            elif order.status == "DELIVERED":
                contents += "\n\nWe hope you enjoy your purchase!"
            elif order.status == "CANCELLED":
                contents += "\n\nIf you have any questions, please contact support."

            contents += "\n\nBest regards,\nPinobite Team"

            # Use the utility function which uses yagmail
            send_email(order.user.email, subject, contents)

    @action(detail=False, methods=["post"])
    def initiate(self, request):
        from django.db import transaction

        try:
            user = request.user
            items = request.data.get("items", [])
            shipping_address = request.data.get("shipping_address", {})
            use_points = request.data.get("use_points", False)
            points_to_redeem = request.data.get("points_to_redeem", 0)
            payment_method = request.data.get("payment_method", "online")

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
                status="PENDING",
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
                profile, _ = UserProfile.objects.get_or_create(user=request.user)
                profile.phone = request.data.get("phone", profile.phone)
                # Use the concatenated address or just street? Frontend matches 'address' to street.
                # Let's use the shipping_address dict parts
                shipping_addr = request.data.get("shipping_address", {})
                profile.address = shipping_addr.get("street", profile.address)
                profile.city = shipping_addr.get("city", profile.city)
                profile.state = shipping_addr.get("state", profile.state)
                profile.pin_code = shipping_addr.get("zip", profile.pin_code)
                profile.save()
                
                # Save names to the base User model if they don't exist
                user_obj = request.user
                first_name = request.data.get("first_name")
                last_name = request.data.get("last_name")
                updated = False
                if first_name and not user_obj.first_name:
                    user_obj.first_name = first_name
                    updated = True
                if last_name and not user_obj.last_name:
                    user_obj.last_name = last_name
                    updated = True
                if updated:
                    user_obj.save(update_fields=["first_name", "last_name"])

            # Calculate Shipping (tax is included in product price)
            shipping = 0  # Free shipping requirement

            special_cod_fee = 0
            if payment_method == "special_cod":
                special_cod_fee = 5000

            # Process points redemption if requested
            points_discount = 0
            points_deducted = 0
            if use_points and points_to_redeem > 0 and request.user.is_authenticated:
                max_redeemable = min(points_to_redeem, int(total_amount * 10))
                if max_redeemable > 0:
                    points_discount = max_redeemable // 10
                    points_deducted = max_redeemable

            # New total including shipping, less points discount
            final_total = total_amount + shipping + special_cod_fee - points_discount

            # Store points_deducted on order (actual deduction happens after payment)
            order.points_deducted = points_deducted
            order.total_amount = final_total
            order.save()

            if payment_method in ["cod", "special_cod"]:
                if order.points_deducted > 0 and request.user.is_authenticated:
                    from .utils import deduct_points
                    deduct_points(
                        request.user,
                        order.points_deducted,
                        f"Redeemed on Order #{order.id}",
                    )

                order.status = "PAID"
                order.save()
                
                total_awarded = 0
                if request.user.is_authenticated:
                    from .utils import award_points
                    original_amount = float(order.total_amount) + (order.points_deducted / 10)
                    spend_points = int(original_amount / 100) * 10
                    if spend_points > 0:
                        total_awarded += award_points(
                            request.user,
                            "purchase",
                            custom_points=spend_points,
                            reason_override=f"Points earned on Order #{order.id}",
                        )
                    
                    order_count = Order.objects.filter(
                        user=request.user,
                        status__in=["PAID", "SHIPPED", "DELIVERED"],
                    ).count()
                    if order_count == 1:
                        total_awarded += award_points(request.user, "first_order")

                send_order_confirmation_emails(order, "Cash on Delivery")

                return Response({
                    "is_cod": True,
                    "order_id": order.id,
                    "points_discount": points_discount,
                    "points_deducted": points_deducted,
                    "new_total": float(final_total),
                    "points_earned": total_awarded,
                })

            # Create Razorpay Order
            razorpay_amount = int(final_total * 100)  # Amount in paise
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
                order.save()
            except Exception as e:
                # If Razorpay fails, we shouldn't just crash.
                # We can return an error to the frontend so it knows why.
                return Response(
                    {"error": f"Razorpay order creation failed: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {
                    "order_id": order.id,
                    "razorpay_order_id": razorpay_order["id"],
                    "amount": razorpay_amount,
                    "currency": "INR",
                    "key_id": settings.RAZORPAY_KEY_ID,
                    "points_discount": points_discount,
                    "points_deducted": points_deducted,
                    "new_total": float(final_total),
                }
            )
        except Exception as e:
            import traceback
            print(f"Error in order initiate: {e}")
            traceback.print_exc()
            return Response(
                {"error": f"Order creation failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["post"])
    def verify(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id", "")
        razorpay_payment_id = request.data.get("razorpay_payment_id", "")
        razorpay_signature = request.data.get("razorpay_signature", "")
        order_id = request.data.get("order_id")

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

            if order.status != "PENDING":
                return Response(
                    {"error": "Order already processed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Deduct points if any were earmarked during initiate
            if order.points_deducted > 0 and order.user:
                from .utils import deduct_points
                deduct_points(
                    order.user,
                    order.points_deducted,
                    f"Redeemed on Order #{order.id}",
                )

            order.status = "PAID"
            order.razorpay_payment_id = razorpay_payment_id
            order.save()

            total_awarded = 0
            from .utils import award_points

            # 1. Standard Spend Points (₹100 = 10 pts)
            original_amount = float(order.total_amount) + (order.points_deducted / 10)
            spend_points = int(original_amount / 100) * 10
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
                status__in=["PAID", "SHIPPED", "DELIVERED"],
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

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def change_password(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"error": "Both current_password and new_password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 6:
            return Response(
                {"error": "New password must be at least 6 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password == new_password:
            return Response(
                {"error": "New password must be different from current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response({"status": "Password changed successfully."})


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

        # Send Confirmation Email if email exists in submission_data
        try:
            email = submission.submission_data.get("email", "")
            name = submission.submission_data.get("name", "Visitor")
            if email:
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
                            <h2>Hello {name},</h2>
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
                    [email],
                    fail_silently=True,
                    html_message=html_message,
                )
        except Exception as e:
            print(f"Error sending email: {e}")


class SendFormOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, form_id):
        serializer = FormSendOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        email = serializer.validated_data["email"]

        otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
        FormVerificationOTP.objects.create(email=email, otp=otp)

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
                .otp-box {{ background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }}
                .otp-code {{ font-size: 36px; font-weight: bold; color: #166534; letter-spacing: 8px; }}
                .content {{ color: #444; line-height: 1.6; }}
                .footer {{ margin-top: 30px; text-align: center; font-size: 12px; color: #888; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Pino<span>bite</span></div>
                </div>
                <div class="content">
                    <h2>Verify your email</h2>
                    <p>Use the OTP below to verify your email and access the form.</p>
                    <div class="otp-box">
                        <div class="otp-code">{otp}</div>
                        <p style="margin: 10px 0 0; color: #888; font-size: 13px;">This code expires in 10 minutes.</p>
                    </div>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
                <div class="footer">&copy; 2026 Pinobite. All rights reserved.</div>
            </div>
        </body>
        </html>
        """

        try:
            send_mail(
                "Verify your email - Pinobite",
                f"Your OTP is {otp}. It expires in 10 minutes.",
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
                html_message=html_message,
            )
            return Response({"message": "OTP sent successfully."})
        except Exception as e:
            print(f"Error sending email: {e}")
            return Response({"error": "Failed to send email."}, status=500)


class VerifyFormOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, form_id):
        serializer = FormVerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        record = (
            FormVerificationOTP.objects.filter(email=email, otp=otp, verified=False)
            .order_by("-created_at")
            .first()
        )
        if record and record.is_valid():
            record.verified = True
            record.save()
            return Response({"verified": True, "email": email})
        return Response({"error": "Invalid or expired OTP."}, status=400)


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

    def perform_create(self, serializer):
        application = serializer.save()
        from .utils import send_distributor_application_emails

        send_distributor_application_emails(application)


class RewardRuleViewSet(viewsets.ModelViewSet):
    queryset = RewardRule.objects.all()
    serializer_class = RewardRuleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        # Only staff can modify
        if not self.request.user.is_staff:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


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

        # Get frontend URL for product links
        frontend_url = getattr(settings, "FRONTEND_URL", "https://pinobite.com")

        # Generate individual product links instead of wishlist page
        product_links = []
        for item in items:
            product_links.append(
                {
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "product_price": str(item.product.price),
                    "product_image": item.product.image,
                    "product_url": f"{frontend_url}/product/{item.product.id}",
                }
            )

        return Response(
            {
                "share_url": f"{frontend_url}/wishlist/shared/{token}",
                "product_links": product_links,
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
                    "posterUrl": video_data["poster_url"],
                    "mediaType": "video",
                }
            )
        except Exception as e:
            import traceback

            traceback.print_exc()
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =============================================================================
# SEO Meta-Tag Injection View
# =============================================================================
import re as _re
from django.template.loader import get_template
from django.http import HttpResponse
from django.utils.html import escape as _escape

_PAGE_META = {
    "/": {
        "title": "Pinobite | Fuel Your Body with Goodness",
        "description": "Discover Pinobite — premium healthy energy bars, nut butters, and superfoods crafted to fuel your active lifestyle. 100% natural, delicious nutrition.",
    },
    "/shop": {
        "title": "Shop Premium Healthy Snacks | Pinobite",
        "description": "Browse Pinobite's collection of energy bars, nut butters, and superfoods. Fuel your body with 100% natural, delicious goodness.",
    },
    "/about": {
        "title": "About Pinobite | Our Story & Mission",
        "description": "Learn the Pinobite story — how we're on a mission to create delicious, nutritious snacks that fuel your body and delight your taste buds.",
    },
    "/journey": {
        "title": "Our Journey | Pinobite",
        "description": "Follow Pinobite's journey from a small kitchen to a global brand. Discover how we're changing the way the world snacks.",
    },
    "/contact": {
        "title": "Contact Pinobite | Get in Touch",
        "description": "Have a question? Contact the Pinobite team. We'd love to hear from you about our products, orders, or anything else.",
    },
    "/events": {
        "title": "Events | Pinobite",
        "description": "Discover upcoming Pinobite events — tastings, workshops, and community gatherings. Join us and fuel your body with goodness.",
    },
    "/blogs": {
        "title": "Blog | Pinobite",
        "description": "Explore the Pinobite blog for healthy recipes, wellness tips, lifestyle inspiration, and the latest news about our products.",
    },
    "/distributors": {
        "title": "Become a Distributor | Pinobite",
        "description": "Partner with Pinobite as a distributor. Bring premium healthy snacks to your community and grow with us.",
    },
    "/faq": {
        "title": "Frequently Asked Questions | Pinobite",
        "description": "Find answers to common questions about Pinobite products, ordering, shipping, returns, and more.",
    },
    "/terms": {
        "title": "Terms & Conditions | Pinobite",
        "description": "Read the terms and conditions governing the use of Pinobite's website and services.",
    },
    "/privacy": {
        "title": "Privacy Policy | Pinobite",
        "description": "Read how Pinobite collects, uses, and protects your personal information in our privacy policy.",
    },
    "/refund": {
        "title": "Refund & Cancellation Policy | Pinobite",
        "description": "Learn about Pinobite's refund, return, and cancellation policies for online orders.",
    },
    "/shipping": {
        "title": "Shipping Policy | Pinobite",
        "description": "Learn about Pinobite's shipping options, delivery timelines, and shipping costs.",
    },
}

_NOINDEX_PREFIXES = ("/admin", "/checkout", "/dashboard", "/forms")

def _should_noindex(path):
    for prefix in _NOINDEX_PREFIXES:
        if path == prefix or path.startswith(prefix):
            return True
    return False

_DEFAULT_TITLE = "Pinobite | Fuel Your Body with Goodness"
_DEFAULT_DESCRIPTION = "Discover Pinobite — premium healthy energy bars, nut butters, and superfoods."
_DEFAULT_OG_IMAGE = "https://pinobite.com/logos/og-image.png"


def _clean_product_desc(desc: str, product_name: str) -> str:
    raw = _re.sub(r"<[^>]+>", "", desc).strip()
    raw = _re.sub(r"Benefits\s*", "", raw, flags=_re.IGNORECASE)
    raw = _re.sub(r"[✨⚡❤️🍯🥜🌿🔥🍓🍫🥣✅💪🌾?❓⭐⏺★•●▶→▪–—]+", "", raw)
    raw = _re.sub(r"\n+", " ", raw)
    raw = _re.sub(r"\s{2,}", " ", raw).strip()
    if raw and len(raw) > 20:
        return raw
    return f"{product_name} — a premium product from Pinobite, made with carefully selected natural ingredients."


_SHIPPING_DETAILS = {
    "@type": "OfferShippingDetails",
    "shippingRate": {
        "@type": "MonetaryAmount",
        "value": 99,
        "currency": "INR",
    },
    "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "IN",
    },
    "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY",
        },
        "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 5,
            "unitCode": "DAY",
        },
    },
}

_RETURN_POLICY = {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "IN",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 7,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn",
}


PIXEL_CODE = """<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1051641060621997');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1051641060621997&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->"""

@never_cache
def _inject_meta_view(request):
    raw_path = request.path_info
    normalized_path = raw_path.rstrip("/") or "/"

    should_noindex = _should_noindex(normalized_path)

    meta_title = _DEFAULT_TITLE
    meta_description = _DEFAULT_DESCRIPTION
    og_image = _DEFAULT_OG_IMAGE
    og_type = "website"

    product = None
    post = None
    event = None

    if normalized_path in _PAGE_META:
        page = _PAGE_META[normalized_path]
        meta_title = page["title"]
        meta_description = page["description"]

    elif normalized_path.startswith("/product/"):
        slug = normalized_path.split("/product/")[-1]
        try:
            product = Product.objects.get(slug=slug)
            meta_title = f"{product.name} | Buy Online | Pinobite"
            meta_description = _clean_product_desc(product.description, product.name)[:155]
            if product.image:
                og_image = request.build_absolute_uri(product.image.url)
            og_type = "product"
        except Product.DoesNotExist:
            pass

    elif normalized_path.startswith("/blog/"):
        slug = normalized_path.split("/blog/")[-1]
        try:
            post = BlogPost.objects.get(slug=slug)
            meta_title = f"{post.title} | Pinobite Blog"
            excerpt = post.excerpt or ""
            meta_description = (excerpt[:152] + "...") if len(excerpt) > 155 else excerpt
            if post.image:
                og_image = request.build_absolute_uri(post.image.url)
            og_type = "article"
        except BlogPost.DoesNotExist:
            pass

    elif normalized_path.startswith("/events/"):
        event_id = normalized_path.split("/events/")[-1]
        try:
            event = Event.objects.get(pk=event_id)
            meta_title = f"{event.title} | Pinobite Events"
            summary = event.summary or ""
            meta_description = (summary[:152] + "...") if len(summary) > 155 else summary
            if event.image:
                og_image = request.build_absolute_uri(event.image.url)
        except (Event.DoesNotExist, ValueError):
            pass

    e_title = _escape(meta_title)
    e_description = _escape(meta_description)
    e_url = _escape(request.build_absolute_uri(raw_path))
    e_image = _escape(og_image)

    meta_block = f"""
    <title>{e_title}</title>
    <meta name="description" content="{e_description}">
    <link rel="canonical" href="{e_url}">
    <meta property="og:title" content="{e_title}">
    <meta property="og:description" content="{e_description}">
    <meta property="og:url" content="{e_url}">
    <meta property="og:image" content="{e_image}">
    <meta property="og:type" content="{og_type}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{e_title}">
    <meta name="twitter:description" content="{e_description}">
    <meta name="twitter:image" content="{e_image}">
"""

    if should_noindex:
        meta_block += '    <meta name="robots" content="noindex, nofollow">\n'

    base_url = f"https://{request.get_host()}"
    site_url = base_url
    page_url = f"{base_url}{raw_path}"

    schemas = []

    breadcrumb_items = [{"position": 1, "name": "Home", "item": site_url}]
    if normalized_path != "/":
        parts = [p for p in normalized_path.split("/") if p]
        accum = ""
        breadcrumb_label_map = {
            "shop": "Shop", "about": "About", "journey": "Our Journey",
            "contact": "Contact", "events": "Events", "blogs": "Blog",
            "distributors": "Distributors", "faq": "FAQ", "terms": "Terms & Conditions",
            "privacy": "Privacy Policy", "refund": "Refund & Cancellation",
            "shipping": "Shipping Policy", "product": "Shop", "blog": "Blog",
        }
        content_type_parts = {"product", "blog", "events"}
        for i, part in enumerate(parts):
            accum += "/" + part
            label = breadcrumb_label_map.get(part, part.replace("-", " ").title())
            is_content_type = part in content_type_parts
            is_slug_after_content = i > 0 and parts[i - 1] in content_type_parts
            if is_content_type:
                label = breadcrumb_label_map[part]
            elif is_slug_after_content:
                if parts[i - 1] == "product" and product:
                    label = product.name
                elif parts[i - 1] == "blog" and post:
                    label = post.title
                elif parts[i - 1] == "events" and event:
                    label = event.title
            breadcrumb_items.append({
                "position": len(breadcrumb_items) + 1,
                "name": label,
                "item": site_url + accum,
            })

    schemas.append({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": it["position"],
             "name": it["name"], "item": it["item"]}
            for it in breadcrumb_items
        ],
    })

    if normalized_path == "/":
        schemas.append({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pinobite",
            "url": site_url,
            "logo": "https://pinobite.com/logos/Pinobite-logo.png",
            "sameAs": [
                "https://www.instagram.com/pinobite",
                "https://www.facebook.com/pinobite",
            ],
        })
        schemas.append({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Pinobite",
            "url": site_url,
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"{site_url}/shop?search={{search_term_string}}",
                "query-input": "required name=search_term_string",
            },
        })

    elif normalized_path.startswith("/product/") and product:
        sale_price = float(product.price)
        orig_price = float(product.original_price) if product.original_price else sale_price
        clean_desc = _clean_product_desc(product.description, product.name)
        product_schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": clean_desc,
            "image": og_image if og_image != _DEFAULT_OG_IMAGE else None,
            "sku": product.slug,
            "brand": {"@type": "Brand", "name": "Pinobite"},
            "offers": {
                "@type": "Offer",
                "url": page_url,
                "priceCurrency": "INR",
                "price": sale_price,
                "priceValidUntil": "2027-12-31",
                "availability": (
                    "https://schema.org/InStock"
                    if getattr(product, "stock", 0) > 0
                    else "https://schema.org/OutOfStock"
                ),
                "itemCondition": "https://schema.org/NewCondition",
                "shippingDetails": _SHIPPING_DETAILS,
                "hasMerchantReturnPolicy": _RETURN_POLICY,
            },
        }
        review_count = getattr(product, "review_count", 0) or 0
        if review_count > 0:
            product_schema["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": getattr(product, "rating", 0) or 0,
                "reviewCount": review_count,
            }
        schemas.append(product_schema)

    elif normalized_path.startswith("/blog/") and post:
        schemas.append({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": meta_description,
            "image": og_image if og_image != _DEFAULT_OG_IMAGE else None,
            "datePublished": post.date.isoformat() if hasattr(post, "date") and post.date else None,
            "author": {"@type": "Person", "name": getattr(post, "author", "Pinobite") or "Pinobite"},
            "publisher": {"@type": "Organization", "name": "Pinobite"},
        })

    elif normalized_path.startswith("/events/") and event:
        schemas.append({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "description": meta_description,
            "image": og_image if og_image != _DEFAULT_OG_IMAGE else None,
            "startDate": event.date.isoformat() if hasattr(event, "date") and event.date else None,
            "location": {
                "@type": "Place",
                "name": getattr(event, "location", "") or "",
            },
        })

    elif normalized_path == "/faq":
        faq_data = [
            ("What is the shelf life of Pinobite products?",
             "Most Pinobite products have a shelf life of 6-9 months from the date of manufacture. "
             "Check the packaging for the best-before date specific to each product."),
            ("Are Pinobite products 100% natural?",
             "Yes, all Pinobite products are made with 100% natural ingredients. We use no artificial "
             "preservatives, flavors, or colors. Our nut butters are made from carefully selected nuts "
             "with no added refined sugar or hydrogenated oils."),
            ("Does Pinobite offer vegan products?",
             "Absolutely. Most of our products, including all nut butters and energy bars, are plant-based "
             "and vegan-friendly. Each product page lists detailed ingredients so you can verify."),
            ("Are Pinobite products gluten-free?",
             "Our muesli and oats contain gluten. Our peanut butters are naturally gluten-free. "
             "Please check individual product labels for the most accurate allergen information."),
            ("Do Pinobite products contain added sugar?",
             "Our nut butters contain no added refined sugar. Some products like our Dark Chocolate varieties "
             "use natural sweeteners or dark chocolate with minimal sugar. Check the nutrition facts on each product page."),
            ("How should I store Pinobite peanut butter?",
             "Store in a cool, dry place away from direct sunlight. Natural peanut butter may separate — simply "
             "stir before use. Refrigeration is not required but can extend freshness."),
            ("What payment methods does Pinobite accept?",
             "We accept all major credit and debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, "
             "Paytm), Net Banking, and Cash on Delivery (COD) for eligible orders."),
            ("How long does shipping take?",
             "We process orders within 24 hours. Standard delivery takes 3-7 business days across India. "
             "Metro cities typically receive orders within 2-4 business days."),
            ("Does Pinobite offer free shipping?",
             "Yes, we offer free shipping on all orders above Rs. 299. Orders below this amount have a "
             "nominal shipping fee calculated at checkout."),
            ("What is Pinobite's return policy?",
             "We offer a 7-day return policy from the date of delivery. If you receive a damaged or defective "
             "product, contact us at support@pinobite.com with your order details and we will arrange a replacement."),
            ("Can I order in bulk or wholesale?",
             "Yes, we offer bulk and wholesale pricing for businesses, gyms, cafes, and retailers. Visit our "
             "Distributors page or email distributors@pinobite.com for customized pricing."),
            ("Does Pinobite ship internationally?",
             "Currently, we ship across India. International shipping will be available soon. "
             "Sign up for our newsletter to get notified when we launch globally."),
            ("How can I track my order?",
             "Once your order is shipped, you will receive a tracking link via email and SMS. "
             "You can also track your order from the My Orders section in your account dashboard."),
            ("What if I receive a damaged product?",
             "We take utmost care in packaging, but if your order arrives damaged, please email us photos "
             "at support@pinobite.com within 48 hours of delivery. We will issue a full refund or replacement."),
            ("Can I cancel my order after placing it?",
             "You can cancel within 2 hours of placing the order by logging into your account. "
             "After that, if the order has already been processed, please contact support for assistance."),
        ]
        schemas.append({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": q,
                 "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in faq_data
            ],
        })

    schema_block = ""
    for s in schemas:
        cleaned = {k: v for k, v in s.items() if v is not None}
        schema_block += f'    <script type="application/ld+json">{json.dumps(cleaned, ensure_ascii=False)}</script>\n'

    if "text/markdown" in request.META.get("HTTP_ACCEPT", ""):
        from config.urls import llms_txt
        resp = llms_txt(request)
        resp["Content-Type"] = "text/markdown; charset=utf-8"
        return resp

    template = get_template("index.html")
    html = template.render({}, request)

    html = _re.sub(r"<title>[^<]*</title>", "", html, count=1, flags=_re.IGNORECASE)
    html = html.replace("<head>", "<head>\n" + meta_block + schema_block + PIXEL_CODE)

    response = HttpResponse(html, content_type="text/html; charset=utf-8")
    response["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response["Pragma"] = "no-cache"
    response["Expires"] = "0"
    response["Link"] = (
        '</llms.txt>; rel="service-doc", '
        '</sitemap.xml>; rel="sitemap", '
        '</api/docs/>; rel="service-doc"'
    )
    return response


index_view = _inject_meta_view
