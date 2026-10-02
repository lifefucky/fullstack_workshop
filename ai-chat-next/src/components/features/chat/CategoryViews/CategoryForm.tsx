import { localizationService } from "@/services/localizationService";

interface CategoryFormProps {
  newName: string;
  setNewName: (value: string) => void;
  onAdd: () => void;
}

export default function CategoryForm({ newName, setNewName, onAdd }: CategoryFormProps) {
  return (
    <div className="mx-auto mb-6 w-full max-w-md rounded-2xl border border-line bg-white p-4 shadow-sm">
      <input
        type="text"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        placeholder={localizationService.get("NewCategory")}
        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-ink outline-none focus:border-accent"
      />
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 w-full rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        {localizationService.get("CreateCategory")}
      </button>
    </div>
  );
};
