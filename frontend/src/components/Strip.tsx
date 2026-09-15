import { wrap } from '../lib/ui'

interface StripItem {
  strong: string
  rest: string
}

interface StripProps {
  items: StripItem[]
}

/** The bordered marquee-style strip of selling points. */
export default function Strip({ items }: StripProps) {
  return (
    <div className="border-t border-b border-line bg-cream">
      <div className={`${wrap} flex gap-14 py-[18px] flex-wrap justify-center`}>
        {items.map((item, i) => (
          <span key={i} className="font-serif italic text-[21px] text-ink-soft">
            <b className="text-accent not-italic font-sans font-bold">{item.strong}</b>
            {item.rest}
          </span>
        ))}
      </div>
    </div>
  )
}
