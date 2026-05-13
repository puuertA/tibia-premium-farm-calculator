import { AlertTriangle, Target } from "lucide-react";
import type { FarmGoal } from "../types/tibia";
import { formatGold } from "../utils/formatGold";
import { CoinStackBadge } from "./CoinStackBadge";

interface FarmGoalCardProps {
  goal: FarmGoal;
  unitPrice: number;
  targetGold: number;
  formattedTarget: string;
  className?: string;
}

export const FarmGoalCard = ({
  goal,
  unitPrice,
  targetGold,
  formattedTarget,
  className
}: FarmGoalCardProps) => {
  const hasExpired = goal.daysRemaining <= 0 && goal.hoursRemaining <= 0;
  const progressPercent = targetGold > 0
    ? Math.min(100, Math.round((goal.currentGold / targetGold) * 100))
    : 0;

  return (
    <section className={`card ${className ?? ""}`.trim()}>
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-icon">
            <Target className="card-icon__svg" aria-hidden="true" />
          </span>
          <h2 className="card-title">Meta de Farm</h2>
        </div>
        <span
          className={
            goal.hasEnoughGold
              ? "badge badge-success"
              : hasExpired
                ? "badge badge-danger"
                : "badge badge-warning"
          }
        >
          {goal.hasEnoughGold ? "OK" : hasExpired ? "Expirando" : "Em progresso"}
        </span>
      </div>

      <div className="card-content farm-content">
        {goal.hasEnoughGold && (
          <div className="farm-hero farm-hero-success">
            <div className="stat-label">Status Meta</div>
            <div className="big-number" style={{ color: "#22c55e" }}>
              Objetivo Atingido
            </div>
            <p className="farm-hero-text">Você já possui gold suficiente para os 250 Tibia Coins.</p>
          </div>
        )}

        {!goal.hasEnoughGold && (
          <div className="farm-hero">
            <div className="stat-label">Gold Faltante</div>
            <div className="big-number-row" style={{ color: hasExpired ? "#ef4444" : "#f59e0b" }}>
              <CoinStackBadge amount={goal.missingGold} showCount={false} />
              <span className="big-number">{formatGold(goal.missingGold)}</span>
            </div>
            <p className="farm-hero-text">{goal.daysRemaining} dias restantes</p>
          </div>
        )}

        <div className="farm-stats">
          <div className="stat-card">
            <span className="stat-label">Gold Atual</span>
            <div className="stat-value-row">
              <span className="stat-value">{formatGold(goal.currentGold)}</span>
              <CoinStackBadge amount={goal.currentGold} />
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Necessário</span>
            <div className="stat-value-row">
              <span className="stat-value">{unitPrice > 0 ? formattedTarget : "—"}</span>
              {unitPrice > 0 && <CoinStackBadge amount={targetGold} />}
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Dias Restantes</span>
            <span className="stat-value">{goal.daysRemaining > 0 ? goal.daysRemaining : "0"}</span>
          </div>
          {!goal.hasEnoughGold && !hasExpired && (
            <div className="stat-card">
              <span className="stat-label">Gold/Dia</span>
              <span className="stat-value">{formatGold(goal.goldPerDay)}</span>
            </div>
          )}
        </div>

        <div className="progress-bar farm-progress-bar">
          <div
            className={`progress-bar__fill ${goal.hasEnoughGold ? "progress-success" : "progress-warning"} farm-progress`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {!goal.hasEnoughGold && hasExpired && (
          <div className="card-alert card-alert-warning">
            <AlertTriangle className="card-alert-icon" aria-hidden="true" />
            Sua premium já expirou ou expira hoje.
          </div>
        )}
      </div>
    </section>
  );
};
