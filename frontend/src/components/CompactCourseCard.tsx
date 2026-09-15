import { Link } from 'react-router-dom'
import type { Course } from '../types'
import { formatSom } from '../lib/format'

interface CompactCourseCardProps {
  course: Course
  cta?: string
}

/** Compact two-column course card used on Home and empty «Мои курсы». */
export default function CompactCourseCard({
  course,
  cta = 'Записаться →',
}: CompactCourseCardProps) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="grid grid-cols-[150px_1fr] gap-6 items-center bg-paper border border-line rounded-[14px] p-[22px] transition-[border-color,transform] duration-200 hover:border-accent hover:-translate-y-[3px] max-[560px]:grid-cols-1"
    >
      <div className="aspect-square self-stretch rounded-[10px] overflow-hidden bg-cream">
        <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="text-xs tracking-[0.1em] uppercase text-accent mb-2">
          {course.levelLabel} · {course.duration}
        </div>
        <h3 className="font-serif text-[27px] font-semibold mb-1.5">{course.name}</h3>
        <p className="text-sm text-ink-soft mb-3.5">{course.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[17px]">{formatSom(course.price)}</span>
          <span className="text-[13px] text-accent font-semibold">{cta}</span>
        </div>
      </div>
    </Link>
  )
}
