from rest_framework import serializers

from ..common.models import ContactMessage, SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "studio_name", "contact_email", "contact_phone", "address",
            "working_hours", "instagram_url", "telegram_url", "tiktok_url",
            "youtube_url",
            # whatsapp_number/message template are intentionally excluded —
            # they're an internal detail used server-side to build wa.me links.
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "topic", "name", "email", "message", "created_at"]
        read_only_fields = ["id", "created_at"]
