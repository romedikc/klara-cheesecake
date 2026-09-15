import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CourseModule } from '../types'

interface CourseProgramProps {
  modules: CourseModule[]
  variant: 'preview' | 'learn'
  courseId: string
  currentLessonId?: string
}

export default function CourseProgram({
  modules,
  variant,
  courseId,
  currentLessonId,
}: CourseProgramProps) {
  const [openModules, setOpenModules] = useState<boolean[]>(() =>
    modules.map((module, i) =>
      currentLessonId
        ? module.lessons.some((lesson) => lesson.id === currentLessonId)
        : i === 0 || (variant === 'learn' && i === 1),
    ),
  )

  const toggleModule = (index: number) =>
    setOpenModules((prev) => prev.map((open, i) => (i === index ? !open : open)))

  return (
    <>
      {modules.map((module, i) => (
        <div className="border border-line rounded-xl overflow-hidden mb-2.5" key={module.title}>
          <button
            type="button"
            className="flex justify-between items-center w-full text-left px-5 py-[18px] cursor-pointer bg-paper hover:bg-blush"
            onClick={() => toggleModule(i)}
          >
            <div>
              <div className="font-semibold text-[15px]">{module.title}</div>
              <div className="text-[13px] text-ink-soft">{module.meta}</div>
            </div>
            <span
              className={`text-accent text-lg transition-transform duration-[250ms] ${
                openModules[i] ? 'rotate-180' : ''
              }`}
            >
              ▾
            </span>
          </button>
          {openModules[i] && (
            <div className="px-5 pt-1 pb-3.5 border-t border-line">
              {module.lessons.map((lesson) => {
                const isCurrent = lesson.id === currentLessonId
                const rowCls = `flex items-center gap-3 py-2.5 border-b border-line last:border-b-0 text-sm ${
                  variant === 'learn'
                    ? isCurrent
                      ? 'text-ink font-semibold'
                      : 'text-ink hover:[&_.lesson-t]:text-accent'
                    : 'text-ink-soft'
                }`

                const inner = (
                  <>
                    <span className="text-accent w-5 text-center shrink-0 text-xs">
                      {variant === 'preview' && lesson.access === 'locked' ? '🔒' : '▶'}
                    </span>
                    <span className="lesson-t flex-1">
                      {lesson.title}
                      {variant === 'learn' && isCurrent && (
                        <span className="text-accent font-semibold text-xs"> · вы здесь</span>
                      )}
                    </span>
                    {variant === 'preview' && lesson.access === 'free' && (
                      <span className="text-[11px] font-semibold text-accent tracking-[0.06em] ml-auto">
                        Бесплатно
                      </span>
                    )}
                    {variant === 'learn' && (
                      <span className="text-xs text-ink-soft ml-auto">{lesson.duration}</span>
                    )}
                  </>
                )

                if (variant === 'learn') {
                  return (
                    <Link
                      key={lesson.id}
                      to={`/my-courses/${courseId}/lessons/${lesson.id}`}
                      className={rowCls}
                    >
                      {inner}
                    </Link>
                  )
                }

                return (
                  <div className={rowCls} key={lesson.id}>
                    {inner}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
