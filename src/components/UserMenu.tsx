import type { UserProfile } from "../types/backend";

interface UserMenuProps {
  user: UserProfile;
  open: boolean;
  onToggle: () => void;
  onProfile: () => void;
  onLogout: () => void;
}

export const UserMenu = ({ user, open, onToggle, onProfile, onLogout }: UserMenuProps) => {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="user-menu">
      <button type="button" className="user-trigger" onClick={onToggle}>
        <span className="user-avatar">{initials}</span>
        <span className="user-name">{user.name}</span>
      </button>
      {open && (
        <div className="user-dropdown">
          <p className="muted">{user.email}</p>
          <button type="button" className="ghost-button" onClick={onProfile}>Perfil</button>
          <button type="button" className="danger-button" onClick={onLogout}>Sair</button>
        </div>
      )}
    </div>
  );
};
