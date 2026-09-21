# Klara Cheesecakes — Backend

Django + Django REST Framework backend for an online cheesecake shop with two
product types that have **different purchase flows**:

- **Cheesecakes** — browse and view details; "buying" hands the customer off
  to WhatsApp (pre-filled message with the order summary). No online payment.
- **Courses** — requires an account; purchase goes through a payment page
  with a choice of (currently two, stub) payment providers; on success the
  course unlocks on the user's personal account page.

This maps directly to the pages found in the provided HTML mockups:
homepage, cheesecake catalog/detail, course catalog/detail, cart, checkout,
thank-you, and contacts.

## Why it's structured this way

| Frontend page | Backend concern |
|---|---|
| Cheesecake catalog/detail (size, delivery date, gallery, reviews) | `apps.cakes`: `Cheesecake`, `CheesecakeVariant`, `CheesecakeImage`, `CheesecakeReview`, delivery-slot calculation |
| Course catalog/detail (modules/lessons, instructor, countdown, "what's included") | `apps.courses`: `Course`, `Module`, `Lesson` (locked unless enrolled/preview), `CourseInclusion`, `CourseReview`, `Enrollment` |
| Cart & checkout | `apps.orders`: `Cart`/`CartItem` (works for guests via session, or logged-in users), `Order`/`OrderItem`, and a `checkout_cart()` service that is the fork between the two flows |
| Contacts page / "message us on WhatsApp" | `apps.common`: `SiteSettings` (singleton studio info) + `build_whatsapp_url()` |
| Payment page with 2 provider options | `apps.payments`: DB-backed `PaymentProvider` + `Payment`, with a **Strategy pattern** (`gateways.py`) decoupling the app from any specific provider SDK |
| Sign up / login / personal account | `apps.accounts`: custom `User` + `Profile`, JWT auth |

### The checkout fork (the core of the two flows)

`POST /api/orders/checkout/` always does the same thing: turn the current
cart into an `Order`. What happens next depends on what's in the cart:

- **Cheesecake-only cart** → `Order.status = awaiting_whatsapp_contact`.
  Response includes `whatsapp_url` (a `wa.me` deep link with a pre-filled
  order summary) — no authentication required, no payment collected in-app.
- **Cart containing a course** → requires an authenticated user (`403` if
  not logged in). `Order.status = awaiting_payment`, a pending `Enrollment`
  is created for each course, and the response points the frontend at
  `/api/payments/providers/` to continue into the payment page.

### Payments are intentionally not "finished"

Per the brief, the real payment integration is still being decided. Rather
than guess at a provider and hard-code it, `apps/payments/gateways.py`
defines a small `BasePaymentGateway` interface (`create_payment_session`,
`parse_webhook`) with two placeholder implementations (`CardGateway`,
`LocalGateway`) registered by string key. `PaymentProvider` rows in the
database point at these keys. To integrate a real provider later:

1. Implement a new class against the real SDK.
2. Register it in `PROVIDER_REGISTRY`.
3. Add/update a `PaymentProvider` row (via admin) with a matching `key`.

No changes are needed to models, serializers, views, or the order flow.

A `POST /api/payments/payments/<id>/confirm/` endpoint is provided **for
development only** (`DEBUG=True`) to simulate a successful payment —
marking the order paid and activating enrollments — so the rest of the
stack can be built/tested before a real gateway exists. A `webhooks/<key>/`
placeholder shows where real async provider callbacks will land.

## Project layout

```
klara_backend/          # Django project (settings, root urls)
apps/
  accounts/              # custom User, Profile, JWT auth endpoints
  common/                 # SiteSettings, ContactMessage, shared base models, WhatsApp util
  cakes/                  # Cheesecake catalog
  courses/                # Course catalog + curriculum + enrollments
  orders/                 # Cart, Order, checkout service
  payments/               # PaymentProvider, Payment, gateway strategy layer
manage.py
requirements.txt
.env.example
```

Each app follows the same internal shape: `models.py`, `serializers.py`,
`views.py`, `urls.py`, `admin.py` (+ `filters.py`, `services.py`,
`gateways.py`, `permissions.py` where relevant).

## API overview

Auth (`/api/auth/`):
- `POST register/`, `POST login/`, `POST refresh/`, `GET/PATCH me/`

Cheesecakes (`/api/cakes/`):
- `GET /`, `GET /{slug}/`, `GET /categories/`
- `GET|POST /{slug}/reviews/`, `GET /{slug}/delivery-slots/`

Courses (`/api/courses/`):
- `GET /`, `GET /{slug}/` (lesson URLs locked unless enrolled/free preview)
- `GET|POST /{slug}/reviews/`, `GET /tags/`
- `GET /my-enrollments/` (auth required — personal account "my courses")

Orders (`/api/orders/`):
- `GET /cart/`, `POST /cart/items/`, `PATCH|DELETE /cart/items/{id}/`
- `POST /checkout/` — see the fork described above
- `GET /history/` (auth required — order history)

Payments (`/api/payments/`):
- `GET /providers/`
- `POST /intents/` `{order_id, provider_key}` (auth required)
- `GET /payments/`, `GET /payments/{id}/`, `POST /payments/{id}/confirm/` (DEBUG only)
- `POST /webhooks/{provider_key}/` (placeholder)

Misc: `GET /api/site-settings/`, `POST /api/contact-messages/`,
interactive docs at `/api/docs/` (OpenAPI schema at `/api/schema/`).

## Setup

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env — set DATABASE_URL for PostgreSQL, or leave unset for sqlite.

python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data   # optional: cheesecakes, courses, payment providers
python manage.py runserver
```

Then:
- API root: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`
- Docs: `http://localhost:8000/api/docs/`

### Using PostgreSQL

```
DATABASE_URL=postgres://klara:klara@localhost:5432/klara
```

`dj-database-url` reads this; any relational DB URL it supports works the
same way (the code has no Postgres-specific assumptions).

### Important admin setup after first deploy

Open `/admin/common/sitesettings/` and set the real `whatsapp_number`
(digits only, E.164, no `+`) — this is what the cheesecake purchase flow
uses to build the `wa.me` link. Also review `PaymentProvider` rows under
`/admin/payments/paymentprovider/`.

## Notes / deliberate simplifications

- Cart is per-user (logged in) or per-session (guest); a course can sit in
  a guest's cart, but checkout requires login as soon as one is present.
- `CheesecakeImage.image` / `Course.cover_image` are URL fields for now
  (matches the mockups, which reference hosted Unsplash images) — swap for
  `ImageField` + storage backend when real asset uploads are needed.
- Delivery date availability is computed from `prep_hours` + a small
  `DeliveryBlackoutDate` table rather than a fixed list, so it stays correct
  as "today" moves forward.
- Reviews are moderated via `is_approved` (default `True`); flip the
  default in `apps.common.models.AbstractReview` if you want a manual
  approval queue instead.
