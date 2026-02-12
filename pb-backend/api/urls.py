from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    CategoryViewSet, ProductViewSet, ReviewViewSet, 
    EventViewSet, BlogPostViewSet, StoryViewSet, HeroSlideViewSet, 
    OrderViewSet, UserViewSet, RegisterView, VisitorFormViewSet, VisitorSubmissionViewSet,
    RequestPasswordResetView, VerifyOTPView, SetNewPasswordView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'events', EventViewSet)
router.register(r'blog-posts', BlogPostViewSet)
router.register(r'stories', StoryViewSet)
router.register(r'hero-slides', HeroSlideViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'users', UserViewSet)
router.register(r'visitor-forms', VisitorFormViewSet)
router.register(r'visitor-submissions', VisitorSubmissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/request/', RequestPasswordResetView.as_view(), name='password_reset_request'),
    path('password-reset/verify/', VerifyOTPView.as_view(), name='password_reset_verify'),
    path('password-reset/confirm/', SetNewPasswordView.as_view(), name='password_reset_confirm'),
]
