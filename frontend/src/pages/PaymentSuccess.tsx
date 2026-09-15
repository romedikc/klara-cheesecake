import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppSelector } from '../store/hooks'
import { selectLastPurchasedCourseId } from '../store/accountSlice'
import { selectCourseById, selectCourseDetail } from '../store/coursesSlice'
import { btn, eyebrow } from '../lib/ui'

export default function PaymentSuccess() {
  const lastId = useAppSelector(selectLastPurchasedCourseId) ?? 'foundations'
  const detail = useAppSelector(selectCourseDetail(lastId))
  const summary = useAppSelector(selectCourseById(lastId))
  const course = detail ?? summary

  return (
    <>
      <Navbar variant="account" />

      <div className="min-h-[calc(100vh-74px)] flex items-center justify-center px-5 py-[60px]">
        <div className="max-w-[640px] w-full text-center">
          <div className="w-[78px] h-[78px] rounded-full bg-accent text-white text-[38px] flex items-center justify-center mx-auto mb-[26px] animate-ty-pop">
            ✓
          </div>
          <div className={`${eyebrow} justify-center`}>Заказ №KL-2847 · оплачен</div>
          <h1 className="font-serif font-medium text-[clamp(36px,5vw,58px)] leading-[1.05] mb-4 [&_em]:italic [&_em]:text-accent">
            Курс <em>открыт</em>
          </h1>
          <p className="text-[17px] text-ink-soft leading-[1.65] max-w-[44ch] mx-auto mb-[34px]">
            Доступ навсегда. Мы также отправили ссылку на you@email.com — войти можно с телефона и
            компьютера.
          </p>

          {course && (
            <div className="grid grid-cols-[132px_1fr] gap-[22px] items-center text-left bg-blush rounded-[18px] p-[22px] mb-7 max-[600px]:grid-cols-1 max-[600px]:text-center">
              <img
                src={course.image}
                alt={course.name}
                className="w-[132px] h-[132px] rounded-xl object-cover max-[600px]:w-full max-[600px]:h-[200px]"
              />
              <div>
                <div className="text-xs tracking-[0.1em] uppercase text-accent mb-2">
                  {course.levelLabel} · {course.lessons}
                </div>
                <h3 className="font-serif text-[28px] font-semibold mb-1.5">{course.name}</h3>
                <p className="text-sm text-ink-soft mb-3.5">
                  {detail
                    ? `${detail.modules.length} модуля, ${detail.duration} видео и PDF-рецепты для печати.`
                    : course.shortDescription}
                </p>
                <Link to={`/my-courses/${course.id}`} className={btn('solid')}>
                  Открыть курс
                </Link>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/my-courses" className={btn('ghost')}>
              Все мои курсы
            </Link>
            <Link to="/courses" className={btn('outline-accent')}>
              Другие курсы
            </Link>
          </div>
          <p className="mt-[26px] text-[13px] text-ink-soft">
            Чизкейк из этого же заказа привезём 26 июня до 20:00.
          </p>
        </div>
      </div>

      <Footer />
    </>
  )
}
