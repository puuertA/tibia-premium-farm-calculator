import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Clock, Coins, Target, TrendingDown } from "lucide-react";
import type { FarmGoalRecord, PremiumTimeRecord, TibiaCoinPriceRecord } from "../types/backend";
import { formatGold } from "../utils/formatGold";

interface HistoryChartsProps {
  coinHistory: TibiaCoinPriceRecord[];
  farmHistory: FarmGoalRecord[];
  premiumHistory: PremiumTimeRecord[];
}

export const HistoryCharts = ({ coinHistory, farmHistory, premiumHistory }: HistoryChartsProps) => (
  <section className="analytics-section">
    <div className="section-header">
      <div>
        <span className="badge header-badge">Históricos</span>
        <h2 className="section-title">Evolução dos Dados</h2>
        <p className="section-subtitle">Gráficos baseados no histórico salvo na conta.</p>
      </div>
    </div>

    <div className="analytics-grid">
      <section className="card analytics-card">
        <div className="card-header">
          <div className="card-title-row">
            <span className="card-icon">
              <Coins className="card-icon__svg" aria-hidden="true" />
            </span>
            <h3 className="card-title">Preço Tibia Coin</h3>
          </div>
        </div>
        <div className="card-content">
          {coinHistory.length > 0 ? (
            <>
              {coinHistory.length >= 2 && (
                <div style={{ width: "100%", height: 320, marginBottom: "20px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={coinHistory.slice().reverse().map((entry) => ({
                      ...entry,
                      date: new Date(entry.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
                    }))} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="5 5" />
                      <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip
                        formatter={(value) => formatGold(Number(value))}
                        labelFormatter={(value) => value}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Line type="monotone" dataKey="unitPrice" stroke="#38bdf8" strokeWidth={3} dot={{ fill: "#38bdf8", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="stat-grid" style={{ marginTop: coinHistory.length >= 2 ? "0" : 0 }}>
                {coinHistory.slice(0, 4).reverse().map((entry, idx) => (
                  <div key={idx} className="stat-card">
                    <span className="stat-label">{new Date(entry.createdAt).toLocaleDateString("pt-BR")}</span>
                    <span className="stat-value">{formatGold(entry.unitPrice)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">
                <TrendingDown className="empty-state-icon__svg" aria-hidden="true" />
              </span>
              <div>
                <p className="empty-state-title">Histórico vazio</p>
                <p className="empty-state-text">Informe um preço para começar o histórico.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="card analytics-card">
        <div className="card-header">
          <div className="card-title-row">
            <span className="card-icon">
              <Target className="card-icon__svg" aria-hidden="true" />
            </span>
            <h3 className="card-title">Meta de farm</h3>
          </div>
        </div>
        <div className="card-content">
          {farmHistory.length > 0 ? (
            <>
              {farmHistory.length >= 2 && (
                <div style={{ width: "100%", height: 320, marginBottom: "20px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={farmHistory.slice().reverse().map((entry) => ({
                      ...entry,
                      date: new Date(entry.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
                    }))} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="5 5" />
                      <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip
                        formatter={(value) => formatGold(Number(value))}
                        labelFormatter={(value) => value}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Line type="monotone" dataKey="currentGold" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="missingGold" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="stat-grid" style={{ marginTop: farmHistory.length >= 2 ? "0" : 0 }}>
                {farmHistory.slice(0, 4).reverse().map((entry, idx) => (
                  <div key={idx} className="stat-card">
                    <span className="stat-label">{new Date(entry.createdAt).toLocaleDateString("pt-BR")}</span>
                    <span className="stat-value">{formatGold(entry.currentGold)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">
                <TrendingDown className="empty-state-icon__svg" aria-hidden="true" />
              </span>
              <div>
                <p className="empty-state-title">Histórico vazio</p>
                <p className="empty-state-text">Atualize sua meta de farm para começar o histórico.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="card analytics-card">
        <div className="card-header">
          <div className="card-title-row">
            <span className="card-icon">
              <Clock className="card-icon__svg" aria-hidden="true" />
            </span>
            <h3 className="card-title">Premium Time</h3>
          </div>
        </div>
        <div className="card-content">
          {premiumHistory.length > 0 ? (
            <>
              {premiumHistory.length >= 2 && (
                <div style={{ width: "100%", height: 320, marginBottom: "20px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={premiumHistory.slice().reverse().map((entry) => ({
                        ...entry,
                        balanceDays: entry.balanceDays ?? 0,
                        date: new Date(entry.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
                      }))}
                      margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="5 5" />
                      <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip
                        formatter={(value) => `${Number(value)} dias`}
                        labelFormatter={(value) => value}
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          color: "#f8fafc"
                        }}
                      />
                      <Line type="monotone" dataKey="balanceDays" stroke="#38bdf8" strokeWidth={3} dot={{ fill: "#38bdf8", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="stat-grid" style={{ marginTop: premiumHistory.length >= 2 ? "0" : 0 }}>
                {premiumHistory.slice(0, 4).reverse().map((entry, idx) => (
                  <div key={idx} className="stat-card">
                    <span className="stat-label">{new Date(entry.createdAt).toLocaleDateString("pt-BR")}</span>
                    <span className="stat-value">{entry.balanceDays ?? 0} dias</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">
                <TrendingDown className="empty-state-icon__svg" aria-hidden="true" />
              </span>
              <div>
                <p className="empty-state-title">Histórico vazio</p>
                <p className="empty-state-text">Informe sua Premium Time para começar o histórico.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  </section>
);
