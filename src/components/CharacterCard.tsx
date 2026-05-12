import { Puzzle, UserRound } from "lucide-react";
import type { CharacterInfo } from "../types/tibia";

interface CharacterCardProps {
  character: CharacterInfo | null;
  loading: boolean;
  error: string | null;
}

export const CharacterCard = ({ character, loading, error }: CharacterCardProps) => {
  const statusBadge = loading
    ? { label: "Carregando", className: "badge" }
    : character
      ? { label: "Dados carregados", className: "badge badge-success" }
      : { label: "Sem dados", className: "badge badge-warning" };

  const avatarLetter = character?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-icon">
            <UserRound className="card-icon__svg" aria-hidden="true" />
          </span>
          <h2 className="card-title">Personagem</h2>
        </div>
        <span className={statusBadge.className}>{statusBadge.label}</span>
      </div>

      {error && (
        <p className="card-alert card-alert-danger">
          {error}
        </p>
      )}

      {!error && !character && !loading && (
        <div className="empty-state">
          <span className="empty-state-icon">
            <Puzzle className="empty-state-icon__svg" aria-hidden="true" />
          </span>
          <div>
            <p className="empty-state-title">Nenhum personagem carregado</p>
            <p className="empty-state-text">Informe um nome e atualize os dados.</p>
          </div>
        </div>
      )}

      {character && (
        <div className="card-content character-content">
          <div className="character-top">
            <div className="avatar">{avatarLetter}</div>
            <div>
              <h3 className="character-name">{character.name}</h3>
              <div className="badge-row">
                <span className="badge badge-info">
                  {character.vocation ?? "Vocação"}
                </span>
                <span className="badge">{character.world ?? "Mundo"}</span>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: "14px 0" }} />

          <div className="stat-grid character-grid">
            <div className="stat-card">
              <span className="stat-label">Level</span>
              <span className="stat-value stat-value--xl">{character.level ?? "—"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Achievement</span>
              <span className="stat-value stat-value--lg">{character.achievementPoints ?? "—"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Sexo</span>
              <span className="stat-value">{character.sex ?? "—"}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Residência</span>
              <span className="stat-value">{character.residence ?? "—"}</span>
            </div>
          </div>

          <div className="stat-list character-list">
            <div className="stat-row">
              <span className="stat-label">Guild</span>
              <span className="stat-value">{character.guild ?? "—"}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Criado em</span>
              <span className="stat-value">{character.created ?? "—"}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Último login</span>
              <span className="stat-value">{character.lastLogin ?? "—"}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
