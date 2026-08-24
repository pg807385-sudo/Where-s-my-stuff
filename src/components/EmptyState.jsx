import { PackageSearch } from 'lucide-react'

export default function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-moss-100 dark:bg-moss-800 flex items-center justify-center mb-4">
        <Icon size={26} className="text-moss-500 dark:text-moss-300" />
      </div>
      <h3 className="font-display font-semibold text-lg text-ink dark:text-moss-50">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-ink-soft dark:text-moss-400 mt-1.5 max-w-[26ch] leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
