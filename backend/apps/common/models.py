from django.core.exceptions import ValidationError
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishableStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    ACTIVE = "active", "Active"
    ARCHIVED = "archived", "Archived"


class SiteSettings(models.Model):
    studio_name = models.CharField(max_length=120, default="Klara Cheesecakes")
    whatsapp_number = models.CharField(
        max_length=32,
    )
    whatsapp_default_message = models.TextField(
        default=(
            "Hi! I'd like to order: {order_summary}. "
            "Total: {total} {currency}. Order #{order_number}."
        ),
    )
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=32, blank=True)
    address = models.CharField(max_length=255, blank=True)
    working_hours = models.CharField(max_length=255, blank=True)
    instagram_url = models.URLField(blank=True)
    telegram_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # singleton: never actually delete

    @classmethod
    def load(cls) -> "SiteSettings":
        obj, _ = cls.objects.get_or_create(pk=1, defaults={"whatsapp_number": "000000000000"})
        return obj

    def __str__(self):
        return self.studio_name


class ContactTopic(models.TextChoices):
    ORDER_DELIVERY = "order_delivery", "Order / delivery"
    COURSES = "courses", "Courses"
    PARTNERSHIP = "partnership", "Partnership"
    OTHER = "other", "Other"


class ContactMessage(TimeStampedModel):
    topic = models.CharField(max_length=20, choices=ContactTopic.choices, default=ContactTopic.OTHER)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.get_topic_display()}] {self.name} ({self.created_at:%Y-%m-%d})"


def validate_rating(value):
    if not (1 <= value <= 5):
        raise ValidationError("Rating must be between 1 and 5.")


class AbstractReview(TimeStampedModel):
    author_name = models.CharField(max_length=120)
    rating = models.PositiveSmallIntegerField(validators=[validate_rating])
    text = models.TextField()
    is_approved = models.BooleanField(
        default=True,
        help_text="Unapproved reviews are hidden from the public API.",
    )

    class Meta:
        abstract = True
        ordering = ["-created_at"]
