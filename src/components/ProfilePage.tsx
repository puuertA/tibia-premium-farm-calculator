import { useState } from "react";
import type { UserProfile } from "../types/backend";

interface ProfilePageProps {
  user: UserProfile;
  charactersCount: number;
  onClose: () => void;
  onSave: (payload: { name?: string; email?: string }) => Promise<void>;
}

export const ProfilePage = ({ user, charactersCount, onClose, onSave }: ProfilePageProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    await onSave({ name, email });
    setMessage("Perfil atualizado.");
    setLoading(false);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card profile-card">
        <div className="auth-header">
          <div>
            <h2>Perfil</h2>
            <p className="muted">Gerencie seus dados da conta.</p>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>Fechar</button>
        </div>

        <div className="profile-info">
          <div>
            <span className="stat-label">Criado em</span>
            <span className="stat-value">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
          <div>
            <span className="stat-label">Último acesso</span>
            <span className="stat-value">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("pt-BR") : "—"}
            </span>
          </div>
          <div>
            <span className="stat-label">Personagens salvos</span>
            <span className="stat-value">{charactersCount}</span>
          </div>
        </div>

        <div className="form-grid">
          <label className="form-field form-group">
            <span>Nome</span>
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="form-field form-group">
            <span>E-mail</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>

        {message && <p className="form-success">{message}</p>}
        <button type="button" className="primary-button" onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
};
