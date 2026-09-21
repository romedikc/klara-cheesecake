from django.db import models
from django.template.defaultfilters import slugify

from ..common.models import AbstractReview, PublishableStatus, TimeStampedModel


class CheesecakeCategory(TimeStampedModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Cheesecake categories"
        ordering = ["sort_order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CheesecakeTagLabel(models.TextChoices):
    BESTSELLER = "bestseller", "Bestseller"
    SEASONAL = "seasonal", "Seasonal"
    NEW = "new", "New"
    GIFT = "gift", "Gift"
    NONE = "", "None"


class Cheesecake(TimeStampedModel):
    category = models.ForeignKey(
        CheesecakeCategory, on_delete=models.PROTECT, related_name="cheesecakes"
    )
    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    short_description = models.CharField(max_length=280, blank=True)
    description = models.TextField(blank=True)
    ingredients = models.JSONField(
        default=list, blank=True,
    )
    allergen_info = models.CharField(max_length=255, blank=True)

    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    badge = models.CharField(max_length=20, choices=CheesecakeTagLabel.choices, blank=True)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)

    prep_hours = models.PositiveIntegerField(
        default=48
    )
    is_available = models.BooleanField(
        default=True
    )
    status = models.CharField(max_length=10, choices=PublishableStatus.choices, default=PublishableStatus.ACTIVE)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def is_on_sale(self) -> bool:
        return bool(self.old_price and self.old_price > self.base_price)

    @property
    def average_rating(self):
        agg = self.reviews.filter(is_approved=True).aggregate(models.Avg("rating"))
        return round(agg["rating__avg"], 1) if agg["rating__avg"] else None

    @property
    def reviews_count(self):
        return self.reviews.filter(is_approved=True).count()


class CheesecakeImage(models.Model):
    cheesecake = models.ForeignKey(Cheesecake, on_delete=models.CASCADE, related_name="images")
    image = models.URLField()
    alt_text = models.CharField(max_length=180, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"Image<{self.cheesecake.name} #{self.pk}>"


class CheesecakeVariant(models.Model):
    cheesecake = models.ForeignKey(Cheesecake, on_delete=models.CASCADE, related_name="variants")
    name = models.CharField(max_length=80, help_text='e.g. "Medium"')
    portion_note = models.CharField(max_length=80, blank=True, help_text='e.g. "8-10 servings"')
    price_delta = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
    )
    is_default = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        unique_together = ["cheesecake", "name"]

    def __str__(self):
        return f"{self.cheesecake.name} — {self.name}"

    @property
    def price(self):
        return self.cheesecake.base_price + self.price_delta


class CheesecakeReview(AbstractReview):
    cheesecake = models.ForeignKey(Cheesecake, on_delete=models.CASCADE, related_name="reviews")

    def __str__(self):
        return f"{self.rating}★ on {self.cheesecake.name} by {self.author_name}"


class DeliveryBlackoutDate(models.Model):
    date = models.DateField(unique=True)
    reason = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.date} ({self.reason})" if self.reason else str(self.date)
