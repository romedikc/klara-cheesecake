import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  decrementQuantity,
  incrementQuantity,
  removeItem,
  selectCartCount,
  selectCartDiscount,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
} from '../store/cartSlice'
import { selectProductsByIds } from '../store/productsSlice'
import { DELIVERY_COST } from '../data/cart'
import { formatSom, plural } from '../lib/format'
import { btn, pageTitle, wrap } from '../lib/ui'

const qtyBtn =
  'w-9 h-9 cursor-pointer text-lg text-ink transition-colors duration-150 hover:bg-cream disabled:opacity-30'
const cartCell = 'text-center max-[900px]:hidden'
const priceCell = `${cartCell} font-bold text-base`
const summaryLine = 'flex justify-between text-[15px] mb-3.5'
const trustItem = 'flex items-center gap-2.5 text-[13px] text-ink-soft'

export default function Cart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const count = useAppSelector(selectCartCount)
  const subtotal = useAppSelector(selectCartSubtotal)
  const discount = useAppSelector(selectCartDiscount)
  const total = useAppSelector(selectCartTotal)
  const recommendations = useAppSelector(
    selectProductsByIds(['raspberry', 'lemon', 'giftset']),
  )

  const itemsWord = plural(count, ['товар', 'товара', 'товаров'])

  return (
    <>
      <Navbar />

      <div className={wrap}>
        <div className="pt-8">
          <div className="text-[13px] text-ink-soft mb-6 flex gap-2 items-center [&_a:hover]:text-accent [&_span]:opacity-40">
            <Link to="/">Главная</Link>
            <span>›</span>
            <span>Корзина</span>
          </div>
          <h1 className={`${pageTitle} mt-2`}>
            Ваша <em>корзина</em>
          </h1>
          <p className="text-ink-soft text-sm mt-2">
            {count} {itemsWord}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 px-5">
            <div className="text-[64px] mb-6">🛒</div>
            <h2 className="font-serif text-4xl font-medium mb-3">Корзина пуста</h2>
            <p className="text-ink-soft mb-7">Самое время выбрать чизкейк по душе.</p>
            <Link to="/cakes" className={btn('solid', { lg: true })}>
              За чизкейками →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_360px] gap-14 pt-12 pb-20 max-[900px]:grid-cols-1">
            <div>
              <div className="grid grid-cols-[1fr_100px_100px_100px_40px] gap-4 pb-3.5 border-b border-line text-xs tracking-[0.1em] uppercase text-ink-soft font-semibold max-[900px]:hidden">
                <span>Товар</span>
                <span className="text-center">Цена</span>
                <span className="text-center">Кол-во</span>
                <span className="text-center">Итого</span>
                <span></span>
              </div>

              {items.map((item) => (
                <div
                  className="grid grid-cols-[1fr_100px_100px_100px_40px] gap-4 items-center py-6 border-b border-line max-[900px]:grid-cols-[1fr_auto] max-[900px]:gap-3"
                  key={item.id}
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-[10px] bg-cream shrink-0 overflow-hidden">
                      <img src={item.image} alt="" className="w-full h-full object-cover rounded-[inherit]" />
                    </div>
                    <div>
                      <div className="font-serif text-xl font-semibold mb-1">{item.name}</div>
                      <div className="text-[13px] text-ink-soft">{item.subtitle}</div>
                    </div>
                  </div>
                  <div className={priceCell}>{formatSom(item.price)}</div>
                  <div className={cartCell}>
                    <div className="flex items-center border border-line rounded-full overflow-hidden w-fit mx-auto">
                      <button
                        className={qtyBtn}
                        disabled={item.fixedQuantity}
                        onClick={() => dispatch(decrementQuantity(item.id))}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold text-[15px]">
                        {item.quantity}
                      </span>
                      <button
                        className={qtyBtn}
                        disabled={item.fixedQuantity}
                        onClick={() => dispatch(incrementQuantity(item.id))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={priceCell}>{formatSom(item.price * item.quantity)}</div>
                  <button
                    className="w-9 h-9 rounded-full border border-line cursor-pointer text-ink-soft text-lg flex items-center justify-center transition-all duration-200 hover:border-[#c0392b] hover:text-[#c0392b] hover:bg-[#fff0f0]"
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="flex gap-2.5 mt-7">
                <input
                  type="text"
                  placeholder="Промокод"
                  className="flex-1 px-4 py-3 border border-line rounded-full font-sans text-sm text-ink bg-paper focus:outline-none focus:border-accent"
                />
                <button className={btn('outline-accent')}>Применить</button>
              </div>

              <div className="mt-6">
                <Link to="/cakes" className="text-sm text-ink-soft inline-flex items-center gap-1.5">
                  ← Продолжить покупки
                </Link>
              </div>
            </div>

            <div>
              <div className="bg-cream rounded-[18px] p-7 sticky top-[94px] max-[900px]:static">
                <div className="font-serif text-[26px] font-semibold mb-6">Итого</div>
                <div className={summaryLine}>
                  <span className="text-ink-soft">Товары ({count})</span>
                  <span>{formatSom(subtotal)}</span>
                </div>
                <div className={summaryLine}>
                  <span className="text-ink-soft">Доставка</span>
                  <span>{formatSom(DELIVERY_COST)}</span>
                </div>
                <div className={summaryLine}>
                  <span className="text-ink-soft">Скидка</span>
                  <span className="text-[#2e7d32]">−{formatSom(discount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-line pt-4 mt-1.5">
                  <span>К оплате</span>
                  <span>{formatSom(total)}</span>
                </div>
                <Link to="/checkout" className={btn('solid', { lg: true, block: true, className: 'mt-5' })}>
                  Оформить заказ →
                </Link>
                <p className="text-xs text-ink-soft text-center mt-3">
                  Оплата картой, СБП или по ссылке
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <div className={trustItem}>
                  <span>🔒</span> Защищённая оплата
                </div>
                <div className={trustItem}>
                  <span>↩️</span> Возврат в течение 24 ч
                </div>
                <div className={trustItem}>
                  <span>🚚</span> Доставка по городу — 300 сом
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] font-medium mb-8 [&_em]:italic [&_em]:text-accent">
            Добавьте к заказу <em>что-нибудь вкусное</em>
          </h2>
          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} cta="add" />
            ))}
          </div>
        </div>
      </div>

      <Footer style={{ marginTop: '80px' }} />
    </>
  )
}
