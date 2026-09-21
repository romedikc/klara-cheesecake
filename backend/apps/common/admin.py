from django.contrib import admin

from ..common.models import ContactMessage, SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Singleton admin — always edits/creates the single row with pk=1."""

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "topic", "is_resolved", "created_at"]
    list_filter = ["topic", "is_resolved"]
    search_fields = ["name", "email", "message"]
