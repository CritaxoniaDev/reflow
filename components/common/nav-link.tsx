interface NavLinkProps {
  label: string
  href?: string
}

export function NavLink({ label, href = '#' }: NavLinkProps) {
  return (
    <a
      href={href}
      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200"
    >
      {label}
    </a>
  )
}