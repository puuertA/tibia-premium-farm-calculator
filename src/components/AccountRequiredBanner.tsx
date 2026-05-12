interface AccountRequiredBannerProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const AccountRequiredBanner = ({ onLogin, onRegister }: AccountRequiredBannerProps) => (
  <div className="account-banner">
    <div>
      <strong>Modo visitante</strong>
      <p>Entre na sua conta para salvar histórico e acompanhar sua evolução.</p>
    </div>
    <div className="banner-actions">
      <button type="button" className="ghost-button" onClick={onLogin}>Entrar</button>
      <button type="button" className="primary-button" onClick={onRegister}>Criar conta</button>
    </div>
  </div>
);
