## Stack

- **Vite** + **React 18** + **TypeScript** (`.tsx`)
- **React Router DOM** for client-side routing
- **Redux Toolkit** + **React Redux** for state management
- **Tailwind CSS** - CSS styles

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  main.tsx              # entry: Redux Provider + Router
  App.tsx               # route definitions
  index.css             # Tailwind directives
  styles/
    shared.css          # ported design system (variables, buttons, cards, footer…)
  data/                 # mock data + assets
    images.ts           # central registry of image URLs (assets)
    products.ts         # cake catalog + Basque product detail
    courses.ts          # course catalog + Foundations course detail
    cart.ts             # seeded cart + delivery fee
  store/                # Redux Toolkit
    index.ts            # store config
    hooks.ts            # typed useAppDispatch / useAppSelector
    cartSlice.ts        # cart items, quantities, totals (selectors)
    productsSlice.ts    # products (seeded from mock data)
    coursesSlice.ts     # courses (seeded from mock data)
  lib/
    api.ts              # Axios instance for future data fetching
    format.ts           # currency / number / pluralization helpers
  components/           # Navbar, Footer, Strip, ProductCard, ScrollToTop
  pages/                # one component + one scoped CSS file per route
    Home, Cakes, Product, Courses, Course,
    Cart, Checkout, Contacts, About, ThankYou
  types/                # shared TypeScript types
```

## Routes

| Path            | Page                    |
| --------------- | ----------------------- |
| `/`             | Landing                 |
| `/cakes`        | Cheesecake catalog      |
| `/cakes/:id`    | Product detail          |
| `/courses`      | Course catalog          |
| `/courses/:id`  | Course detail           |
| `/cart`         | Cart                    |
| `/checkout`     | Checkout                |
| `/contacts`     | Contacts + FAQ          |
| `/about`        | About the baker         |
| `/thank-you`    | Order confirmation      |

## Notes on state & data

- The store is currently **seeded from mock data** in `src/data/`