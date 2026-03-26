import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  href: string;
}

const CategoryCard = ({ title, description, icon: Icon, count, href }: CategoryCardProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={href}
      className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 card-hover"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-3 font-display text-xs font-medium text-primary">
          {count} {t("common.entries")} →
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
