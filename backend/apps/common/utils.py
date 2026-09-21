from urllib.parse import quote

from django.conf import settings

from ..common.models import SiteSettings


def build_whatsapp_url(order) -> str:
    """
    Build a wa.me deep link pre-filled with an order summary, so the
    frontend can redirect the customer straight into a chat with the
    studio owner to finish a cheesecake purchase.

    `order` is an apps.orders.models.Order instance.
    """
    site = SiteSettings.load()

    item_lines = []
    for item in order.items.all():
        line = f"{item.quantity}x {item.name_snapshot}"
        if item.variant_snapshot:
            line += f" ({item.variant_snapshot})"
        item_lines.append(line)
    order_summary = "; ".join(item_lines)

    message = site.whatsapp_default_message.format(
        order_summary=order_summary,
        total=order.total,
        currency=settings.DEFAULT_CURRENCY,
        order_number=order.order_number,
        customer_name=order.contact_name or "",
    )
    return f"https://wa.me/{site.whatsapp_number}?text={quote(message)}"
