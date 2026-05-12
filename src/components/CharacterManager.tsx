import { FileText, Puzzle } from "lucide-react";
import { useState } from "react";
import type { CharacterRecord } from "../types/backend";

interface CharacterManagerProps {
  characters: CharacterRecord[];
  onCreate: (payload: { name: string; world?: string }) => Promise<void>;
  onUpdate: (id: string, payload: Partial<CharacterRecord>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onSetActive: (id: string) => Promise<void>;
}

export const CharacterManager = ({ characters, onCreate, onUpdate, onRemove, onSetActive }: CharacterManagerProps) => {
  const [name, setName] = useState("");
  const [world, setWorld] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingWorld, setEditingWorld] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await onCreate({ name: name.trim(), world: world.trim() || undefined });
    setName("");
    setWorld("");
  };

  const startEdit = (character: CharacterRecord) => {
    setEditingId(character.id);
    setEditingName(character.name);
    setEditingWorld(character.world ?? "");
  };

  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return;
    await onUpdate(editingId, { name: editingName.trim(), world: editingWorld.trim() || undefined });
    setEditingId(null);
    setEditingName("");
    setEditingWorld("");
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title-row">
          <span className="card-icon">
            <FileText className="card-icon__svg" aria-hidden="true" />
          </span>
          <h2 className="card-title">Personagens salvos</h2>
        </div>
      </div>

      <div className="form-grid">
        <label className="form-field form-group">
          <span>Nome</span>
          <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="form-field form-group">
          <span>Mundo</span>
          <input className="input" value={world} onChange={(event) => setWorld(event.target.value)} />
        </label>
        <button type="button" className="primary-button" onClick={handleCreate}>
          Adicionar personagem
        </button>
      </div>

      <div className="divider" />

      {characters.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">
            <Puzzle className="empty-state-icon__svg" aria-hidden="true" />
          </span>
          <div>
            <p className="empty-state-title">Nenhum personagem salvo</p>
            <p className="empty-state-text">Adicione ou salve o personagem carregado.</p>
          </div>
        </div>
      )}

      {characters.length > 0 && (
        <div className="character-list">
          {characters.map((character) => (
            <div key={character.id} className="character-row">
              <div>
                <strong>{character.name}</strong>
                <span className="muted">{character.world ?? "Mundo"}</span>
                {character.isActive && <span className="badge badge-success">Ativo</span>}
              </div>
              <div className="row-actions">
                <button type="button" className="ghost-button" onClick={() => onSetActive(character.id)}>
                  Tornar ativo
                </button>
                <button type="button" className="ghost-button" onClick={() => startEdit(character)}>
                  Editar
                </button>
                <button type="button" className="danger-button" onClick={() => onRemove(character.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <div className="edit-panel">
          <h3>Editar personagem</h3>
          <div className="form-grid">
            <label className="form-field form-group">
              <span>Nome</span>
              <input className="input" value={editingName} onChange={(event) => setEditingName(event.target.value)} />
            </label>
            <label className="form-field form-group">
              <span>Mundo</span>
              <input className="input" value={editingWorld} onChange={(event) => setEditingWorld(event.target.value)} />
            </label>
            <button type="button" className="primary-button" onClick={handleUpdate}>
              Salvar alterações
            </button>
            <button type="button" className="ghost-button" onClick={() => setEditingId(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
