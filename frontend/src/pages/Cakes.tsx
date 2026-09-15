import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Strip from '../components/Strip'
import ProductCard from '../components/ProductCard'
import { useAppSelector } from '../store/hooks'
import { selectProducts } from '../store/productsSlice'
import { cakeFilters, cakeSortOptions } from '../data/products'
import { breadcrumb, eyebrow, pageTitle, wrap } from '../lib/ui'

const filterBtn = (active: boolean) =>
  `px-[18px] py-2 rounded-full text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${
    active
      ? 'border-accent text-accent bg-blush'
      : 'border-line bg-paper text-ink-soft hover:border-accent hover:text-accent hover:bg-blush'
  }`

export default function Cakes() {
  const products = useAppSelector(selectProducts)
  const [activeFilter, setActiveFilter] = useState(0)
  const [sort, setSort] = useState(cakeSortOptions[0])

  const visible = products
    .filter((product) => {
      if (activeFilter === 0) return true
      const map = ['', 'Классический', 'Сезонное', 'Веганский', '', 'Подарочный']
      const key = map[activeFilter]
      if (!key) return true
      return product.tag === key || product.badge === key
    })
    .slice()
    .sort((a, b) => {
      if (sort === 'Сначала дешевле') return a.price - b.price
      if (sort === 'Сначала дороже') return b.price - a.price
      return 0
    })

  return (
    <>
      <Navbar />

      <div className="pt-[60px] pb-12 border-b border-line">
        <div className={wrap}>
          <div className={breadcrumb}>
            <Link to="/">Главная</Link>
            <span>›</span>
            <span>Чизкейки</span>
          </div>
          <span className={eyebrow}>Выпечка на заказ</span>
          <h1 className={pageTitle}>
            Наши <em>чизкейки</em>
          </h1>
          <p className="text-ink-soft text-[17px] mt-4 max-w-[44ch]">
            Каждый собирается вручную в день отправки. Только настоящий сливочный
            сыр, без стабилизаторов.
          </p>
        </div>
      </div>

      <Strip
        items={[
          { strong: '48 ч', rest: ' на заказ' },
          { strong: 'Свежие', rest: ' каждый день' },
          { strong: 'Доставка', rest: ' по городу' },
          { strong: 'Без', rest: ' стабилизаторов' },
        ]}
      />

      <section className="py-20 max-[560px]:py-[60px]">
        <div className={wrap}>
          <div className="flex gap-2.5 flex-wrap mb-10">
            {cakeFilters.map((filter, i) => (
              <button
                key={filter}
                className={filterBtn(i === activeFilter)}
                onClick={() => setActiveFilter(i)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <span className="text-sm text-ink-soft">
              Показано {visible.length} из {products.length} позиций
            </span>
            <div className="flex items-center gap-2.5 text-sm text-ink-soft">
              Сортировка:
              <select
                className="border border-line bg-paper px-3 py-2 rounded-lg font-sans text-[13px] text-ink cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {cakeSortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} cta="details" />
            ))}
          </div>

          {/*<div className="text-center mt-[52px]">*/}
          {/*  <button className={btn('ghost', { lg: true })}>Загрузить ещё (6)</button>*/}
          {/*</div>*/}
        </div>
      </section>

      <Footer />
    </>
  )
}
