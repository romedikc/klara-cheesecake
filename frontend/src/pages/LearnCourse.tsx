import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CourseProgram from '../components/CourseProgram'
import { useAppSelector } from '../store/hooks'
import { selectEnrollmentByCourseId } from '../store/accountSlice'
import { selectCourseDetail } from '../store/coursesSlice'
import { breadcrumb, btn, eyebrow, wrap } from '../lib/ui'
import { continueLesson, splitTitle } from '../lib/course'
import { plural } from '../lib/format'

export default function LearnCourse() {
  const { id = 'foundations' } = useParams()
  const course = useAppSelector(selectCourseDetail(id))
  const enrollment = useAppSelector(selectEnrollmentByCourseId(id))

  if (!course) {
    return <Navigate to="/my-courses" replace />
  }

  if (!enrollment) {
    return <Navigate to={`/courses/${id}`} replace />
  }

  const current = continueLesson(course, enrollment.lastLessonId)
  const [first, rest] = splitTitle(course.name)

  return (
    <>
      <Navbar variant="account" />

      <div className="pt-[22px]">
        <div className={wrap}>
          <div className={breadcrumb}>
            <Link to="/">Главная</Link>
            <span>›</span>
            <Link to="/my-courses">Мои курсы</Link>
            <span>›</span>
            <span>{course.name}</span>
          </div>
        </div>
      </div>

      <div className={wrap}>
        <div className="grid grid-cols-[1fr_340px] gap-14 items-start pt-10 pb-20 max-[1000px]:grid-cols-1 max-[1000px]:gap-8">
          <div>
            <div className="aspect-[16/7] rounded-[18px] overflow-hidden bg-cream mb-7">
              <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
            </div>
            <span className={eyebrow}>Ваш курс · доступ навсегда</span>
            <h1 className="font-serif font-medium text-[clamp(34px,4.2vw,54px)] leading-[1.04] mb-3 [&_em]:italic [&_em]:text-accent">
              <em>{first}</em>
              {rest}
            </h1>
            <p className="text-base text-ink-soft leading-[1.75] max-w-[62ch]">
              {course.modules.length}{' '}
              {plural(course.modules.length, ['модуль', 'модуля', 'модулей'])},{' '}
              {course.lessons.toLowerCase()} и PDF-рецепты. Все уроки открыты — смотрите в любом
              порядке и возвращайтесь когда удобно.
            </p>

            <h2 className="font-serif text-[30px] font-medium mt-10 mb-5">Уроки</h2>
            <CourseProgram
              modules={course.modules}
              variant="learn"
              courseId={course.id}
              currentLessonId={enrollment.lastLessonId ?? current?.id}
            />
          </div>

          <div>
            <div className="sticky top-[94px] border border-line rounded-[18px] p-[26px] bg-paper max-[1000px]:static">
              {current && (
                <>
                  <Link
                    to={`/my-courses/${course.id}/lessons/${current.id}`}
                    className={btn('solid', { lg: true, block: true, className: 'mb-2.5' })}
                  >
                    {enrollment.lastLessonTitle ? `Продолжить урок` : 'Начать курс'}
                  </Link>
                  <p className="text-[13px] text-ink-soft text-center mb-[22px]">
                    {current.title} · {current.duration}
                  </p>
                </>
              )}

              <h4 className="text-xs tracking-[0.12em] uppercase text-ink-soft mb-3.5">
                Материалы курса
              </h4>
              {course.materials.map((material) => (
                <div
                  key={material.name}
                  className="flex items-center gap-2.5 text-sm py-2.5 border-b border-line last:border-b-0"
                >
                  <span className="text-accent">↓</span>
                  <span className="flex-1">{material.name}</span>
                  <a href="#" className="text-xs text-accent font-semibold">
                    Скачать
                  </a>
                </div>
              ))}

              <h4 className="text-xs tracking-[0.12em] uppercase text-ink-soft mb-3.5 mt-[26px]">
                Автор
              </h4>
              <div className="flex gap-3 items-center">
                <img
                  src={course.author.avatar}
                  alt={course.author.name}
                  className="w-[46px] h-[46px] rounded-full object-cover"
                />
                <div>
                  <div className="font-serif text-[19px] font-semibold">{course.author.name}</div>
                  <Link to="/contacts" className="text-[13px] text-accent font-semibold">
                    Задать вопрос
                  </Link>
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
