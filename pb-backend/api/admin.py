from django.contrib import admin
from .models import Category, Product, Review, Event, BlogPost, Story, HeroSlide, Order, OrderItem, UserProfile, VisitorForm, VisitorSubmission

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'stock', 'is_top_rated')
    list_filter = ('category', 'is_top_rated')
    search_fields = ('name', 'description')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'product', 'rating', 'date')
    list_filter = ('rating', 'date')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date')
    search_fields = ('title', 'location')

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'post_type', 'author', 'date')
    list_filter = ('post_type', 'author')

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'media_type', 'product_id')

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ('headline', 'category', 'is_active')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'tier', 'savings')
    list_filter = ('tier',)
    search_fields = ('user__username', 'user__email')

admin.site.register(VisitorForm)
admin.site.register(VisitorSubmission)
