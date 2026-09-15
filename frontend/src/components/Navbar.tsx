import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectCartCount } from '../store/cartSlice'
import { selectUser } from '../store/accountSlice'
import { btn, wrap } from '../lib/ui'

type NavVariant = 'default' | 'home' | 'checkout' | 'plain' | 'account'

interface NavbarProps {
  variant?: NavVariant
}

const navShell =
  'sticky top-0 z-50 bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-[10px] border-b border-line'
const navInner = `${wrap} flex items-center justify-between h-[74px]`
const brandCls =
  'font-serif text-[27px] font-semibold tracking-[0.01em] [&_em]:italic [&_em]:text-accent'
const cartBadge =
  'absolute -top-1.5 -right-2 bg-accent text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center'

const navItems = [
  { to: '/cakes', label: 'Чизкейки' },
  { to: '/courses', label: 'Курсы' },
  { to: '/my-courses', label: 'Мои курсы' },
  { to: '/about', label: 'О пекаре' },
]

const navLink = (active: boolean) =>
  `text-sm transition-colors duration-200 ${
    active ? 'text-ink font-semibold' : 'text-ink-soft hover:text-ink'
  }`

const mobileLink = (active: boolean) =>
  `py-3.5 border-b border-line text-[17px] transition-colors ${
    active ? 'text-accent font-semibold' : 'text-ink'
  }`

function BrandMark() {
  return (
    <Link to="/" className={brandCls}>
      Klara <em>Cheesecakes</em>
    </Link>
  )
}

function AvatarLink() {
  const user = useAppSelector(selectUser)
  return (
    <Link
      to="/my-courses"
      title={`${user.firstName} — личный кабинет`}
      className="w-9 h-9 rounded-full bg-accent text-white font-bold text-sm flex items-center justify-center hover:bg-accent-deep shrink-0"
    >
      {user.initials}
    </Link>
  )
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const location = useLocation()
  const cartCount = useAppSelector(selectCartCount)
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (prefix: string) =>
    location.pathname === prefix || location.pathname.startsWith(prefix + '/')

  useEffect(() => setMenuOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  if (variant === 'home') {
    return (
      <>
        <nav className={navShell}>
          <div className={navInner}>
            <div className="font-serif text-[27px] font-semibold tracking-[0.01em]">
              Klara Cheesecakes
            </div>

            <div className="flex gap-[34px] items-center max-[900px]:hidden">
              <a href="#shop" className={navLink(false)}>
                Чизкейки
              </a>
              <a href="#courses" className={navLink(false)}>
                Курсы
              </a>
              <a href="#story" className={navLink(false)}>
                О пекаре
              </a>
              <Link to="/cakes" className={`${btn('solid')} text-white`}>
                Заказать
              </Link>
            </div>

            <button
              className="hidden max-[900px]:flex flex-col justify-center items-center gap-[5px] w-10 h-10 -mr-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <span className="w-[22px] h-[2px] bg-ink rounded" />
              <span className="w-[22px] h-[2px] bg-ink rounded" />
              <span className="w-[22px] h-[2px] bg-ink rounded" />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
            <aside className="absolute top-0 right-0 h-full w-[280px] max-w-[80vw] bg-paper border-l border-line px-6 py-5 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-[27px] font-semibold tracking-[0.01em]">
                  Klara Cheesecakes
                </span>
                <button
                  className="w-9 h-9 flex items-center justify-center text-2xl text-ink-soft"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Закрыть меню"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col">
                <a href="#shop" className={mobileLink(false)} onClick={() => setMenuOpen(false)}>
                  Чизкейки
                </a>
                <a href="#courses" className={mobileLink(false)} onClick={() => setMenuOpen(false)}>
                  Курсы
                </a>
                <a href="#story" className={mobileLink(false)} onClick={() => setMenuOpen(false)}>
                  О пекаре
                </a>
                <Link to="/cakes" className={mobileLink(false)} onClick={() => setMenuOpen(false)}>
                  Заказать
                </Link>
              </div>
            </aside>
          </div>
        )}
      </>
    )
  }

  if (variant === 'checkout') {
    return (
      <nav className={navShell}>
        <div className={navInner}>
          <BrandMark />
          <Link to="/cart" className={btn('ghost')}>
            ← Вернуться в корзину
          </Link>
        </div>
      </nav>
    )
  }

  const showCart = variant !== 'plain' && variant !== 'account'
  const showAvatar = variant === 'account'

  return (
    <>
      <nav className={navShell}>
        <div className={navInner}>
          <BrandMark />

          <div className="flex gap-[34px] items-center max-[900px]:hidden">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className={navLink(isActive(item.to))}>
                {item.label}
              </Link>
            ))}
            {showCart && (
              <Link to="/cart" className={`${btn('ghost')} relative`}>
                🛒 Корзина
                <span className={cartBadge}>{cartCount}</span>
              </Link>
            )}
            {showAvatar && <AvatarLink />}
          </div>

          <button
            className="hidden max-[900px]:flex flex-col justify-center items-center gap-[5px] w-10 h-10 -mr-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <span className="w-[22px] h-[2px] bg-ink rounded" />
            <span className="w-[22px] h-[2px] bg-ink rounded" />
            <span className="w-[22px] h-[2px] bg-ink rounded" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute top-0 right-0 h-full w-[280px] max-w-[80vw] bg-paper border-l border-line px-6 py-5 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className={brandCls}>
                Klara <em>Cheesecakes</em>
              </span>
              <button
                className="w-9 h-9 flex items-center justify-center text-2xl text-ink-soft"
                onClick={() => setMenuOpen(false)}
                aria-label="Закрыть меню"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className={mobileLink(isActive(item.to))}>
                  {item.label}
                </Link>
              ))}
              {showCart && (
                <Link
                  to="/cart"
                  className={`${mobileLink(isActive('/cart'))} flex items-center justify-between`}
                >
                  <span>🛒 Корзина</span>
                  <span className="bg-accent text-white text-xs font-bold min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
              )}
              {showAvatar && (
                <Link
                  to="/my-courses"
                  className={`${mobileLink(isActive('/my-courses'))} flex items-center gap-3`}
                >
                  <AvatarLink />
                  <span>Кабинет</span>
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
