import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectEnrollments } from '../store/accountSlice'

type AccountSection = 'courses' | 'orders' | 'materials' | 'profile'

interface AccountSidebarProps {
  active?: AccountSection
}

const linkBase =
  'flex justify-between items-center px-4 py-3 rounded-[10px] text-sm whitespace-nowrap'

export default function AccountSidebar({ active = 'courses' }: AccountSidebarProps) {
  const enrollmentCount = useAppSelector(selectEnrollments).length

  const items: { id: AccountSection; label: string; to?: string; count?: number }[] = [
    { id: 'courses', label: 'Мои курсы', to: '/my-courses', count: enrollmentCount },
    { id: 'orders', label: 'Заказы', count: 2 },
    { id: 'materials', label: 'Материалы', count: enrollmentCount ? 9 : 0 },
    { id: 'profile', label: 'Профиль' },
  ]

  return (
    <nav className="sticky top-[94px] border border-line rounded-2xl p-2.5 bg-paper max-[900px]:static max-[900px]:flex max-[900px]:overflow-x-auto">
      {items.map((item) => {
        const cls = `${linkBase} ${
          item.id === active
            ? 'bg-ink text-paper font-semibold'
            : 'text-ink-soft hover:bg-blush hover:text-ink'
        }`
        const count = item.count != null && (
          <span className="text-xs opacity-70">{item.count}</span>
        )

        if (item.to) {
          return (
            <Link key={item.id} to={item.to} className={cls}>
              {item.label}
              {count}
            </Link>
          )
        }

        return (
          <span key={item.id} className={`${cls} cursor-default`}>
            {item.label}
            {count}
          </span>
        )
      })}
      <Link to="/" className={`${linkBase} text-ink-soft hover:bg-blush hover:text-ink`}>
        Выйти
      </Link>
    </nav>
  )
}
