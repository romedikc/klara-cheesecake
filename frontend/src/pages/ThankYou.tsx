import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { btn } from '../lib/ui'

const orderDetails: { label: string; value: string; valueClass?: string }[] = [
  { label: 'Номер заказа', value: '#KL-2847', valueClass: 'font-serif text-[22px] text-accent' },
  { label: 'Статус', value: '✓ Принят в работу', valueClass: 'text-[#2e7d32]' },
  { label: 'Товары', value: 'Баскский чизкейк + курс «Основы»' },
  { label: 'Доставка', value: '26 июня · Курьер до 20:00' },
  { label: 'Адрес', value: 'ул. Пушкина, 10, кв. 42' },
  { label: 'Оплачено', value: '9 100 сом · Карта •• 3456' },
  { label: 'Подтверждение на почту', value: 'you@email.com' },
]

const nextSteps = [
  { icon: '📧', title: 'Письмо', desc: 'Подтверждение уже на вашей почте с деталями заказа' },
  { icon: '🚗', title: 'Доставка', desc: 'Курьер пришлёт SMS за 30 минут до прибытия' },
  {
    icon: '🎓',
    title: 'Курс',
    desc: 'Доступ к курсу откроется сразу после оплаты в вашем личном кабинете',
  },
]

export default function ThankYou() {
  return (
    <>
      <Navbar variant="plain" />

      <div className="min-h-[calc(100vh-74px)] flex items-center justify-center px-5 py-[60px]">
        <div className="max-w-[600px] w-full text-center">
          <div className="text-[80px] mb-7 animate-ty-pop">🎉</div>
          <div className="text-xs tracking-[0.22em] uppercase text-accent font-semibold mb-4 flex items-center justify-center gap-2.5 before:content-[''] before:w-7 before:h-px before:bg-accent after:content-[''] after:w-7 after:h-px after:bg-accent">
            Заказ №KL-2847
          </div>
          <h1 className="font-serif text-[clamp(38px,5vw,62px)] font-medium leading-[1.05] mb-[18px] [&_em]:italic [&_em]:text-accent">
            Спасибо,
            <br />
            <em>Полина!</em>
          </h1>
          <p className="text-[17px] text-ink-soft leading-[1.65] max-w-[42ch] mx-auto mb-9">
            Ваш заказ принят и уже передан в студию. Мы пришлём SMS, когда курьер
            выедет.
          </p>

          <div className="bg-cream rounded-[18px] p-7 mb-8 text-left">
            <h3 className="font-serif text-[22px] font-semibold mb-[18px]">Детали заказа</h3>
            {orderDetails.map((row) => (
              <div
                className="flex justify-between text-sm py-2.5 border-b border-line last:border-b-0"
                key={row.label}
              >
                <span className="text-ink-soft">{row.label}</span>
                <span className={`font-semibold ${row.valueClass ?? ''}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5 my-9 text-center max-[600px]:grid-cols-1">
            {nextSteps.map((step) => (
              <div className="px-4 py-6 bg-paper border border-line rounded-[14px]" key={step.title}>
                <div className="text-[32px] mb-2.5">{step.icon}</div>
                <h4 className="font-serif text-lg font-semibold mb-1.5">{step.title}</h4>
                <p className="text-[13px] text-ink-soft leading-[1.5]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center flex-wrap mt-2">
            <Link to="/cakes" className={btn('ghost')}>
              Ещё чизкейков
            </Link>
            <Link to="/courses" className={btn('solid')}>
              Смотреть все курсы
            </Link>
          </div>

          <p className="mt-7 text-[13px] text-ink-soft [&_a]:text-accent [&_a]:font-semibold">
            Вопросы? Пишите на{' '}
            <a href="mailto:hello@klaracheesecakes.ru">hello@klaracheesecakes.ru</a>
          </p>
        </div>
      </div>

      <Footer style={{ marginTop: 0 }} />
    </>
  )
}
