import { useState } from "react";

interface LoginFormProps {
  onSubmit: (payload: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const LoginForm = ({ onSubmit, loading, error }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim().length > 3 && password.length >= 6;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    await onSubmit({ email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>E-mail</span>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          required
        />
      </label>
      <label className="form-field">
        <span>Senha</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" type="submit" disabled={!canSubmit || loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};
