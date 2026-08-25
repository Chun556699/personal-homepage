import { site } from '@/lib/site'

const socialLinks = [
  { href: site.socials.github, label: 'GitHub', external: true },
  { href: site.socials.twitter, label: 'X', external: true },
  { href: `mailto:${site.email}`, label: 'Email', external: false },
] as const

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {site.name}
        </p>

        <ul className="flex items-center gap-4 text-sm text-muted-foreground">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
