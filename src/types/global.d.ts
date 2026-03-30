// Déclaration globale pour Google gtag (Consent Mode + Analytics)
interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
}
