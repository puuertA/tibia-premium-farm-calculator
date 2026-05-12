import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthPageProps {
  mode: "login" | "register";
  onClose: () => void;
  onSwitch: (mode: "login" | "register") => void;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onRegister: (payload: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const AuthPage = ({
  mode,
  onClose,
  onSwitch,
  onLogin,
  onRegister,
  loading,
  error
}: AuthPageProps) => (
  <div className="auth-overlay">
    <div className="auth-card">
      <div className="auth-header">
        <div>
          <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>
          <p className="muted">
            {mode === "login"
              ? "Acesse sua conta para salvar histórico e progresso."
              : "Crie sua conta e acompanhe sua evolução."}
          </p>
        </div>
        <button type="button" className="ghost-button" onClick={onClose}>Fechar</button>
      </div>

      <div className="auth-toggle">
        <button
          type="button"
          className={mode === "login" ? "tab-button active" : "tab-button"}
          onClick={() => onSwitch("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === "register" ? "tab-button active" : "tab-button"}
          onClick={() => onSwitch("register")}
        >
          Cadastro
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm onSubmit={onLogin} loading={loading} error={error} />
      ) : (
        <RegisterForm onSubmit={onRegister} loading={loading} error={error} />
      )}
    </div>
  </div>
);
