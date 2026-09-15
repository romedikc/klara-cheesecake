import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { images } from '../data/images'
import { btn, eyebrow, wrap } from '../lib/ui'

const values = [
  {
    icon: '🧀',
    title: 'Только настоящее',
    desc: 'Никаких стабилизаторов, усилителей и суррогатов. Сливочный сыр, яйца, сахар — и ничего лишнего. Именно так делаю сама и учу других.',
  },
  {
    icon: '📖',
    title: 'Понимать, а не копировать',
    desc: 'Хороший рецепт — это не список шагов. Это понимание того, почему каждый ингредиент делает своё дело. Именно это я объясняю в курсах.',
  },
  {
    icon: '🤝',
    title: 'Доступно для всех',
    desc: 'Не нужно кондитерского образования. Не нужна профессиональная духовка. Нужны только желание и чуть терпения — остальному я научу.',
  },
]

const heading = 'font-serif font-medium [&_em]:italic [&_em]:text-accent'

export default function About() {
  return (
    <>
      <Navbar />

      <section className="pt-[72px] pb-[60px]">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1.1fr] gap-20 items-center max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <div className="aspect-[4/5] rounded-[200px_200px_14px_14px] bg-cream overflow-hidden max-[900px]:max-w-[320px]">
              <img
                src={images.portrait}
                alt="Клара"
                className="w-full h-full object-cover rounded-[inherit]"
              />
            </div>
            <div>
              <span className={eyebrow}>Привет, это я</span>
              <h1 className={`${heading} text-[clamp(44px,5.5vw,76px)] leading-none mb-6`}>
                Я <em>Клара,</em> и я пеку чизкейки.
              </h1>
              <p className="text-[18px] text-ink-soft leading-[1.75] max-w-[48ch]">
                Десять лет назад я стояла у духовки с первым провалившимся чизкейком
                и думала: что я делаю не так? Сегодня у меня студия, 12 тысяч
                учеников и один непоколебимый принцип — чизкейк должен дрожать.
              </p>
              <div className="font-serif italic text-[34px] mt-5 text-ink">Клара</div>
              <div className="flex gap-3.5 mt-7 flex-wrap">
                <Link to="/cakes" className={btn('solid')}>
                  Купить чизкейк
                </Link>
                <Link to="/courses" className={btn('ghost')}>
                  Мои курсы
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-blush border-t border-b border-line py-[60px]">
        <div className={wrap}>
          <div className="grid grid-cols-4 gap-5 text-center max-[900px]:grid-cols-2">
            {[
              ['10', 'лет выпечки'],
              ['12k', 'учеников по всему миру'],
              ['40+', 'авторских рецептов'],
              ['4.9★', 'средняя оценка курсов'],
            ].map(([value, label]) => (
              <div key={label}>
                <b className="font-serif text-[54px] font-semibold block leading-none text-ink">
                  {value}
                </b>
                <span className="text-sm text-ink-soft tracking-[0.04em] mt-1.5 block">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className={wrap}>
          <div className="max-w-[68ch]">
            <h2 className={`${heading} text-[clamp(30px,3.8vw,48px)] mb-6`}>
              Как это <em>всё началось</em>
            </h2>
            <p className="text-base text-ink-soft leading-[1.8] mb-[18px]">
              Всё началось в 2016 году с одной домашней духовки и упрямой идеи: я
              хочу научиться делать чизкейк, который не трескается, не оседает и не
              напоминает резину. Звучит просто. Оказалось — нет.
            </p>
            <p className="text-base text-ink-soft leading-[1.8] mb-[18px]">
              Первые два года я пекла каждые выходные, вела дневник ошибок и
              переписывалась с кондитерами из Токио и Нью-Йорка. Когда наконец
              получился тот самый баскский — с тёмной корочкой и жидкой серединой —
              я поняла, что это нужно показать миру.
            </p>
            <p className="text-base text-ink-soft leading-[1.8] mb-[18px]">
              Первый курс я записала на телефон в 2019-м. 47 человек купили его за
              неделю. К 2022-му у меня была собственная студия, профессиональная
              кухня и команда. Сегодня Klara Cheesecakes — это онлайн-школа,
              авторский магазин и комьюнити тысяч людей, которые так же, как я
              когда-то, влюбились в чизкейк.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream border-t border-b border-line py-20">
        <div className={wrap}>
          <h2 className={`${heading} text-[clamp(28px,3.5vw,44px)] mb-10`}>
            Во что я <em>верю</em>
          </h2>
          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-1">
            {values.map((value) => (
              <div className="p-7 bg-paper rounded-2xl border border-line" key={value.title}>
                <div className="text-4xl mb-3.5">{value.icon}</div>
                <h3 className="font-serif text-2xl font-semibold mb-2.5">{value.title}</h3>
                <p className="text-sm text-ink-soft leading-[1.65]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[72px]">
        <div className={wrap}>
          <h2 className={`${heading} text-[clamp(28px,3.5vw,44px)] mb-9`}>
            Писали <em>о нас</em>
          </h2>
          <div className="flex gap-8 flex-wrap items-center">
            {['Афиша Еда', 'The Village', 'Gastronom', 'Forbes Life'].map((name) => (
              <div
                key={name}
                className="px-7 py-4 border border-line rounded-xl font-serif text-xl font-semibold text-ink-soft"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={wrap}>
        <div className="text-center bg-ink text-white px-8 py-20 rounded-[20px] mb-20">
          <h2 className="font-serif font-medium text-[clamp(32px,4vw,54px)] leading-[1.1] mb-[18px] [&_em]:italic [&_em]:text-[oklch(0.80_0.12_50)]">
            Готовы печь <em>идеальный</em> чизкейк?
          </h2>
          <p className="text-white/65 mb-8 text-base">
            Начните с бесплатного урока — и поймёте, насколько это проще, чем кажется.
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <Link to="/courses" className={btn('light', { lg: true })}>
              Смотреть курсы
            </Link>
            <Link
              to="/cakes"
              className="inline-flex items-center gap-2 font-sans font-semibold rounded-full cursor-pointer border px-[22px] py-3 text-sm border-white/30 text-white transition-[transform,background-color,color] duration-200 hover:-translate-y-px"
            >
              Купить чизкейк →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
