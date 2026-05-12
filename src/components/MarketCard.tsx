import { AlertTriangle, Coins, Info } from "lucide-react";
import type { MarketPriceResult } from "../types/tibia";
import { formatGold } from "../utils/formatGold";

interface MarketCardProps {
  world: string;
  marketPrice: MarketPriceResult | null;
  manualPrice: number;
  effectivePrice: number;
  loading: boolean;
  error: string | null;
}

export const MarketCard = ({
  world,
  marketPrice,
  manualPrice,
  effectivePrice,
  loading,
  error
}: MarketCardProps) => {
  const statusText = loading
    ? "Buscando preço..."
    : marketPrice?.success
      ? `Fonte: ${marketPrice.source}`
      : "Preço manual";

  const hasPrice = effectivePrice > 0;
  const priceFor250 = hasPrice ? effectivePrice * 250 : 0;

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-icon">
            <Coins className="card-icon__svg" aria-hidden="true" />
          </span>
          <h2 className="card-title">Tibia Coin</h2>
        </div>
        <span className="badge badge-info">{statusText}</span>
      </div>

      <div className="card-content market-content">
        <div className="stat-grid market-grid">
          <div className="stat-card">
            <span className="stat-label">Mundo</span>
            <span className="stat-value">{world || "Não informado"}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Preço unitário</span>
            <span className="stat-value stat-value--lg">
              {hasPrice ? formatGold(effectivePrice) : "—"}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Preço 250 TC</span>
            <span className="stat-value">{hasPrice ? formatGold(priceFor250) : "—"}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Fonte</span>
            <span className="stat-value">
              {marketPrice?.success ? marketPrice.source : manualPrice > 0 ? "Manual" : "—"}
            </span>
          </div>
        </div>

        {!hasPrice && !loading && (
          <div className="empty-state empty-state-warning">
            <span className="empty-state-icon">
              <AlertTriangle className="empty-state-icon__svg" aria-hidden="true" />
            </span>
            <div>
              <p className="empty-state-title">Preço indisponível</p>
              <p className="empty-state-text">
                Informe o preço manual para continuar.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="card-alert card-alert-warning">
          <Info className="card-alert-icon" aria-hidden="true" />
          {error}
        </p>
      )}
    </section>
  );
};
