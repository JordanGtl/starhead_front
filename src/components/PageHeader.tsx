'use client';
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
}

export interface PageHeaderProps {
  /** Fil d'ariane (dernier élément = page courante, sans lien) */
  breadcrumb: BreadcrumbItem[];
  /** Titre principal (h1) */
  title: string;
  /** Libellé affiché au-dessus du titre (ex: type de composant) */
  label?: string;
  /** Icône affichée à gauche du label */
  labelIcon?: React.ElementType;
  /** Sous-titre affiché sous le titre */
  subtitle?: string;
  /** Image de fond personnalisée (remplace /hero-bg.jpg) */
  bgImage?: string;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const PageHeader = ({ breadcrumb, title, label, labelIcon: LabelIcon, subtitle, bgImage }: PageHeaderProps) => (
  <>
    {/* Breadcrumb collé sous la navbar */}
    <div className="sticky top-16 z-40 border-b border-border/60 bg-card/90 backdrop-blur-xl">
      <div className="container flex items-center gap-2 py-1.5 text-xs text-muted-foreground">
        {breadcrumb.map((item, i) => {
          const Icon = item.icon;
          const isLast = i === breadcrumb.length - 1;
          return (
            <span key={i} className="flex items-center gap-2 min-w-0">
              {i === 0 && Icon && <Icon className="h-3.5 w-3.5 text-primary shrink-0" />}
              {isLast ? (
                <span className="truncate max-w-xs text-foreground/60">{item.label}</span>
              ) : (
                <>
                  <Link href={item.href ?? "#"} className="hover:text-foreground transition-colors shrink-0">
                    {item.label}
                  </Link>
                  <span className="text-border shrink-0">/</span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>

    {/* Hero pleine largeur */}
    <div className="relative overflow-hidden">
      <img
        src={bgImage ?? "/hero-bg.jpg"}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-15"
        style={{ objectPosition: "50% 30%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />

      <div className="relative container pb-8 pt-6">
        {label && (
          <div className="mb-1 flex items-center gap-2">
            {LabelIcon && <LabelIcon className="h-5 w-5 text-primary" />}
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              {label}
            </span>
          </div>
        )}
        <h1 className="font-display text-4xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  </>
);

export default PageHeader;
