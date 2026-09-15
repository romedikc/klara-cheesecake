import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectProductDetail, selectProductsByIds } from '../store/productsSlice'
import { addItem } from '../store/cartSlice'
import { formatSom } from '../lib/format'
import { breadcrumb, btn, wrap } from '../lib/ui'

const TABS = ['Описание', 'Состав', 'Отзывы'] as const

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(Math.max(0, 5 - rating))
}

const optionPill = (active: boolean) =>
  `px-[18px] py-2 rounded-full border text-sm cursor-pointer transition-all duration-200 ${
    active
      ? 'border-accent text-accent bg-blush'
      : 'border-line bg-paper hover:border-accent hover:text-accent hover:bg-blush'
  }`

const tabBtn = (active: boolean) =>
  `px-6 py-3.5 text-sm font-semibold bg-none cursor-pointer border-b-2 -mb-px transition-all duration-200 ${
    active ? 'text-accent border-accent' : 'text-ink-soft border-transparent'
  }`

const optionLabel = 'text-[13px] font-semibold tracking-[0.06em] uppercase mb-3 text-ink'

export default function Product() {
  const { id = 'basque' } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const byId = useAppSelector(selectProductDetail(id))
  const fallback = useAppSelector(selectProductDetail('basque'))
  const product = byId ?? fallback

  const related = useAppSelector(selectProductsByIds(product.relatedIds))

  const [activeThumb, setActiveThumb] = useState(0)
  const [sizeIndex, setSizeIndex] = useState(product.defaultSizeIndex)
  const [dateIndex, setDateIndex] = useState(product.defaultDateIndex)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState(0)

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        kind: 'product',
        name: product.name,
        subtitle: `${product.sizes[sizeIndex]} · ${product.deliveryDates[dateIndex]}`,
        price: product.price,
        image: product.image,
      }),
    )
    navigate('/cart')
  }

  return (
    <>
      <Navbar />

      <div className={wrap}>
        <div className="pt-6">
          <div className={breadcrumb}>
            <Link to="/">Главная</Link>
            <span>›</span>
            <Link to="/cakes">Чизкейки</Link>
            <span>›</span>
            <span>{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[72px] items-start pt-14 pb-20 max-[900px]:grid-cols-1 max-[900px]:gap-10">
          <div>
            <div className="aspect-square rounded-[20px] overflow-hidden bg-cream mb-3.5">
              <img
                src={product.gallery[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-[inherit]"
              />
            </div>
            <div className="flex gap-2.5">
              {product.gallery.map((src, i) => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-[10px] overflow-hidden bg-beige cursor-pointer border-2 transition-colors duration-200 ${
                    i === activeThumb ? 'border-accent' : 'border-transparent'
                  }`}
                  onClick={() => setActiveThumb(i)}
                >
                  <img src={src} alt="" className="w-full h-full object-cover rounded-[inherit]" />
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-[94px] max-[900px]:static">
            <div className="flex gap-2 mb-4">
              {product.badge && (
                <span className="text-[11px] font-semibold tracking-[0.08em] uppercase px-3 py-1 rounded-full bg-accent text-white">
                  {product.badge}
                </span>
              )}
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase px-3 py-1 rounded-full bg-cream text-ink-soft border border-line">
                {product.tag}
              </span>
            </div>

            <h1 className="font-serif text-[clamp(36px,4vw,52px)] font-medium leading-[1.04] mb-2.5 [&_em]:italic [&_em]:text-accent">
              <em>Баскский</em> чизкейк
            </h1>

            <div className="flex items-center gap-2.5 mb-[22px] text-sm text-ink-soft">
              <span className="text-accent text-base tracking-[2px]">★★★★★</span>
              <span>{product.ratingValue.toFixed(1)}</span>
              <span>·</span>
              <span>{product.reviewsCount} отзывов</span>
            </div>

            <div className="flex items-baseline gap-4 mb-7">
              <span className="font-serif text-[44px] font-semibold">{formatSom(product.price)}</span>
              <span className="text-sm text-ink-soft">{product.priceNote}</span>
            </div>

            <p className="text-ink-soft text-[15px] leading-[1.7] mb-7">
              Карамельная корочка снаружи, бархатистая нежная середина внутри — это
              и есть настоящий баскский. Готовим в день отправки, без консервантов
              и стабилизаторов.
            </p>

            <div className="mb-6">
              <div className={optionLabel}>Размер</div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size, i) => (
                  <div key={size} className={optionPill(i === sizeIndex)} onClick={() => setSizeIndex(i)}>
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className={optionLabel}>Дата доставки</div>
              <div className="flex gap-2 flex-wrap">
                {product.deliveryDates.map((date, i) => (
                  <div key={date} className={optionPill(i === dateIndex)} onClick={() => setDateIndex(i)}>
                    {date}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className={optionLabel}>Количество</div>
              <div className="flex items-center border border-line rounded-full w-fit overflow-hidden">
                <button
                  className="w-11 h-11 cursor-pointer text-xl text-ink transition-colors duration-150 hover:bg-cream"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="w-10 text-center font-semibold text-base">{quantity}</span>
                <button
                  className="w-11 h-11 cursor-pointer text-xl text-ink transition-colors duration-150 hover:bg-cream"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3 items-center mt-7 flex-wrap">
              <button
                className={btn('solid', { lg: true, className: 'flex-1 justify-center min-w-[160px]' })}
                onClick={handleAddToCart}
              >
                В корзину
              </button>
              <button className="w-[50px] h-[50px] rounded-full border border-line bg-paper text-xl cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-accent hover:bg-blush shrink-0">
                ♡
              </button>
            </div>

            <div className="flex gap-[18px] mt-6 flex-wrap">
              <div className="flex items-center gap-2 text-[13px] text-ink-soft [&_span]:text-lg">
                <span>🚚</span> Доставка по городу
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-soft [&_span]:text-lg">
                <span>🧊</span> В термоупаковке
              </div>
              <div className="flex items-center gap-2 text-[13px] text-ink-soft [&_span]:text-lg">
                <span>⏰</span> 48 ч на заказ
              </div>
            </div>
          </div>
        </div>

        <div className="my-16">
          <div className="flex border-b border-line mb-9">
            {TABS.map((tab, i) => (
              <button key={tab} className={tabBtn(i === activeTab)} onClick={() => setActiveTab(i)}>
                {tab}
                {i === 2 ? ` (${product.reviewsCount})` : ''}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div>
              {product.longDescription.map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-base text-ink-soft max-w-[68ch] leading-[1.8] ${
                    i === 0 ? 'mb-5' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <div className="grid grid-cols-2 gap-3">
                {product.ingredients.map((ingredient) => (
                  <div
                    className="flex items-center gap-2.5 text-sm text-ink-soft before:content-['•'] before:text-accent before:text-lg"
                    key={ingredient}
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[13px] text-ink-soft">{product.allergens}</p>
            </div>
          )}

          {activeTab === 2 && (
            <div className="flex flex-col gap-6">
              {product.reviews.map((review, i) => (
                <div className="bg-cream rounded-[14px] p-6" key={i}>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-semibold text-[15px]">{review.author}</span>
                    <span className="text-accent">{stars(review.rating)}</span>
                  </div>
                  <p className="text-sm text-ink-soft leading-[1.6]">{review.text}</p>
                  <p className="text-xs text-ink-soft mt-2 opacity-60">{review.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="bg-blush py-20 max-[560px]:py-[60px]">
        <div className={wrap}>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-medium mb-9 [&_em]:italic [&_em]:text-accent">
            Вам также <em>понравится</em>
          </h2>
          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} cta="details" />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
