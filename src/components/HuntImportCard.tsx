import type { ChangeEvent } from "react";
import { AlertTriangle, ArrowRight, Puzzle, UploadCloud } from "lucide-react";
import type { HuntSessionSummary } from "../types/tibia";
import { formatGold } from "../utils/formatGold";

interface HuntImportCardProps {
  session: HuntSessionSummary | null;
  loading: boolean;
  error: string | null;
  onFileSelect: (file: File | null) => void;
  onApply: () => void;
  onClear: () => void;
}

export const HuntImportCard = ({
  session,
  loading,
  error,
  onFileSelect,
  onApply,
  onClear
}: HuntImportCardProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;
    onFileSelect(file);
    event.currentTarget.value = "";
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-icon">
            <UploadCloud className="card-icon__svg" aria-hidden="true" />
          </span>
          <h2 className="card-title">Importar JSON de hunt</h2>
        </div>
        <span className="badge badge-info">.json</span>
      </div>

      <p className="muted">
        Envie um arquivo exportado da hunt para carregar saldo, XP, loot e a lista de monstros.
      </p>

      <div className="form-grid">
        <label className="form-field form-group form-field-full">
          <span style={{ marginBottom: "6px", display: "inline-block" }}>Arquivo JSON</span>
          <input
            className="input"
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      </div>

      {error && (
        <div className="card-alert card-alert-warning">
          <AlertTriangle className="card-alert-icon" aria-hidden="true" />
          {error}
        </div>
      )}

      {!session && !error && (
        <div className="empty-state">
          <span className="empty-state-icon">
            <Puzzle className="empty-state-icon__svg" aria-hidden="true" />
          </span>
          <div>
            <p className="empty-state-title">Nenhum arquivo importado</p>
            <p className="empty-state-text">Escolha um JSON de hunt para ver o resumo aqui.</p>
          </div>
        </div>
      )}

      {session && (
        <div className="card-content" style={{ marginTop: 0 }}>
          <div className="hunt-summary-note">Arquivo: {session.fileName}</div>

          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Balance</span>
              <span className="stat-value">{formatGold(session.balance)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Gold/h</span>
              <span className="stat-value">{formatGold(session.goldPerHour)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">XP Gain</span>
              <span className="stat-value">{formatGold(session.xpGain)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Profit/h</span>
              <span className="stat-value">{formatGold(session.goldPerHour)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Monstros</span>
              <span className="stat-value">{session.totalMonstersKilled}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Itens</span>
              <span className="stat-value">{session.totalLootedItems}</span>
            </div>
          </div>

          <div className="hunt-summary-note">
            Mais abatido: {session.mostKilledMonster ?? "—"} • Sessão: {session.sessionLength}
          </div>

          <div className="hunt-preview-grid">
            <div className="hunt-list">
              <div className="stat-label">Monstros abatidos</div>
              {session.killedMonsters.slice(0, 4).map((monster) => (
                <div key={monster.name} className="hunt-list-item">
                  <strong>{monster.name}</strong>
                  <span>{monster.count}</span>
                </div>
              ))}
            </div>

            <div className="hunt-list">
              <div className="stat-label">Itens lootados</div>
              {session.lootedItems.slice(0, 4).map((item) => (
                <div key={item.name} className="hunt-list-item">
                  <strong>{item.name}</strong>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hunt-file-actions">
            <button type="button" className="primary-button" onClick={onApply} disabled={loading}>
              <span>Importar e salvar</span>
              <ArrowRight className="button-icon" aria-hidden="true" />
            </button>
            <button type="button" className="ghost-button" onClick={onClear} disabled={loading}>
              Limpar importação
            </button>
          </div>
        </div>
      )}
    </section>
  );
};