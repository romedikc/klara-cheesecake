import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { breadcrumb, btn, eyebrow, formInput, formLabel, formTextarea, wrap } from '../lib/ui'

const topics = ['Заказ / доставка', 'Курсы', 'Партнёрство', 'Другое']

const faqs = [
  {
    q: 'Как быстро вы доставляете?',
    a: 'Заказ нужно оформить минимум за 48 часов. Курьер доставляет в удобное для вас время в пределах 10:00–20:00. По Москве — в день заказа при заявке до 12:00.',
  },
  {
    q: 'Можно ли заморозить чизкейк?',
    a: 'Да, большинство наших чизкейков хорошо переносят заморозку до 1 месяца. Размораживайте медленно в холодильнике — 6–8 часов. Исключение — чизкейки с желейным покрытием.',
  },
  {
    q: 'Доступ к курсу — навсегда?',
    a: 'Да, при покупке вы получаете доступ без ограничения по времени. Все обновления курса также будут доступны бесплатно.',
  },
  {
    q: 'Есть ли возврат?',
    a: 'На курсы — 30 дней с момента покупки, если вы посмотрели менее 20% материала. На чизкейки — мы решаем вопросы индивидуально, напишите нам в течение 24 часов после получения.',
  },
  {
    q: 'Можно заказать корпоративно?',
    a: 'Конечно! Мы делаем заказы для корпоративов, мероприятий и подарков от 5 штук. Напишите нам с темой «Партнёрство» — обсудим объёмы и брендирование.',
  },
]

const contactItems = [
  {
    icon: '📧',
    label: 'Email',
    value: <a href="mailto:hello@klaracheesecakes.ru">hello@klaracheesecakes.ru</a>,
    sub: 'Ответ в течение 2–4 часов',
  },
  {
    icon: '💬',
    label: 'WhatsApp / Telegram',
    value: <a href="#">+7 (925) 123-45-67</a>,
    sub: 'Быстрые вопросы о заказах и доставке',
  },
  {
    icon: '📍',
    label: 'Студия',
    value: 'ул. Примерная, 12, Москва',
    sub: 'Самовывоз: пн–сб, 10:00–19:00',
  },
  {
    icon: '🕐',
    label: 'Время работы',
    value: 'Пн–Сб: 9:00–20:00',
    sub: 'Воскресенье — выходной (но мы печём!)',
  },
]

const socials = ['📸 Instagram', '✈️ Telegram', '🎵 TikTok', '▶️ YouTube']

const socialBtn =
  'flex items-center gap-2 px-[18px] py-2.5 border border-line rounded-full text-sm font-semibold text-ink-soft transition-all duration-200 bg-paper hover:border-accent hover:text-accent hover:bg-blush'

const topicBtn = (active: boolean) =>
  `px-4 py-[7px] rounded-full border text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
    active
      ? 'border-accent text-accent bg-white'
      : 'border-line bg-paper text-ink-soft hover:border-accent hover:text-accent hover:bg-white'
  }`

export default function Contacts() {
  const [activeTopic, setActiveTopic] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <Navbar />

      <div className={wrap}>
        <div className="pt-8">
          <div className={breadcrumb}>
            <Link to="/">Главная</Link>
            <span>›</span>
            <span>Контакты</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[72px] pt-[60px] pb-20 items-start max-[900px]:grid-cols-1 max-[900px]:gap-12">
          <div>
            <span className={eyebrow}>Мы рядом</span>
            <h1 className="font-serif text-[clamp(38px,5vw,64px)] font-medium leading-[1.04] mb-[18px] [&_em]:italic [&_em]:text-accent">
              Напишите
              <br />
              нам <em>в любое</em>
              <br />
              время.
            </h1>
            <p className="text-base text-ink-soft leading-[1.7] max-w-[44ch] mb-10">
              Обычно отвечаем в течение нескольких часов. По срочным вопросам о
              доставке — пишите в WhatsApp.
            </p>

            <div className="flex flex-col gap-5 mb-10">
              {contactItems.map((item) => (
                <div className="flex items-start gap-4" key={item.label}>
                  <div className="w-11 h-11 rounded-xl bg-blush border border-line flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.1em] uppercase text-ink-soft font-semibold mb-1">
                      {item.label}
                    </div>
                    <div className="text-base font-semibold text-ink [&_a]:transition-colors [&_a:hover]:text-accent">
                      {item.value}
                    </div>
                    <div className="text-[13px] text-ink-soft mt-0.5">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-2.5 text-[13px] font-semibold text-ink-soft tracking-[0.06em] uppercase">
              Мы в соцсетях
            </div>
            <div className="flex gap-3 flex-wrap">
              {socials.map((social) => (
                <a href="#" className={socialBtn} key={social}>
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-cream rounded-[20px] p-9">
              <h2 className="font-serif text-[28px] font-semibold mb-1.5">Написать нам</h2>
              <p className="text-sm text-ink-soft mb-7">Выберите тему — и мы ответим точнее.</p>

              <div className="text-xs font-semibold tracking-[0.1em] uppercase text-ink-soft mb-2.5">
                Тема
              </div>
              <div className="flex gap-2 flex-wrap mb-6">
                {topics.map((topic, i) => (
                  <button
                    key={topic}
                    className={topicBtn(i === activeTopic)}
                    onClick={() => setActiveTopic(i)}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className={formLabel}>Имя</label>
                  <input className={formInput} type="text" placeholder="Полина" />
                </div>
                <div>
                  <label className={formLabel}>Email</label>
                  <input className={formInput} type="email" placeholder="you@email.com" />
                </div>
              </div>

              <div className="mb-5">
                <label className={formLabel}>Сообщение</label>
                <textarea className={formTextarea} placeholder="Расскажите подробнее..." />
              </div>

              <button className={btn('solid', { lg: true, block: true })}>
                Отправить сообщение
              </button>
              <p className="text-center text-xs text-ink-soft mt-3">
                Обычно отвечаем в течение 2–4 часов
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-blush border-t border-b border-line py-[72px]">
        <div className={wrap}>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-medium mb-9 text-center [&_em]:italic [&_em]:text-accent">
            Частые <em>вопросы</em>
          </h2>
          <div className="max-w-[720px] mx-auto">
            {faqs.map((faq, i) => (
              <div className="border-b border-line" key={faq.q}>
                <div
                  className="flex justify-between items-center py-5 cursor-pointer font-semibold text-base gap-5"
                  onClick={() => setOpenFaq((cur) => (cur === i ? -1 : i))}
                >
                  {faq.q}
                  <span
                    className={`text-accent text-[22px] shrink-0 transition-transform duration-[250ms] ${
                      i === openFaq ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </div>
                {i === openFaq && (
                  <p className="pb-5 text-[15px] text-ink-soft leading-[1.7] max-w-[56ch]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
