import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CourseProgram from '../components/CourseProgram'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCourseDetail } from '../store/coursesSlice'
import { selectIsEnrolled } from '../store/accountSlice'
import { addItem } from '../store/cartSlice'
import { formatSom, formatNumber } from '../lib/format'
import { firstLesson, splitTitle } from '../lib/course'
import { breadcrumb, btn, eyebrow, wrap } from '../lib/ui'

export default function Course() {
  const { id = 'foundations' } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const byId = useAppSelector(selectCourseDetail(id))
  const fallback = useAppSelector(selectCourseDetail('foundations'))
  const course = byId ?? fallback
  const previewLesson = firstLesson(course)
  const enrolled = useAppSelector(selectIsEnrolled(course.id))
  const [first, rest] = splitTitle(course.name)

  const handleBuy = () => {
    dispatch(
      addItem({
        id: course.id,
        kind: 'course',
        name: course.name,
        subtitle: 'Онлайн-курс · Доступ навсегда',
        price: course.price,
        image: course.image,
        fixedQuantity: true,
      }),
    )
    navigate('/checkout')
  }

  return (
    <>
      <Navbar />

      <div className="pt-6">
        <div className={wrap}>
          <div className={breadcrumb}>
            <Link to="/">Главная</Link>
            <span>›</span>
            <Link to="/courses">Курсы</Link>
            <span>›</span>
            <span>{course.name}</span>
          </div>
        </div>
      </div>

      <div className={wrap}>
        <div className="grid grid-cols-[1fr_380px] gap-16 items-start pt-14 pb-20 max-[1000px]:grid-cols-1">
          <div>
            <div className="aspect-video bg-cream rounded-[18px] mb-9 overflow-hidden">
              <img
                src={course.image}
                alt="Обложка курса"
                className="w-full h-full object-cover rounded-[inherit]"
              />
            </div>

            <span className={eyebrow}>{course.levelLabel}</span>
            <h1 className="font-serif text-[clamp(36px,4.5vw,58px)] font-medium leading-[1.04] mb-4 [&_em]:italic [&_em]:text-accent">
              <em>{first}</em>
              {rest}
            </h1>

            <div className="flex items-center gap-3 mb-7 text-sm text-ink-soft">
              <span className="text-accent text-lg">★★★★★</span>
              <b>{course.ratingValue.toFixed(1)}</b>
              <span>({course.reviewsCount} отзыв)</span>
              <span>·</span>
              <span>{formatNumber(course.students)} ученик</span>
            </div>

            <p className="text-base text-ink-soft leading-[1.75] max-w-[62ch] mb-6">
              {course.description}
            </p>

            <div className="text-sm text-ink-soft font-semibold mb-3.5">Чему вы научитесь:</div>
            <div className="grid grid-cols-2 gap-3.5 mt-6 mb-9 max-[1000px]:grid-cols-1">
              {course.learnPoints.map((point) => (
                <div
                  className="flex items-start gap-2.5 text-sm before:content-['✓'] before:text-accent before:font-bold before:shrink-0 before:mt-px"
                  key={point}
                >
                  {point}
                </div>
              ))}
            </div>

            <h2 className="font-serif text-[30px] font-medium mt-10 mb-5">Программа курса</h2>

            <CourseProgram modules={course.modules} variant="preview" courseId={course.id} />

            <div className="bg-blush rounded-[18px] p-8 flex gap-6 items-center mt-12">
              <div className="w-20 h-20 rounded-full bg-cream shrink-0 overflow-hidden">
                <img
                  src={course.author.avatar}
                  alt={course.author.name}
                  className="w-full h-full object-cover rounded-[inherit]"
                />
              </div>
              <div>
                <div className="font-serif text-[26px] font-semibold mb-1.5">
                  {course.author.name}
                </div>
                <p className="text-sm text-ink-soft leading-[1.6]">{course.author.bio}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-[94px] bg-paper border border-line rounded-[20px] overflow-hidden max-[1000px]:static">
              <div className="aspect-[4/3] bg-cream">
                <img src={course.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-7">
                <div className="font-serif text-[44px] font-semibold mb-1.5">
                  {formatSom(course.price)}
                </div>
                <div className="text-sm text-ink-soft line-through mb-5">
                  {formatSom(course.oldPrice)}
                </div>

                <div className="bg-blush rounded-[10px] px-4 py-3 mb-5 flex items-center gap-2.5 text-[13px] [&_b]:text-accent">
                  🔥 Скидка заканчивается через <b>2 дня</b>
                </div>

                {enrolled ? (
                  <Link
                    to={`/my-courses/${course.id}`}
                    className={btn('solid', { lg: true, block: true, className: 'mb-2.5' })}
                  >
                    Продолжить обучение
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={btn('solid', { lg: true, block: true, className: 'mb-2.5' })}
                    onClick={handleBuy}
                  >
                    Купить курс
                  </button>
                )}
                {previewLesson && (
                  <Link
                    to={`/my-courses/${course.id}/lessons/${previewLesson.id}`}
                    className={btn('ghost', { block: true, className: 'mb-2.5' })}
                  >
                    Попробовать бесплатно
                  </Link>
                )}

                <div className="my-[22px]">
                  <h4 className="text-xs tracking-[0.12em] uppercase text-ink-soft mb-3.5">
                    Что входит
                  </h4>
                  {course.includes.map((item) => (
                    <div
                      className="flex items-center gap-2.5 text-sm mb-2.5 before:content-['✓'] before:text-accent before:font-bold"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="text-center text-xs text-ink-soft mt-3.5">
                  30-дневная гарантия возврата денег
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
