import { useState } from "react";

interface RegisterFormProps {
  onSubmit: (payload: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const RegisterForm = ({ onSubmit, loading, error }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canSubmit =
    name.trim().length >= 2 &&
    email.trim().length > 3 &&
    password.length >= 6 &&
    confirmPassword === password;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    await onSubmit({ name, email, password, confirmPassword });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Nome</span>
        <input
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome"
          required
        />
      </label>
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
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
        />
      </label>
      <label className="form-field">
        <span>Confirmar senha</span>
        <input
          className="input"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repita a senha"
          required
          minLength={6}
        />
      </label>
      {confirmPassword.length > 0 && confirmPassword !== password && (
        <p className="form-error">As senhas não conferem.</p>
      )}
      {error && <p className="form-error">{error}</p>}
      <button className="primary-button" type="submit" disabled={!canSubmit || loading}>
        {loading ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
};
