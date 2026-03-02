import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Champion, CHAMPIONS } from "@/data/champions";

interface ChampionSelectorProps {
  label: string;
  side: "ally" | "enemy";
  selected: Champion | null;
  onSelect: (champion: Champion) => void;
  onClear: () => void;
}

const ChampionSelector = ({ label, side, selected, onSelect, onClear }: ChampionSelectorProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return CHAMPIONS;
    return CHAMPIONS.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const borderColor = side === "ally" ? "border-info" : "border-danger";
  const glowClass = side === "ally" ? "shadow-[0_0_15px_hsl(210_80%_55%/0.2)]" : "shadow-[0_0_15px_hsl(0_70%_55%/0.2)]";

  if (selected) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative gradient-card border ${borderColor} ${glowClass} rounded-lg p-4 flex items-center gap-4 cursor-pointer group`}
        onClick={onClear}
      >
        <img
          src={selected.image}
          alt={selected.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body font-semibold">
            {label}
          </p>
          <h3 className="font-display text-2xl text-foreground truncate">{selected.name}</h3>
          <p className="text-sm text-muted-foreground">{selected.role}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="w-5 h-5 text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`gradient-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors`}
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-body font-semibold mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar campeão..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="bg-transparent text-foreground placeholder:text-muted-foreground outline-none flex-1 font-body text-sm"
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 top-full mt-2 left-0 right-0 bg-popover border border-border rounded-lg shadow-card max-h-60 overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground text-center">
                Nenhum campeão encontrado
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-1 p-2">
                {filtered.map((champ) => (
                  <motion.button
                    key={champ.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onSelect(champ);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-secondary transition-colors"
                  >
                    <img
                      src={champ.image}
                      alt={champ.name}
                      className="w-10 h-10 rounded-md"
                    />
                    <span className="text-xs text-foreground truncate w-full text-center font-body">
                      {champ.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChampionSelector;
