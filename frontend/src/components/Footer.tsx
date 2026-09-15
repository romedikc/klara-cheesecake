import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { wrap } from '../lib/ui'

interface FooterProps {
  style?: CSSProperties
}

const colHeading = 'text-xs tracking-[0.14em] uppercase text-ink mb-4'
const colLink =
  'block text-sm mb-2.5 text-ink-soft transition-colors duration-200 hover:text-accent'

export default function Footer({ style }: FooterProps) {
  return (
    <footer className="bg-cream text-ink-soft pt-16 pb-9 border-t border-line" style={style}>
      <div className={wrap}>
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-12 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          <div>
            <Link
              to="/"
              className="block font-serif text-[27px] font-semibold tracking-[0.01em] text-ink mb-3.5 [&_em]:italic [&_em]:text-accent"
            >
              Klara <em>Cheesecakes</em>
            </Link>
            <p className="text-sm max-w-[28ch]">
              Чизкейки малыми партиями и онлайн мастер-классы, сделано вручную.
            </p>
          </div>
          <div>
            <h4 className={colHeading}>Магазин</h4>
            <Link to="/cakes" className={colLink}>
              Чизкейки
            </Link>
            <a href="#" className={colLink}>
              Подарочные наборы
            </a>
          </div>
          <div>
            <h4 className={colHeading}>Обучение</h4>
            <Link to="/courses" className={colLink}>
              Все курсы
            </Link>
            <Link to="/my-courses" className={colLink}>
              Мои курсы
            </Link>
          </div>
          <div>
            <h4 className={colHeading}>Студия</h4>
            <Link to="/about" className={colLink}>
              О нас
            </Link>
            <Link to="/contacts" className={colLink}>
              Контакты
            </Link>
          </div>
        </div>
        <div className="border-t border-line pt-6 flex justify-between text-[13px] flex-wrap gap-3">
          <span>© 2026 Klara Cheesecakes</span>
          <span>Сделано с любовью к чизкейку</span>
        </div>
      </div>
    </footer>
  )
}
