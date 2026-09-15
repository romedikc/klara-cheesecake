import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatSom } from '../lib/format'
import { btn } from '../lib/ui'
import { useAppDispatch } from '../store/hooks'
import { addItem } from '../store/cartSlice'

interface ProductCardProps {
  product: Product
  /** "details" links to the product page; "add" adds straight to the cart. */
  cta: 'details' | 'add'
}

export default function ProductCard({ product, cta }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const variant = product.featured ? 'solid' : 'ghost'

  const handleAdd = () =>
    dispatch(
      addItem({
        id: product.id,
        kind: 'product',
        name: product.name,
        subtitle: product.tag,
        price: product.price,
        image: product.image,
      }),
    )

  return (
    <article className="flex flex-col">
      <div className="aspect-square rounded-[14px] overflow-hidden bg-cream mb-[18px] relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {product.badge && (
          <span
            className={`absolute top-3.5 left-3.5 text-white text-[11px] font-bold tracking-[0.06em] px-2.5 py-1 rounded-full ${
              product.badgeDark ? 'bg-ink' : 'bg-accent'
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <span className="text-[11px] tracking-[0.12em] uppercase text-accent font-semibold mb-1.5">
        {product.tag}
      </span>
      <div className="flex justify-between items-baseline gap-3 mb-1.5">
        <h3 className="font-serif text-[26px] font-semibold">{product.name}</h3>
        <span className="font-bold text-base whitespace-nowrap">{formatSom(product.price)}</span>
      </div>
      <p className="text-ink-soft text-sm mb-4 flex-1">{product.description}</p>
      {cta === 'details' ? (
        <Link to={`/cakes/${product.id}`} className={btn(variant, { block: true })}>
          Подробнее
        </Link>
      ) : (
        <button className={btn(variant, { block: true })} onClick={handleAdd}>
          В корзину
        </button>
      )}
    </article>
  )
}
