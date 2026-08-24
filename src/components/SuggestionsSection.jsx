import { Clock, MapPin, KeyRound, Bell, Camera, Sparkles } from 'lucide-react'

const ICONS = {
  clock: Clock,
  'map-pin': MapPin,
  'key-round': KeyRound,
  bell: Bell,
  camera: Camera,
}

export default function SuggestionsSection({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles size={14} className="text-amber-500" />
        <h2 className="font-display font-semibold text-[15px] text-ink dark:text-moss-50">
          Suggestions
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {suggestions.map((s) => {
          const Icon = ICONS[s.icon] || Sparkles
          return (
            <div
              key={s.id}
              className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/20 rounded-2xl px-4 py-3"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={13} className="text-amber-600" />
              </div>
              <p className="text-sm text-ink dark:text-moss-100 leading-snug pt-0.5">{s.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
