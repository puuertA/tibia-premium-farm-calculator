import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BarChart3, Coins, Compass, FileText, Gift, Skull, Target } from "lucide-react";
import type { HuntSessionRecord } from "../types/backend";
import { formatGold } from "../utils/formatGold";
import { calculateHuntInsights } from "../utils/huntAnalytics";

interface HuntHistorySectionProps {
  records: HuntSessionRecord[];
  currentGold: number;
  goldMissing: number;
  daysRemaining: number;
}

const colors = ["#38bdf8", "#22c55e", "#f97316", "#a855f7", "#f59e0b", "#ef4444"];

const numberTooltip = (value: unknown) => formatGold(Number(value ?? 0));

export const HuntHistorySection = ({
  records,
  currentGold,
  goldMissing,
  daysRemaining
}: HuntHistorySectionProps) => {
  const insights = calculateHuntInsights(records, goldMissing, daysRemaining);
  const recentRecords = records.slice(0, 5);

  return (
    <section className="analytics-section">
      <div className="section-header">
        <div>
          <span className="badge header-badge">Hunts</span>
          <h2 className="section-title">Histórico de Hunts</h2>
          <p className="section-subtitle">Acompanhe lucro real, XP/h e distribuição de loot das sessões importadas.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">
            <Compass className="empty-state-icon__svg" aria-hidden="true" />
          </span>
          <div>
            <p className="empty-state-title">Nenhuma hunt importada</p>
            <p className="empty-state-text">Envie um JSON de Hunting Session para começar o histórico.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="stat-grid hunt-summary-grid">
            <div className="stat-card">
              <span className="stat-label">Total de hunts</span>
              <span className="stat-value">{insights.totalHunts}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Lucro total</span>
              <span className="stat-value">{formatGold(insights.totalProfit)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Lucro médio/h</span>
              <span className="stat-value">{formatGold(insights.averageProfitPerHour)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">XP total</span>
              <span className="stat-value">{formatGold(insights.totalXp)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">XP/h médio</span>
              <span className="stat-value">{formatGold(insights.averageXpPerHour)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Monstro mais farmado</span>
              <span className="stat-value">{insights.mostFarmedMonster?.name ?? "—"}</span>
            </div>
          </div>

          <div className="analytics-grid hunt-analytics-grid">
            <section className="card analytics-card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="card-icon">
                    <Coins className="card-icon__svg" aria-hidden="true" />
                  </span>
                  <h3 className="card-title">Lucro por hunt</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={insights.chartPoints} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="5 5" />
                      <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip
                        formatter={numberTooltip as any}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="card analytics-card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="card-icon">
                    <Target className="card-icon__svg" aria-hidden="true" />
                  </span>
                  <h3 className="card-title">XP/h por hunt</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={insights.chartPoints} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="5 5" />
                      <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip
                        formatter={numberTooltip as any}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Line type="monotone" dataKey="xpPerHour" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="card analytics-card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="card-icon">
                    <BarChart3 className="card-icon__svg" aria-hidden="true" />
                  </span>
                  <h3 className="card-title">Lucro/h por hunt</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="chart-wrapper chart-wrapper--bar">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={insights.chartPoints} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="5 5" />
                      <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip
                        formatter={numberTooltip as any}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Bar dataKey="profitPerHour" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="card analytics-card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="card-icon">
                    <Skull className="card-icon__svg" aria-hidden="true" />
                  </span>
                  <h3 className="card-title">Monstros mais mortos</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Tooltip
                        formatter={numberTooltip as any}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Pie data={insights.topMonsters} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={2}>
                        {insights.topMonsters.map((entry, index) => (
                          <Cell key={entry.name} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="card analytics-card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="card-icon">
                    <Gift className="card-icon__svg" aria-hidden="true" />
                  </span>
                  <h3 className="card-title">Itens mais dropados</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="chart-wrapper chart-wrapper--bar">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={insights.topItems} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="5 5" />
                      <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip
                        formatter={numberTooltip as any}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Bar dataKey="value" fill="#a855f7" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="card analytics-card">
              <div className="card-header">
                <div className="card-title-row">
                  <span className="card-icon">
                    <Coins className="card-icon__svg" aria-hidden="true" />
                  </span>
                  <h3 className="card-title">Meta Premium real</h3>
                </div>
              </div>
              <div className="card-content">
                <div className="daily-highlight">
                  <span className="stat-label">Gold atual</span>
                  <span className="big-number">{formatGold(currentGold)}</span>
                  <span className="muted">
                    Baseado no lucro médio real das hunts: {formatGold(insights.averageProfitPerHour)}/h
                  </span>
                </div>
                <div className="stat-grid">
                  <div className="stat-card">
                    <span className="stat-label">Horas necessárias</span>
                    <span className="stat-value">{insights.hoursNeededForTarget > 0 ? insights.hoursNeededForTarget.toFixed(1) : "—"}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Horas/dia</span>
                    <span className="stat-value">{insights.hoursPerDayNeeded > 0 ? insights.hoursPerDayNeeded.toFixed(1) : "—"}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Hunts estimadas</span>
                    <span className="stat-value">{insights.estimatedHuntsForTarget > 0 ? Math.ceil(insights.estimatedHuntsForTarget) : "—"}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="hunt-recent-grid">
            {recentRecords.map((record) => (
              <div key={record.id} className="card hunt-recent-card">
                <div className="card-header">
                  <div className="card-title-row">
                    <span className="card-icon">
                      <FileText className="card-icon__svg" aria-hidden="true" />
                    </span>
                    <h3 className="card-title">{record.sourceFileName ?? "Hunt importada"}</h3>
                  </div>
                  <span className="badge badge-info">{new Date(record.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="card-content">
                  <div className="stat-grid">
                    <div className="stat-card">
                      <span className="stat-label">Lucro</span>
                      <span className="stat-value">{formatGold(record.balance)}</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">Lucro/h</span>
                      <span className="stat-value">{formatGold(record.profitPerHour)}</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">XP/h</span>
                      <span className="stat-value">{formatGold(record.xpPerHour)}</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">Monstros</span>
                      <span className="stat-value">{record.totalMonstersKilled}</span>
                    </div>
                  </div>
                  <p className="muted">Maior kill: {record.mostKilledMonster ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};