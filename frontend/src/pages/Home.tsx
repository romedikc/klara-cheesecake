import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Strip from '../components/Strip'
import CompactCourseCard from '../components/CompactCourseCard'
import { useAppSelector } from '../store/hooks'
import { selectProducts } from '../store/productsSlice'
import { selectCourses } from '../store/coursesSlice'
import { formatSom } from '../lib/format'
import { btn, eyebrow, secHeadH2, wrap } from '../lib/ui'
import { images } from '../data/images'
import {Link} from "react-router-dom";

const sectionPad = 'py-24 max-[560px]:py-[70px]'
const secHead = 'flex justify-between items-end mb-12 gap-6 flex-wrap'

export default function Home() {
  const cakes = useAppSelector(selectProducts).slice(0, 3)
  const courses = useAppSelector(selectCourses)

  return (
    <>
      <Navbar variant="home" />

      <header className="pt-[70px] pb-10">
        <div
          className={`${wrap} grid grid-cols-[1.05fr_1fr] gap-[60px] items-center max-[900px]:grid-cols-1 max-[900px]:gap-10`}
        >
          <div>
            <span className={eyebrow}>Студия чизкейков ручной работы</span>
            <h1 className="font-serif font-medium text-[clamp(46px,6vw,84px)] leading-[0.98] tracking-[-0.01em] [&_em]:italic [&_em]:text-accent">
              Самый <em>нежный</em> вкус, что вы пробовали.
            </h1>
            <p className="text-[18px] text-ink-soft max-w-[30ch] mt-[26px] mb-[34px]">
              Чизкейки малыми партиями на заказ — и мастер-классы, где научат
              ремеслу с нуля.
            </p>
            <div className="flex gap-3.5 flex-wrap items-center">
              <a href="#shop" className={btn('solid')}>
                Купить чизкейк
              </a>
              <a href="#courses" className={btn('ghost')}>
                Смотреть курсы
              </a>
            </div>
            <p className="text-[13px] text-ink-soft mt-[26px]">
              4.9 ★ по 2 300+ заказам · Доставка по городу
            </p>
          </div>
          <div className="relative max-[900px]:order-[-1] max-[900px]:max-w-[440px]">
            <div className="aspect-[4/5] rounded-[220px_220px_14px_14px] overflow-hidden">
              <img
                src={images.cakeBasque}
                alt="Баскский чизкейк"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <Strip
        items={[
          { strong: '100%', rest: ' настоящий сливочный сыр' },
          { strong: 'Без', rest: ' стабилизаторов' },
          { strong: '48 ч', rest: ' на заказ' },
          { strong: '12k', rest: ' учеников' },
        ]}
      />

      <section id="shop" className={sectionPad}>
        <div className={wrap}>
          <div className={secHead}>
            <h2 className={secHeadH2}>
              Выпечка <em>недели</em>
            </h2>
            <p className="text-ink-soft max-w-[38ch]">
              Меню фирменных чизкейков — каждый собирается вручную в день отправки.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-[30px] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {cakes.map((cake) => (
              <article className="flex flex-col" key={cake.id}>
                <div className="aspect-square mb-[18px] rounded-[10px] overflow-hidden bg-cream">
                  <img src={cake.image} alt={cake.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] tracking-[0.12em] uppercase text-accent font-semibold">
                  {cake.badge}
                </span>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-serif text-[26px] font-semibold">{cake.name}</h3>
                  <span className="font-bold text-base whitespace-nowrap">
                    {formatSom(cake.price)}
                  </span>
                </div>
                <p className="mt-1.5 mb-4 text-ink-soft text-sm flex-1">{cake.description}</p>
                  <Link to={`/cakes/${cake.id}`} className={btn('ghost', { block: true })}>
                      Подробнее
                  </Link>
                {/*<button*/}
                {/*  className={btn('ghost', { block: true, className: 'mt-1 border-1' })}*/}
                {/*  onClick={() =>*/}
                {/*    dispatch(*/}
                {/*      addItem({*/}
                {/*        id: cake.id,*/}
                {/*        kind: 'product',*/}
                {/*        name: cake.name,*/}
                {/*        subtitle: cake.tag,*/}
                {/*        price: cake.price,*/}
                {/*        image: cake.image,*/}
                {/*      }),*/}
                {/*    )*/}
                {/*  }*/}
                {/*>*/}
                {/*  В корзину*/}
                {/*</button>*/}
              </article>
            ))}

          </div>
            <div className='m-auto w-full flex items-center justify-center mt-10'>
                <Link
                    to="/cakes"
                >
                    <button className={`${btn('solid', { lg: true })} px-10`}>Все чизкейки</button>
                </Link>
            </div>
        </div>
      </section>

      <section id="courses" className={`${sectionPad} bg-blush`}>
        <div className={wrap}>
          <div className={secHead}>
            <div>
              <span className={eyebrow}>Учитесь у Клары</span>
              <h2 className={secHeadH2}>
                Онлайн <em>мастер-классы</em>
              </h2>
            </div>
            <p className="text-ink-soft max-w-[38ch]">
              Бессрочный доступ, пошаговые видео и точные рецепты из студии.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-[26px] max-[900px]:grid-cols-1">
            {courses.map((course) => (
              <CompactCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
          <div className='m-auto w-full flex items-center justify-center mt-10'>
              <Link
                  to="/courses"
              >
                  <button className={`${btn('solid', { lg: true })} px-12`}>Все курсы</button>
              </Link>
          </div>
      </section>

      <section id="story" className={sectionPad}>
        <div
          className={`${wrap} grid grid-cols-[1fr_1.1fr] gap-16 items-center max-[900px]:grid-cols-1 max-[900px]:gap-10`}
        >
          <div
            className="rounded-[14px] overflow-hidden bg-cream"
            style={{ height: 460, width: 400, position: 'relative', left: 50 }}
          >
            <img src={images.portrait} alt="Клара" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-serif font-medium text-[clamp(32px,4.2vw,52px)] leading-[1.04] mb-6 [&_em]:italic [&_em]:text-accent">
              Привет, я <em>Клара</em>
            </h2>
            <p className="text-ink-soft text-[17px] mb-[18px] max-w-[46ch]">
              Я начала Klara Cheesecakes с одной домашней духовки и упрямой веры:
              чизкейк должен дрожать, а не стоять по стойке смирно.
            </p>
            <p className="text-ink-soft text-[17px] mb-[18px] max-w-[46ch]">
              Десять лет спустя я доставляю по стране и учу тысячи домашних пекарей
              приёмам, которые когда-то осваивала сама.
            </p>
            <div className="flex gap-11 mt-9 max-[560px]:flex-wrap max-[560px]:gap-6">
              <div>
                <b className="font-serif text-[42px] font-semibold block leading-none">10</b>
                <span className="text-[13px] text-ink-soft tracking-[0.04em]">лет выпечки</span>
              </div>
              <div>
                <b className="font-serif text-[42px] font-semibold block leading-none">12k</b>
                <span className="text-[13px] text-ink-soft tracking-[0.04em]">учеников</span>
              </div>
              <div>
                <b className="font-serif text-[42px] font-semibold block leading-none">40+</b>
                <span className="text-[13px] text-ink-soft tracking-[0.04em]">рецептов</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionPad} bg-cream border-t border-b border-line`}>
        <div className={wrap}>
          <blockquote className="font-serif italic font-medium text-[clamp(28px,3.6vw,46px)] leading-[1.2] text-center max-w-[20ch] mx-auto tracking-[-0.01em] [&_em]:italic [&_em]:text-accent">
            «Лучший чизкейк, что я делала дома — и единственный курс, который{' '}
            <em>правда</em> объяснил почему.»
          </blockquote>
          <div className="text-center mt-7 text-sm text-ink-soft tracking-[0.04em]">
            Полина Н. · ученица курса «Основы»
          </div>
        </div>
      </section>

      <section className={`${sectionPad} text-center`}>
        <div className={wrap}>
          <h2 className="font-serif font-medium text-[clamp(38px,5vw,70px)] leading-none mb-[18px] [&_em]:italic [&_em]:text-accent">
            Получайте <em>воскресный</em> список выпечки.
          </h2>
          <p className="text-ink-soft text-[17px] mb-8">
            Новые вкусы, ранний доступ к курсам и иногда секретный рецепт.
          </p>
          <form className="flex gap-2.5 max-w-[440px] mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@email.com"
              aria-label="Email"
              className="flex-1 px-[18px] py-3.5 border border-line rounded-full bg-paper font-sans text-[15px] text-ink focus:outline-none focus:border-accent"
            />
            <button className={btn('solid')} type="submit">
              Подписаться
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  )
}
