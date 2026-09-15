import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTotal,
} from '../store/cartSlice'
import { enrollCourses } from '../store/accountSlice'
import { DELIVERY_COST } from '../data/cart'
import { formatSom } from '../lib/format'
import { btn, formInput, formLabel, pageTitle, wrap } from '../lib/ui'

const deliveryOptions = [
  { name: '🚗 Курьер по городу', desc: 'Доставим в термосумке · сегодня до 20:00', price: '300 сом' },
  { name: '🏃 Экспресс-доставка', desc: 'Привезём в течение 2 часов', price: '600 сом' },
  { name: '📦 Самовывоз из студии', desc: 'ул. Примерная, 12 · пн-сб 10:00–19:00', price: 'Бесплатно' },
]

const paymentOptions = [
  { icon: '💳', name: 'Карта' },
  { icon: '📱', name: 'СБП' },
  { icon: '💰', name: 'Наличные' },
]

const steps = [
  { num: '✓', label: 'Корзина', state: 'done' },
  { num: '2', label: 'Оформление', state: 'active' },
  { num: '3', label: 'Оплата', state: 'pending' },
  { num: '4', label: 'Готово', state: 'pending' },
] as const

const stepNum: Record<string, string> = {
  done: 'bg-accent text-white',
  active: 'bg-ink text-white',
  pending: 'bg-line text-ink-soft',
}

const sectionH2 = 'font-serif text-[26px] font-semibold mb-5 pb-3 border-b border-line'
const formRow = 'grid grid-cols-2 gap-3.5 max-[900px]:grid-cols-1'
const orderLine = 'flex justify-between text-sm mb-2.5'

export default function Checkout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const discount = useAppSelector(selectCartDiscount)
  const total = useAppSelector(selectCartTotal)

  const [delivery, setDelivery] = useState(0)
  const [payment, setPayment] = useState(0)

  const handlePay = () => {
    const courseIds = items.filter((item) => item.kind === 'course').map((item) => item.id)
    const hasProduct = items.some((item) => item.kind === 'product')
    if (courseIds.length) dispatch(enrollCourses(courseIds))
    navigate(courseIds.length && !hasProduct ? '/payment-success' : '/thank-you')
  }

  return (
    <>
      <Navbar variant="checkout" />

      <div className={wrap}>
        <div className="pt-8 mb-2">
          <h1 className={pageTitle}>
            Оформление <em>заказа</em>
          </h1>
        </div>

        <div className="flex mb-10">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex items-center gap-2.5 text-[13px] font-semibold">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    stepNum[step.state]
                  }`}
                >
                  {step.num}
                </div>
                <div className={step.state === 'pending' ? 'text-ink-soft' : 'text-ink'}>
                  {step.label}
                </div>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-line mx-3 max-w-[40px]" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-16 pt-12 pb-20 max-[900px]:grid-cols-1">
          <div>
            <div className="mb-9">
              <h2 className={sectionH2}>Контактные данные</h2>
              <div className={`${formRow} mb-3.5`}>
                <div>
                  <label className={formLabel}>Имя</label>
                  <input className={formInput} type="text" placeholder="Полина" />
                </div>
                <div>
                  <label className={formLabel}>Фамилия</label>
                  <input className={formInput} type="text" placeholder="Новикова" />
                </div>
              </div>
              <div className={formRow}>
                <div>
                  <label className={formLabel}>Телефон</label>
                  <input className={formInput} type="tel" placeholder="+7 (___) ___-__-__" />
                </div>
                <div>
                  <label className={formLabel}>Email</label>
                  <input className={formInput} type="email" placeholder="you@email.com" />
                </div>
              </div>
            </div>

            <div className="mb-9">
              <h2 className={sectionH2}>Способ доставки</h2>
              <div className="flex flex-col gap-3">
                {deliveryOptions.map((option, i) => (
                  <label
                    className={`flex items-center gap-4 px-5 py-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      i === delivery
                        ? 'border-accent bg-blush'
                        : 'border-line bg-paper hover:border-accent'
                    }`}
                    key={option.name}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      className="accent-accent w-[18px] h-[18px]"
                      checked={i === delivery}
                      onChange={() => setDelivery(i)}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-[15px] mb-0.5">{option.name}</div>
                      <div className="text-[13px] text-ink-soft">{option.desc}</div>
                    </div>
                    <span className="font-bold text-[15px]">{option.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-9">
              <h2 className={sectionH2}>Адрес доставки</h2>
              <div className="mb-5">
                <label className={formLabel}>Улица и дом</label>
                <input className={formInput} type="text" placeholder="ул. Пушкина, д. 10" />
              </div>
              <div className="grid grid-cols-[2fr_1fr_1fr] gap-3.5 max-[900px]:grid-cols-1">
                <div>
                  <label className={formLabel}>Город</label>
                  <input className={formInput} type="text" placeholder="Москва" />
                </div>
                <div>
                  <label className={formLabel}>Кв./офис</label>
                  <input className={formInput} type="text" placeholder="42" />
                </div>
                <div>
                  <label className={formLabel}>Этаж</label>
                  <input className={formInput} type="text" placeholder="5" />
                </div>
              </div>
              <div className="mt-3.5">
                <label className={formLabel}>Комментарий для курьера</label>
                <textarea
                  className={`${formInput} resize-y min-h-[80px]`}
                  placeholder="Домофон не работает, звонить на телефон..."
                />
              </div>
            </div>

            <div className="mb-9">
              <h2 className={sectionH2}>Способ оплаты</h2>
              <div className="grid grid-cols-3 gap-2.5 max-[900px]:grid-cols-2">
                {paymentOptions.map((option, i) => (
                  <div
                    className={`p-3.5 border rounded-xl cursor-pointer text-center transition-all duration-200 flex flex-col items-center gap-2 ${
                      i === payment
                        ? 'border-accent bg-blush'
                        : 'border-line bg-paper hover:border-accent'
                    }`}
                    key={option.name}
                    onClick={() => setPayment(i)}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-[13px] font-semibold">{option.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="mb-5">
                  <label className={formLabel}>Номер карты</label>
                  <input className={formInput} type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className={formRow}>
                  <div>
                    <label className={formLabel}>Срок действия</label>
                    <input className={formInput} type="text" placeholder="MM/ГГ" />
                  </div>
                  <div>
                    <label className={formLabel}>CVV</label>
                    <input className={formInput} type="text" placeholder="•••" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={btn('solid', { lg: true, block: true })}
              onClick={handlePay}
            >
              Подтвердить и оплатить — {formatSom(total)}
            </button>
            <p className="text-xs text-ink-soft text-center mt-3">
              Нажимая кнопку, вы соглашаетесь с условиями обработки данных
            </p>
          </div>

          <div>
            <div className="bg-cream rounded-[18px] p-7 sticky top-[94px] max-[900px]:static">
              <h3 className="font-serif text-[22px] font-semibold mb-5">Ваш заказ</h3>
              {items.map((item) => (
                <div
                  className="flex gap-3 items-center py-3 border-b border-line last-of-type:border-b-0 last-of-type:mb-4"
                  key={item.id}
                >
                  <div className="w-14 h-14 rounded-lg bg-paper shrink-0 overflow-hidden">
                    <img src={item.image} alt="" className="w-full h-full object-cover rounded-[inherit]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-ink-soft">{item.subtitle}</div>
                  </div>
                  <div className="font-bold text-sm whitespace-nowrap">{formatSom(item.price)}</div>
                </div>
              ))}
              <div className={orderLine}>
                <span className="text-ink-soft">Товары</span>
                <span>{formatSom(subtotal)}</span>
              </div>
              <div className={orderLine}>
                <span className="text-ink-soft">Доставка</span>
                <span>{formatSom(DELIVERY_COST)}</span>
              </div>
              <div className={orderLine}>
                <span className="text-ink-soft">Скидка</span>
                <span className="text-[#2e7d32]">−{formatSom(discount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-line pt-4 mt-1.5">
                <span>К оплате</span>
                <span>{formatSom(total)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-soft mt-3 justify-center">
                🔒 Защищённая оплата
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
