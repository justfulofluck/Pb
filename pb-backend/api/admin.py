from django.contrib import admin
from .models import Category, Product, Review, Event, BlogPost, Story, HeroSlide, Order, OrderItem, UserProfile, VisitorForm, VisitorSubmission, Announcement, RewardRule, RewardTransaction, UsageIdea

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

class UsageIdeaInline(admin.TabularInline):
    model = UsageIdea
    extra = 1

@admin.register(UsageIdea)
class UsageIdeaAdmin(admin.ModelAdmin):
    list_display = ('title', 'product', 'order')
    list_filter = ('product',)
    search_fields = ('title', 'description')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'stock', 'is_top_rated')
    list_filter = ('category', 'is_top_rated')
    search_fields = ('name', 'description')
    inlines = [UsageIdeaInline]

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

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('message', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'start_date', 'end_date')

@admin.register(RewardRule)
class RewardRuleAdmin(admin.ModelAdmin):
    list_display = ('event_name', 'points', 'is_enabled')
    list_filter = ('is_enabled',)
    
    def has_delete_permission(self, request, obj=None):
        # Admins cannot delete reward rules
        return False

    def has_add_permission(self, request):
        # Admins cannot add new reward rules (they are fixed in code)
        return False

    # Optional: make event_name read-only so it can't be changed to something non-existent
    readonly_fields = ('event_name',)

@admin.register(RewardTransaction)
class RewardTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'points_change', 'reason', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('user__username', 'reason')
