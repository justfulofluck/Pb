from rest_framework import viewsets, generics, permissions, status
from .models import Category, Product, Review, Event, BlogPost, Story, HeroSlide, Order, OrderItem, UserProfile, VisitorForm, VisitorSubmission
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import (
    CategorySerializer, ProductSerializer, ReviewSerializer,
    EventSerializer, BlogPostSerializer, StorySerializer,
    HeroSlideSerializer, OrderSerializer, OrderItemSerializer,
    UserSerializer, UserProfileSerializer, VisitorFormSerializer, VisitorSubmissionSerializer,
    RequestPasswordResetSerializer, VerifyOTPSerializer, SetNewPasswordSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filterset_fields = ['category', 'is_top_rated']
    search_fields = ['name', 'description']

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

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
            
            if order.status == 'Shipped':
                contents += "\n\nIt is on its way to you!"
            elif order.status == 'Delivered':
                contents += "\n\nWe hope you enjoy your purchase!"
            elif order.status == 'Cancelled':
                contents += "\n\nIf you have any questions, please contact support."
            
            contents += "\n\nBest regards,\nPinobite Team"

            # Use the utility function which uses yagmail
            send_email(order.user.email, subject, contents)

    @action(detail=False, methods=['post'])
    def initiate(self, request):
        user = request.user
        items = request.data.get('items', [])
        shipping_address = request.data.get('shipping_address', {})
        
        if not items:
            return Response({'error': 'No items provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_amount = 0
        order_items_data = []
        
        for item in items:
            try:
                product = Product.objects.get(id=item['id'])
                quantity = item.get('quantity', 1)
                price = product.price
                total_amount += price * quantity
                
                order_items_data.append({
                    'product': product,
                    'price': price,
                    'quantity': quantity,
                    'product_name': product.name
                })
            except Product.DoesNotExist:
                return Response({'error': f"Product {item['id']} not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Create localized Order record
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            status='Pending',
            shipping_address=f"{shipping_address.get('street', '')}, {shipping_address.get('city', '')}, {shipping_address.get('state', '')}, {shipping_address.get('zip', '')}"
        )
        
        for item_data in order_items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                product_name=item_data['product_name'],
                price=item_data['price'],
                quantity=item_data['quantity']
            )

        # Create Razorpay Order
        client = get_razorpay_client()
        razorpay_amount = int(total_amount * 100) # Amount in paise
        razorpay_order = client.order.create({
            'amount': razorpay_amount,
            'currency': 'INR',
            'receipt': str(order.id),
            'payment_capture': 1
        })
        
        order.razorpay_order_id = razorpay_order['id']
        order.save()
        
        return Response({
            'order_id': order.id,
            'razorpay_order_id': razorpay_order['id'],
            'amount': razorpay_amount,
            'currency': 'INR',
            'key_id': settings.RAZORPAY_KEY_ID
        })

    @action(detail=False, methods=['post'])
    def verify(self, request):
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')
        order_id = request.data.get('order_id')
        
        client = get_razorpay_client()
        
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            
            order = Order.objects.get(id=order_id, razorpay_order_id=razorpay_order_id)
            order.status = 'Processing' # Or Paid
            order.razorpay_payment_id = razorpay_payment_id
            order.save()
            
            # Send Email
            send_email(
                request.user.email,
                f"Order Confirmed #{order.id}",
                f"Thank you for your order! Your payment ID is {razorpay_payment_id}. We are processing it."
            )
            
            return Response({'status': 'Payment verified successfully'})
            
        except Exception as e:
            print(f"Verification Failed: {e}")
            return Response({'error': 'Signature verification failed'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_profile(self, request):
        profile = request.user.profile
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
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
                            <p style="margin: 5px 0 0; color: #166534;"><strong>Date:</strong> {submission.submitted_at.strftime('%B %d, %Y')}</p>
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
                html_message=html_message
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
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                if not user.is_staff:
                     return Response({"error": "Only staff members can reset passwords here."}, status=status.HTTP_403_FORBIDDEN)
                
                # Generate OTP
                otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
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

                # Send Email
                send_mail(
                    'Password Reset OTP - Pinobite Admin',
                    f'Your OTP is: {otp}. Valid for 5 minutes.',
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                    html_message=html_message
                )
                return Response({"message": "OTP sent to email."})

            except User.DoesNotExist:
                # Security: Don't reveal user existence
                return Response({"message": "OTP sent to email."})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            try:
                user = User.objects.get(email=email)
                otp_record = PasswordResetOTP.objects.filter(user=user, otp=otp).order_by('-created_at').first()
                
                if otp_record and otp_record.is_valid():
                    return Response({"message": "OTP verified.", "valid": True})
                else:
                    return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                 return Response({"error": "Invalid details."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SetNewPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']

            try:
                user = User.objects.get(email=email)
                otp_record = PasswordResetOTP.objects.filter(user=user, otp=otp).order_by('-created_at').first()

                if otp_record and otp_record.is_valid():
                    user.set_password(new_password)
                    user.save()
                    # Invalidate OTP - or just rely on expiry. Deleting ensures one-time use.
                    otp_record.delete() 
                    return Response({"message": "Password reset successfully."})
                else:
                    return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": "Invalid details."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

# Serve Single Page Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))
