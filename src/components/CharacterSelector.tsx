import type { CharacterRecord } from "../types/backend";

interface CharacterSelectorProps {
  characters: CharacterRecord[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const CharacterSelector = ({ characters, activeId, onSelect }: CharacterSelectorProps) => (
  <div className="character-selector">
    <label className="form-field">
      <span>Personagem ativo</span>
      <select
        className="input"
        value={activeId ?? ""}
        onChange={(event) => {
          if (event.target.value) {
            onSelect(event.target.value);
          }
        }}
      >
        <option value="">Selecione...</option>
        {characters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name} {character.world ? `(${character.world})` : ""}
          </option>
        ))}
      </select>
    </label>
  </div>
);
