import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppSelector } from '../store/hooks'
import { selectCourses } from '../store/coursesSlice'
import { courseLevels } from '../data/courses'
import { formatSom } from '../lib/format'
import type { CourseLevel } from '../types'
import { breadcrumb, btn, eyebrow, pageTitle, wrap } from '../lib/ui'

const levelBadge: Record<CourseLevel, string> = {
  beginner: 'bg-[#d1f0e0] text-[#1a6b40]',
  middle: 'bg-[#fde8c8] text-[#8b4a00]',
  advanced: 'bg-[#fdd6d6] text-[#8b0000]',
  business: 'bg-[#dde8ff] text-[#1a3a8b]',
}

const levelBtn = (active: boolean) =>
  `px-5 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${
    active
      ? 'border-accent text-accent bg-white'
      : 'border-line bg-paper text-ink-soft hover:border-accent hover:text-accent hover:bg-white'
  }`

const stat = 'font-serif text-[32px]'

export default function Courses() {
  const courses = useAppSelector(selectCourses)
  const [activeLevel, setActiveLevel] = useState(0)
  const levels: CourseLevel[] = ['beginner', 'middle', 'advanced', 'business']
  const visible =
    activeLevel === 0 ? courses : courses.filter((course) => course.level === levels[activeLevel - 1])

  return (
    <>
      <Navbar />

      <div className="pt-[60px] pb-12 border-b border-line bg-blush">
        <div className={wrap}>
          <div className={breadcrumb}>
            <Link to="/">Главная</Link>
            <span>›</span>
            <span>Курсы</span>
          </div>
          <span className={eyebrow}>Учитесь у Клары</span>
          <h1 className={pageTitle}>
            Онлайн <em>мастер-классы</em>
          </h1>
          <p className="text-ink-soft text-[17px] mt-4 max-w-[46ch]">
            Бессрочный доступ, пошаговые видео и точные рецепты из студии. Уже
            12 000 учеников научились печь идеальный чизкейк.
          </p>
          <div className="flex gap-8 mt-8">
            <div>
              <b className={stat}>12k</b>
              <br />
              <span className="text-[13px] text-ink-soft">учеников</span>
            </div>
            <div>
              <b className={stat}>4.9 ★</b>
              <br />
              <span className="text-[13px] text-ink-soft">средняя оценка</span>
            </div>
            <div>
              <b className={stat}>∞</b>
              <br />
              <span className="text-[13px] text-ink-soft">доступ навсегда</span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 max-[560px]:py-[60px]">
        <div className={wrap}>
          <div className="flex gap-2.5 flex-wrap mb-10">
            {courseLevels.map((level, i) => (
              <button
                key={level}
                className={levelBtn(i === activeLevel)}
                onClick={() => setActiveLevel(i)}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-7 max-[900px]:grid-cols-1">
            {visible.map((course) => (
              <article
                className="bg-paper border border-line rounded-[18px] overflow-hidden transition-[border-color,transform] duration-200 hover:border-accent hover:-translate-y-1 flex flex-col"
                key={course.id}
              >
                <div className="aspect-video bg-cream relative">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-4 left-4 px-3 py-[5px] rounded-full text-[11px] font-bold tracking-[0.06em] ${
                      levelBadge[course.level]
                    }`}
                  >
                    {course.levelLabel}
                  </span>
                </div>
                <div className="p-[26px] flex-1 flex flex-col">
                  <div className="text-xs text-ink-soft tracking-[0.06em] uppercase mb-2.5 flex gap-4">
                    <span>⏱ {course.duration}</span>
                    <span>🎬 {course.lessons}</span>
                  </div>
                  <h3 className="font-serif text-[30px] font-semibold mb-2.5 leading-[1.1]">
                    {course.name}
                  </h3>
                  <p className="text-sm text-ink-soft leading-[1.65] mb-[18px] flex-1">
                    {course.description}
                  </p>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {course.tags.map((tag) => (
                      <span
                        className="text-xs text-ink-soft bg-cream px-2.5 py-1 rounded-full"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-[18px] border-t border-line">
                    <span className="font-serif text-[32px] font-semibold">
                      {formatSom(course.price)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-ink-soft [&_b]:text-accent">
                        <b>★ {course.ratingValue.toFixed(1)}</b> ({course.reviewsCount})
                      </span>
                      <Link to={`/courses/${course.id}`} className={btn('solid')}>
                        Записаться
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-ink text-white rounded-[20px] p-12 my-16 grid grid-cols-[1fr_auto] gap-10 items-center max-[900px]:grid-cols-1">
            <div>
              <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] font-medium leading-[1.1] mb-3.5 [&_em]:italic [&_em]:text-[oklch(0.80_0.12_50)]">
                Не знаете с чего <em>начать?</em>
              </h2>
              <p className="text-white/65 text-[15px]">
                Пройдите бесплатный мини-урок «5 ошибок начинающего пекаря» — и
                сразу поймёте, какой курс подойдёт вам.
              </p>
            </div>
            <a href="#" className={btn('light', { lg: true })}>
              Бесплатный урок →
            </a>
          </div>
        </div>
      </section>

      <div className="text-center py-[72px] bg-cream border-t border-b border-line">
        <div className={wrap}>
          <blockquote className="font-serif italic text-[clamp(24px,3vw,38px)] leading-[1.3] max-w-[22ch] mx-auto mb-5 text-ink [&_em]:text-accent">
            «Единственный курс, который <em>правда</em> объяснил почему чизкейк
            трескается — и как это исправить.»
          </blockquote>
          <p className="text-sm text-ink-soft">Полина Н. · ученица курса «Основы»</p>
        </div>
      </div>

      <Footer />
    </>
  )
}
