import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AccountSidebar from '../components/AccountSidebar'
import CompactCourseCard from '../components/CompactCourseCard'
import { useAppSelector } from '../store/hooks'
import { selectEnrollments, selectUser } from '../store/accountSlice'
import { selectCourseById, selectCourseDetail, selectCourses } from '../store/coursesSlice'
import { btn, eyebrow, wrap } from '../lib/ui'
import type { Enrollment } from '../types'

function EnrolledRow({ enrollment }: { enrollment: Enrollment }) {
  const summary = useAppSelector(selectCourseById(enrollment.courseId))
  const detail = useAppSelector(selectCourseDetail(enrollment.courseId))
  const course = detail ?? summary
  if (!course) return null

  const started = Boolean(enrollment.lastLessonTitle)
  const href = `/my-courses/${course.id}`

  return (
    <article className="grid grid-cols-[116px_1fr_auto] gap-[22px] items-center p-5 border border-line rounded-[14px] mb-3 bg-paper transition-colors duration-200 hover:border-accent max-[900px]:grid-cols-[86px_1fr] max-[900px]:gap-4">
      <img
        src={course.image}
        alt={course.name}
        className="w-[116px] h-[86px] rounded-[10px] object-cover max-[900px]:w-[86px] max-[900px]:h-[86px]"
      />
      <div>
        <h3 className="font-serif text-2xl font-semibold mb-1">{course.name}</h3>
        <div className="text-[13px] text-ink-soft">
          {course.levelLabel} уровень · {course.lessons} · {course.duration}
        </div>
        <div className="text-[13px] text-ink-soft mt-2">
          {started ? (
            <>
              Последний урок: <b className="text-ink font-semibold">{enrollment.lastLessonTitle}</b>
            </>
          ) : (
            'Ещё не начат'
          )}
        </div>
      </div>
      <Link
        to={href}
        className={`${btn('solid')} max-[900px]:col-span-full max-[900px]:justify-center`}
      >
        {started ? 'Продолжить' : 'Начать'}
      </Link>
    </article>
  )
}

export default function MyCourses() {
  const user = useAppSelector(selectUser)
  const enrollments = useAppSelector(selectEnrollments)
  const catalog = useAppSelector(selectCourses)
  const enrolledIds = new Set(enrollments.map((item) => item.courseId))
  const upsell = catalog.find((course) => !enrolledIds.has(course.id))
  const starters = catalog.filter((course) => !enrolledIds.has(course.id)).slice(0, 2)

  return (
    <>
      <Navbar variant="account" />

      <div className={wrap}>
        <div className="grid grid-cols-[240px_1fr] gap-14 items-start py-11 pb-20 max-[900px]:grid-cols-1 max-[900px]:gap-7">
          <AccountSidebar active="courses" />

          <div>
            <span className={eyebrow}>Личный кабинет · {user.firstName}</span>
            <h1 className="font-serif font-medium text-[clamp(34px,4.4vw,56px)] leading-[1.04] [&_em]:italic [&_em]:text-accent">
              Мои <em>курсы</em>
            </h1>

            {enrollments.length === 0 ? (
              <div className="mt-7 text-left border border-dashed border-line rounded-[20px] px-8 py-16 bg-cream max-[560px]:px-5">
                <div className="w-[72px] h-[72px] rounded-full border border-line bg-paper flex items-center justify-center mb-6 text-[30px] text-accent">
                  ♢
                </div>
                <h2 className="font-serif font-medium text-[clamp(28px,3.4vw,40px)] mb-3.5">
                  Здесь появятся ваши курсы
                </h2>
                <p className="text-ink-soft max-w-[46ch] mb-[26px]">
                  Пока вы ничего не купили. После оплаты курс открывается сразу и остаётся у вас
                  навсегда.
                </p>
                <Link to="/courses" className={btn('solid', { lg: true })}>
                  Выбрать курс
                </Link>
              </div>
            ) : (
              <>
                <p className="text-ink-soft text-base mt-3 mb-8">
                  Доступ навсегда, все уроки открыты сразу.
                </p>

                {enrollments.map((enrollment) => (
                  <EnrolledRow key={enrollment.courseId} enrollment={enrollment} />
                ))}

                {upsell && (
                  <div className="border border-dashed border-line rounded-[14px] p-6 mt-7 flex gap-5 items-center flex-wrap bg-cream">
                    <img
                      src={upsell.image}
                      alt={upsell.name}
                      className="w-[86px] h-[86px] rounded-[10px] object-cover"
                    />
                    <div className="flex-1 min-w-[200px]">
                      <div className="text-xs tracking-[0.1em] uppercase text-accent mb-2">
                        Ещё в каталоге
                      </div>
                      <h3 className="font-serif text-2xl font-semibold">{upsell.name}</h3>
                      <p className="text-[13px] text-ink-soft">{upsell.shortDescription}</p>
                    </div>
                    <Link to={`/courses/${upsell.id}`} className={btn('outline-accent')}>
                      Посмотреть
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {enrollments.length === 0 && starters.length > 0 && (
        <section className="pt-0 pb-20">
          <div className={wrap}>
            <div className="flex justify-between items-end mb-12 gap-6 flex-wrap">
              <h2 className="font-serif font-medium text-[clamp(34px,4.4vw,56px)] leading-[1.02] tracking-[-0.01em] [&_em]:italic [&_em]:text-accent">
                С чего <em>начать</em>
              </h2>
              <p className="text-ink-soft max-w-[38ch]">
                Два курса, которые чаще всего берут первыми.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-[26px] max-[900px]:grid-cols-1">
              {starters.map((course) => (
                <CompactCourseCard key={course.id} course={course} cta="Подробнее →" />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
