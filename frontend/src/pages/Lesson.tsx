import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectEnrollmentByCourseId, setLastLesson } from '../store/accountSlice'
import { selectCourseDetail } from '../store/coursesSlice'
import { breadcrumb, btn, wrap } from '../lib/ui'
import LessonPlayer from '../components/LessonPlayer'
import { flattenLessons, findLessonInCourse, lessonNeighbors, resolveLesson } from '../lib/course'

const TABS = ['Описание', 'Ингредиенты и шаги', 'Материалы'] as const

export default function Lesson() {
  const { id = 'foundations', lessonId = 'm2-crust' } = useParams()
  const dispatch = useAppDispatch()
  const course = useAppSelector(selectCourseDetail(id))
  const enrollment = useAppSelector(selectEnrollmentByCourseId(id))
  const [activeTab, setActiveTab] = useState(0)

  const lesson = course ? resolveLesson(course, lessonId) : null
  const programLesson = course ? findLessonInCourse(course, lessonId) : null
  const canWatch =
    Boolean(enrollment) || programLesson?.lesson.access === 'free'
  const { prev, next } = course ? lessonNeighbors(course, lessonId) : { prev: undefined, next: undefined }

  useEffect(() => {
    if (!course || !lesson || !enrollment) return
    if (enrollment.lastLessonId === lesson.id) return
    dispatch(
      setLastLesson({
        courseId: course.id,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
      }),
    )
  }, [course, lesson, enrollment, dispatch])

  if (!course) {
    return <Navigate to="/my-courses" replace />
  }

  if (!canWatch || !lesson) {
    return <Navigate to={`/courses/${id}`} replace />
  }

  const playlist = flattenLessons(course)

  return (
    <>
      <Navbar variant="account" />

      <div className={wrap}>
        <div className="grid grid-cols-[1fr_320px] gap-11 items-start pt-8 pb-20 max-[1000px]:grid-cols-1">
          <div>
            <div className={`${breadcrumb} mb-[18px]`}>
              <Link to="/my-courses">Мои курсы</Link>
              <span>›</span>
              <Link to={`/my-courses/${course.id}`}>{course.name}</Link>
              <span>›</span>
              <span>Урок {lesson.lessonNumber}</span>
            </div>

            <LessonPlayer
              key={lesson.id}
              src={lesson.videoUrl}
              poster={lesson.videoImage}
              title={lesson.title}
              nextHref={
                next
                  ? `/my-courses/${course.id}/lessons/${next.id}`
                  : undefined
              }
              nextTitle={next?.title}
            />

            <div className="text-[13px] text-ink-soft mt-[26px]">
              {lesson.moduleTitle} · урок {lesson.lessonNumber} из {lesson.totalLessons} ·{' '}
              {lesson.duration}
            </div>
            <h1 className="font-serif font-medium text-[clamp(30px,3.6vw,44px)] leading-[1.08] mt-2.5 mb-2.5">
              {lesson.title}
            </h1>

            <div className="flex gap-[26px] border-b border-line mt-7 mb-6">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  className={`py-3.5 text-sm -mb-px border-b-2 ${
                    i === activeTab
                      ? 'text-ink font-semibold border-accent'
                      : 'text-ink-soft border-transparent'
                  }`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 0 && (
              <div className="text-base text-ink-soft leading-[1.75] max-w-[64ch]">
                {lesson.description.map((paragraph) => (
                  <p className="mb-4" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-2 gap-7 max-[1000px]:grid-cols-1">
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-ink mb-3.5">Ингредиенты</h4>
                  {lesson.ingredients.length === 0 ? (
                    <p className="text-sm text-ink-soft">Для этого урока отдельный список не нужен — всё на видео.</p>
                  ) : (
                    <ul className="p-0">
                      {lesson.ingredients.map((item) => (
                        <li
                          key={item.name}
                          className="flex justify-between gap-3 text-[15px] py-2.5 border-b border-line text-ink"
                        >
                          {item.name}
                          <b className="font-semibold whitespace-nowrap">{item.amount}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-ink mb-3.5">Шаги</h4>
                  {lesson.steps.length === 0 ? (
                    <p className="text-sm text-ink-soft">Следуйте порядку в видеоуроке.</p>
                  ) : (
                    <ol className="pl-[22px] list-decimal">
                      {lesson.steps.map((step) => (
                        <li
                          key={step.title}
                          className="text-[15px] text-ink-soft mb-3 leading-[1.65]"
                        >
                          <b className="text-ink">{step.title}</b> {step.text}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="max-w-[52ch]">
                {lesson.materials.map((material) => (
                  <div
                    key={material.name}
                    className="flex items-center gap-2.5 text-sm py-2.5 border-b border-line"
                  >
                    <span className="text-accent">↓</span>
                    <span className="flex-1">{material.name}</span>
                    <a href="#" className="text-xs text-accent font-semibold">
                      Скачать
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between gap-3 mt-10 pt-6 border-t border-line flex-wrap">
              {prev ? (
                <Link
                  to={`/my-courses/${course.id}/lessons/${prev.id}`}
                  className={btn('ghost')}
                >
                  ← Урок {lesson.lessonNumber - 1}. {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to={`/my-courses/${course.id}/lessons/${next.id}`}
                  className={btn('solid')}
                >
                  Урок {lesson.lessonNumber + 1}. {next.title} →
                </Link>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-[94px] border border-line rounded-2xl bg-paper overflow-hidden max-[1000px]:static">
              <div className="px-5 py-[18px] border-b border-line">
                <b className="font-serif text-xl font-semibold">{course.name}</b>
                <div className="text-xs text-ink-soft">{playlist.length} уроков · все открыты</div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {course.modules.map((module) => (
                  <div key={module.title}>
                    <div className="text-[11px] tracking-[0.12em] uppercase text-ink-soft px-5 pt-4 pb-2">
                      {module.title}
                    </div>
                    {module.lessons.map((item, index) => {
                      const n = playlist.findIndex((lessonItem) => lessonItem.id === item.id) + 1
                      const active = item.id === lesson.id
                      const locked = !enrollment && item.access === 'locked'
                      const rowCls = `flex gap-2.5 items-center px-5 py-[11px] text-sm ${
                        active
                          ? 'bg-blush font-semibold shadow-[inset_3px_0_0_var(--accent)]'
                          : locked
                            ? 'text-ink-soft'
                            : 'text-ink hover:bg-blush'
                      }`
                      const inner = (
                        <>
                          <span className="text-ink-soft text-xs w-4 shrink-0">{n || index + 1}</span>
                          <span className="flex-1">{item.title}</span>
                          <span className="text-xs text-ink-soft ml-auto">
                            {locked ? '🔒' : item.duration}
                          </span>
                        </>
                      )

                      if (locked) {
                        return (
                          <div key={item.id} className={rowCls}>
                            {inner}
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={item.id}
                          to={`/my-courses/${course.id}/lessons/${item.id}`}
                          className={rowCls}
                        >
                          {inner}
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
