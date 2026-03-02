import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CHAMPIONS } from "@/data/mock-matchup";
import type { Champion } from "@/types/matchup";
import type { Role } from "@/types/matchup";

interface ChampionPickerProps {
  label: string;
  side: "ally" | "enemy";
  selected: Champion | null;
  onSelect: (champion: Champion) => void;
  onClear: () => void;
}

const ChampionPicker = ({ label, side, selected, onSelect, onClear }: ChampionPickerProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return CHAMPIONS;
    return CHAMPIONS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const borderClass = side === "ally" ? "border-info-status" : "border-threat";

  if (selected) {
    return (
      <button
        onClick={onClear}
        className={`w-full surface-1 border ${borderClass} rounded-lg p-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left group`}
      >
        <img src={selected.image} alt={selected.name} className="w-10 h-10 rounded-md" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{label}</p>
          <p className="font-semibold text-sm text-foreground truncate">{selected.name}</p>
        </div>
        <X className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="surface-1 border border-border rounded-lg p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-1.5">{label}</p>
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search champion..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1 text-sm"
          />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 surface-2 border border-border rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground text-center">No champions found</p>
          ) : (
            <div className="grid grid-cols-5 gap-0.5 p-1.5">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { onSelect(c); setOpen(false); setQuery(""); }}
                  className="flex flex-col items-center gap-0.5 p-1.5 rounded hover:bg-secondary/50 transition-colors"
                >
                  <img src={c.image} alt={c.name} className="w-8 h-8 rounded" />
                  <span className="text-[10px] text-foreground/70 truncate w-full text-center">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChampionPicker;
