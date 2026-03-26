import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Crosshair, Target, Zap, Thermometer, Weight, Gauge, Box, Radio } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getWeaponById } from "@/data/weapons";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = {
  "Laser Cannon": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Laser Repeater": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Ballistic Cannon": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Ballistic Repeater": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Ballistic Gatling": "bg-red-500/10 text-red-400 border-red-500/20",
  "Distortion": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Missile": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "FPS Ballistic": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "FPS Energy": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "FPS Shotgun": "bg-red-500/10 text-red-400 border-red-500/20",
};

const WeaponDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const weapon = id ? getWeaponById(id) : undefined;

  if (!weapon) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("weaponDetail.notFound")}</h1>
        <Link to="/weapons" className="mt-4 text-primary hover:underline">← {t("weaponDetail.backToWeapons")}</Link>
      </div>
    );
  }

  const isShip = weapon.category === "Ship";
  const dps = weapon.dps ?? Math.round((weapon.damage * weapon.rof) / 60);

  const statCards = [
    { icon: Crosshair, label: t("weaponDetail.dmgPerShot"), value: weapon.damage },
    { icon: Gauge, label: t("weaponDetail.rof"), value: `${weapon.rof}/min` },
    { icon: Zap, label: t("weaponDetail.dps"), value: dps.toLocaleString() },
    { icon: Radio, label: t("weaponDetail.range"), value: `${weapon.range}m` },
    ...(weapon.speed ? [{ icon: Gauge, label: t("weaponDetail.projSpeed"), value: `${weapon.speed} m/s` }] : []),
    ...(weapon.ammo !== undefined ? [{ icon: Box, label: t("weaponDetail.ammo"), value: weapon.ammo === "Unlimited" ? "∞" : weapon.ammo }] : []),
    ...(weapon.powerDraw ? [{ icon: Zap, label: t("weaponDetail.power"), value: `${weapon.powerDraw} pwr/s` }] : []),
    ...(weapon.heatPerShot ? [{ icon: Thermometer, label: t("weaponDetail.heatPerShot"), value: weapon.heatPerShot }] : []),
    ...(weapon.mass ? [{ icon: Weight, label: t("weaponDetail.mass"), value: `${weapon.mass} kg` }] : []),
  ];

  // DPS bar max for visual reference
  const dpsMax = 2500;
  const dpsPercent = Math.min((dps / dpsMax) * 100, 100);

  return (
    <div className="container py-8">
      <Link to="/weapons" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        {t("weaponDetail.backToWeapons")}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{weapon.name}</h1>
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeColors[weapon.type]}`}>
            {weapon.type}
          </span>
        </div>
        <p className="mt-1 font-display text-lg text-primary">{weapon.manufacturer}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline">
            {isShip ? <><Crosshair className="mr-1 h-3 w-3" /> {t("weaponDetail.shipMounted")}</> : <><Target className="mr-1 h-3 w-3" /> {t("weaponDetail.personal")}</>}
          </Badge>
          <Badge variant="outline">{t("weaponDetail.size")} {String(weapon.size)}</Badge>
        </div>
      </div>

      {/* Lore */}
      {weapon.lore && (
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-foreground">{t("weaponDetail.history")}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{weapon.lore}</p>
        </div>
      )}

      {/* DPS Bar visual */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">{t("weaponDetail.firepower")}</h2>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("weaponDetail.dpsLabel")}</span>
              <span className="font-display font-bold text-primary">{dps.toLocaleString()}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                style={{ width: `${dpsPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("weaponDetail.alphaDmg")}</span>
              <span className="font-display font-bold text-foreground">{weapon.damage}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent/80 to-destructive/60 transition-all duration-700"
                style={{ width: `${Math.min((weapon.damage / 450) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("weaponDetail.rofLabel")}</span>
              <span className="font-display font-bold text-foreground">{weapon.rof}/min</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 to-primary/60 transition-all duration-700"
                style={{ width: `${Math.min((weapon.rof / 2200) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">{t("weaponDetail.specs")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <s.icon className="h-3.5 w-3.5" />
                <span className="text-xs">{s.label}</span>
              </div>
              <p className="mt-1 font-display text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 font-display text-lg font-semibold text-foreground">{t("weaponDetail.description")}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{weapon.description}</p>
      </div>
    </div>
  );
};

export default WeaponDetail;
