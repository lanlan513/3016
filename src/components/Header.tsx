import AestheticWhitepaper from './AestheticWhitepaper'

export default function Header() {
  return (
    <header className="w-full py-8 flex items-center justify-between max-w-[960px] mx-auto px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border border-neutral-900 flex items-center justify-center">
          <div className="w-3 h-3 bg-neutral-900" />
        </div>
        <span className="font-display text-lg tracking-wider text-neutral-900">
          视觉解构
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <span className="font-sans text-xs tracking-widest text-neutral-400 uppercase">
          Visual Deconstruct
        </span>
        <AestheticWhitepaper />
      </div>
    </header>
  )
}
