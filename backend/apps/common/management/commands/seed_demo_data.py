from django.core.management.base import BaseCommand
from django.db import transaction

from apps.cakes.models import (
    Cheesecake, CheesecakeCategory, CheesecakeImage, CheesecakeTagLabel,
    CheesecakeVariant,
)
from apps.common.models import SiteSettings
from apps.courses.models import Course, CourseInclusion, CourseLevel, CourseTag, Lesson, Module
from apps.payments.models import PaymentProvider


class Command(BaseCommand):
    help = "Seeds demo data matching the Klara Cheesecakes UI mockups (idempotent)."

    @transaction.atomic
    def handle(self, *args, **options):
        self._seed_site_settings()
        self._seed_cheesecakes()
        self._seed_courses()
        self._seed_payment_providers()
        self.stdout.write(self.style.SUCCESS("Demo data seeded."))

    def _seed_site_settings(self):
        settings_obj = SiteSettings.load()
        settings_obj.studio_name = "Klara Cheesecakes"
        settings_obj.whatsapp_number = "996700123456"
        settings_obj.contact_email = "hello@klaracheesecakes.ru"
        settings_obj.contact_phone = "+7 (925) 123-45-67"
        settings_obj.address = "12 Primernaya St, Moscow"
        settings_obj.working_hours = "Mon-Sat: 9:00-20:00"
        settings_obj.save()

    def _seed_cheesecakes(self):
        classic, _ = CheesecakeCategory.objects.get_or_create(name="Classic", defaults={"sort_order": 1})
        seasonal, _ = CheesecakeCategory.objects.get_or_create(name="Seasonal", defaults={"sort_order": 2})
        vegan, _ = CheesecakeCategory.objects.get_or_create(name="Vegan", defaults={"sort_order": 3})
        gift, _ = CheesecakeCategory.objects.get_or_create(name="Gift sets", defaults={"sort_order": 4})

        cakes_data = [
            dict(category=classic, name="Basque Cheesecake", base_price=1900,
                 badge=CheesecakeTagLabel.BESTSELLER,
                 short_description="Caramelized crust, silky-soft center. Serves 8-10.",
                 image="https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=900&q=80"),
            dict(category=seasonal, name="Raspberry Swirl", base_price=2100,
                 badge=CheesecakeTagLabel.SEASONAL,
                 short_description="New York style with a fresh berry ribbon.",
                 image="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80"),
            dict(category=classic, name="Lemon & Thyme", base_price=2000,
                 badge=CheesecakeTagLabel.NEW,
                 short_description="Bright and herbal, on a brown-butter base.",
                 image="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80"),
            dict(category=classic, name="Chocolate Velvet", base_price=2200,
                 short_description="Belgian chocolate and mascarpone. Rich and dense.",
                 image="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"),
            dict(category=vegan, name="Cashew & Vanilla", base_price=2400, is_vegan=True,
                 short_description="100% plant-based, no-bake. Silky nut cream.",
                 image="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80"),
            dict(category=gift, name="Trio Gift Set", base_price=4900, badge=CheesecakeTagLabel.GIFT,
                 short_description="Basque, raspberry and lemon, gift-packaged.",
                 image="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80"),
        ]

        for data in cakes_data:
            image_url = data.pop("image")
            cake, created = Cheesecake.objects.get_or_create(
                name=data["name"], defaults={**data, "description": data["short_description"]},
            )
            if created:
                CheesecakeImage.objects.create(cheesecake=cake, image=image_url, is_primary=True)
                CheesecakeVariant.objects.create(cheesecake=cake, name="Small", portion_note="4-6 servings", price_delta=0)
                CheesecakeVariant.objects.create(cheesecake=cake, name="Medium", portion_note="8-10 servings", price_delta=0, is_default=True)
                CheesecakeVariant.objects.create(cheesecake=cake, name="Large", portion_note="14-16 servings", price_delta=600)

    def _seed_courses(self):
        tag_names = ["New York style", "No-bake", "Japanese", "Basque", "Texture", "Plating"]
        tags = {name: CourseTag.objects.get_or_create(name=name)[0] for name in tag_names}

        courses_data = [
            dict(title="Cheesecake Fundamentals", level=CourseLevel.BEGINNER, price=6900, old_price=9900,
                 short_description="Master four classic styles and stop fighting cracks.",
                 cover_image="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
                 tags=["New York style", "No-bake", "Japanese", "Basque"],
                 modules=[("Introduction & ingredients", ["Welcome to the course", "Choosing cream cheese",
                                                           "Tools & equipment", "Ingredient temperature - the big secret"]),
                          ("New York classic", ["Graham cracker crust", "Mixing the filling", "Water bath & baking",
                                                 "Cooling & slicing", "Troubleshooting"])]),
            dict(title="The Perfect Basque", level=CourseLevel.INTERMEDIATE, price=8900,
                 short_description="Texture, timing, and that caramelized crust.",
                 cover_image="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=900&q=80",
                 tags=["Basque", "Texture"],
                 modules=[("Why high heat works", ["The science of the crust", "Batter & pan prep"])]),
            dict(title="Plating & Seasonal Flavors", level=CourseLevel.ADVANCED, price=11900,
                 short_description="Restaurant-style plating, glazes, and fruit work.",
                 cover_image="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80",
                 tags=["Plating"],
                 modules=[("Mirror glaze basics", ["Tempering", "Pouring technique"])]),
            dict(title="Sell From Your Kitchen", level=CourseLevel.BUSINESS, price=9900,
                 short_description="Pricing, packaging, and delivery for a home bakery.",
                 cover_image="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
                 tags=[],
                 modules=[("Getting your first customers", ["Pricing your bakes", "Packaging on a budget"])]),
        ]

        for data in courses_data:
            modules = data.pop("modules")
            tag_list = data.pop("tags")
            course, created = Course.objects.get_or_create(
                title=data["title"], defaults={**data, "description": data["short_description"]},
            )
            if created:
                course.tags.set([tags[t] for t in tag_list])
                for i, (module_title, lessons) in enumerate(modules):
                    module = Module.objects.create(course=course, title=module_title, sort_order=i)
                    for j, lesson_title in enumerate(lessons):
                        Lesson.objects.create(
                            module=module, title=lesson_title, sort_order=j,
                            duration_seconds=420, is_free_preview=(i == 0 and j < 2),
                        )
                for i, text in enumerate([
                    "Video lessons with lifetime access", "Printable PDF recipes",
                    "Access on phone and desktop", "Private student chat",
                    "Certificate of completion",
                ]):
                    CourseInclusion.objects.create(course=course, text=text, sort_order=i)

    def _seed_payment_providers(self):
        PaymentProvider.objects.get_or_create(
            key="card_gateway",
            defaults=dict(display_name="Bank Card", description="Visa/Mastercard via hosted checkout",
                          icon="💳", sort_order=1),
        )
        PaymentProvider.objects.get_or_create(
            key="local_gateway",
            defaults=dict(display_name="Local Payment System", description="Local e-wallet / QR payment",
                          icon="📱", sort_order=2),
        )
