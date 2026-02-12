from rest_framework import viewsets, generics, permissions, status
from .models import Category, Product, Review, Event, BlogPost, Story, HeroSlide, Order, OrderItem, UserProfile, VisitorForm, VisitorSubmission
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import (
    CategorySerializer, ProductSerializer, ReviewSerializer,
    EventSerializer, BlogPostSerializer, StorySerializer,
    HeroSlideSerializer, OrderSerializer, OrderItemSerializer,
    UserSerializer, UserProfileSerializer, VisitorFormSerializer, VisitorSubmissionSerializer
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

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

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
