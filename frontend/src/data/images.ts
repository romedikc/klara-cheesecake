/**
 * Central registry of remote image assets used across the site.
 * Keeping them in one file makes it easy to swap sources later
 * (e.g. move to a CDN or local /assets folder).
 */
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

export const images = {
  cakeBasque: unsplash('photo-1524351199678-941a58a3df50'),
  cakeRaspberry: unsplash('photo-1565958011703-44f9829ba187'),
  cakeLemon: unsplash('photo-1488477181946-6428a0291777'),
  cakeChocolate: unsplash('photo-1606313564200-e75d5e30476c'),
  cakeCashew: unsplash('photo-1533134242443-d4fd215305ad'),
  cakeGiftSet: unsplash('photo-1464349095431-e9a21285b5f3'),

  basqueGallery2: unsplash('photo-1567171466295-4afa63d45416'),
  basqueGallery3: unsplash('photo-1607344645866-009c320b63e0'),

  courseFoundations: unsplash('photo-1556910103-1c02745aae4d'),
  courseBasque: unsplash('photo-1466637574441-749b8f19452f'),
  courseSeasonal: unsplash('photo-1486427944299-d1955d23e34d'),
  courseBusiness: unsplash('photo-1556909114-f6e7ad7d3136'),

  portrait: unsplash('photo-1544005313-94ddf0286df2'),
} as const
