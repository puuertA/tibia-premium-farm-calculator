import { ArrowRight, Settings } from "lucide-react";

interface SettingsFormProps {
  mode: "setup" | "calc";
  canProceed: boolean;
  showManualPrice: boolean;
  characterName: string;
  world: string;
  currentGold: string;
  manualUnitPrice: string;
  goldPerHour: string;
  premiumText: string;
  characterLoading: boolean;
  marketLoading: boolean;
  onCharacterNameChange: (value: string) => void;
  onWorldChange: (value: string) => void;
  onGoldChange: (value: string) => void;
  onManualPriceChange: (value: string) => void;
  onGoldPerHourChange: (value: string) => void;
  onPremiumTextChange: (value: string) => void;
  onRefresh: () => void;
  onProceed: () => void;
}

export const SettingsForm = ({
  mode,
  canProceed,
  showManualPrice,
  characterName,
  world,
  currentGold,
  manualUnitPrice,
  goldPerHour,
  premiumText,
  characterLoading,
  marketLoading,
  onCharacterNameChange,
  onWorldChange,
  onGoldChange,
  onManualPriceChange,
  onGoldPerHourChange,
  onPremiumTextChange,
  onRefresh,
  onProceed
}: SettingsFormProps) => {
  const modeLabel = mode === "setup" ? "Setup" : "Atualizar";

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-icon">
            <Settings className="card-icon__svg" aria-hidden="true" />
          </span>
          <h2 className="card-title">Configurações</h2>
        </div>
        <span className="badge badge-info">{modeLabel}</span>
      </div>

      <p className="muted">
        {mode === "setup"
          ? "Preencha nome, mundo e Premium Time para continuar."
          : "Ajuste os dados e recalcule quando quiser."}
      </p>

      <div className="divider" />

      <div className="form-grid">
        <label className="form-field form-group">
          <span style={{ marginBottom: "6px", display: "inline-block" }}>Nome do personagem</span>
          <input
            className="input"
            placeholder="Ex: Sorcerer Brasil"
            value={characterName}
            onChange={(event) => onCharacterNameChange(event.target.value)}
          />
        </label>

        <label className="form-field form-group">
          <span style={{ marginBottom: "6px", display: "inline-block" }}>Mundo / Servidor</span>
          <input
            className="input"
            placeholder="Ex: Descubra"
            value={world}
            onChange={(event) => onWorldChange(event.target.value)}
          />
        </label>

        {mode === "calc" && (
          <label className="form-field form-group">
            <span style={{ marginBottom: "6px", display: "inline-block" }}>Gold atual</span>
            <input
              className="input"
              placeholder="Ex: 5.000.000"
              value={currentGold}
              onChange={(event) => onGoldChange(event.target.value)}
            />
          </label>
        )}

        {mode === "calc" && showManualPrice && (
          <label className="form-field form-group">
            <span style={{ marginBottom: "6px", display: "inline-block" }}>Preço manual da Tibia Coin</span>
            <input
              className="input"
              placeholder="Ex: 38000"
              value={manualUnitPrice}
              onChange={(event) => onManualPriceChange(event.target.value)}
            />
          </label>
        )}

        {mode === "calc" && (
          <label className="form-field form-group">
            <span style={{ marginBottom: "6px", display: "inline-block" }}>Gold por hora (opcional)</span>
            <input
              className="input"
              placeholder="Ex: 650000"
              value={goldPerHour}
              onChange={(event) => onGoldPerHourChange(event.target.value)}
            />
          </label>
        )}

        <label className="form-field form-field-full form-group">
          <span style={{ marginBottom: "6px", display: "inline-block" }}>Texto de Premium Time</span>
          <textarea
            className="input textarea"
            placeholder="Cole o texto do site do Tibia aqui"
            value={premiumText}
            onChange={(event) => onPremiumTextChange(event.target.value)}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={mode === "setup" ? onProceed : onRefresh}
        className="primary-button"
        disabled={characterLoading || marketLoading || (mode === "setup" && !canProceed)}
      >
        <span>{characterLoading || marketLoading ? "Carregando..." : mode === "setup" ? "Continuar" : "Atualizar dados"}</span>
        <ArrowRight className="button-icon" aria-hidden="true" />
      </button>
      {mode === "setup" && !canProceed && (
        <p className="muted" style={{ marginTop: "10px" }}>
          Informe nome, mundo e Premium Time válido para continuar.
        </p>
      )}
    </section>
  );
};
