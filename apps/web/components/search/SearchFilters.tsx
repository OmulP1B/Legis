'use client';

interface SearchFiltersProps {
  params: Record<string, string | number>;
  onUpdate: (key: string, value: string) => void;
  onClear: () => void;
}

const DOC_TYPES = ['Lege','Hotărâre Guvern','Hotărâre Parlament','Decret','Ordin','Regulament','Instrucțiune','Cod','Tratat'];
const STATUSES = [
  { value: 'in_vigoare', label: 'În vigoare' },
  { value: 'abrogat', label: 'Abrogat' },
  { value: 'suspendat', label: 'Suspendat' },
];
const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

export function SearchFilters({ params, onUpdate, onClear }: SearchFiltersProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Filtre avansate
        </h3>
        <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Resetează tot
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Document type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tip document</label>
          <select value={String(params.tip ?? '')} onChange={(e) => onUpdate('tip', e.target.value)} className="select text-sm">
            <option value="">Toate tipurile</option>
            {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
          <select value={String(params.status ?? '')} onChange={(e) => onUpdate('status', e.target.value)} className="select text-sm">
            <option value="">Toate statusurile</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">An emitere</label>
          <select value={String(params.an ?? '')} onChange={(e) => onUpdate('an', e.target.value)} className="select text-sm">
            <option value="">Toți anii</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Numărul actului</label>
          <input
            type="text"
            value={String(params.numar ?? '')}
            onChange={(e) => onUpdate('numar', e.target.value)}
            placeholder="ex: 142/2024"
            className="input text-sm"
          />
        </div>

        {/* Date from */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data emiterii (de la)</label>
          <input
            type="date"
            value={String(params.data_de_la ?? '')}
            onChange={(e) => onUpdate('data_de_la', e.target.value)}
            className="input text-sm"
          />
        </div>

        {/* Date to */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data emiterii (până la)</label>
          <input
            type="date"
            value={String(params.data_pana_la ?? '')}
            onChange={(e) => onUpdate('data_pana_la', e.target.value)}
            className="input text-sm"
          />
        </div>

        {/* MO number */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nr. Monitor Oficial</label>
          <input
            type="text"
            value={String(params.nr_mo ?? '')}
            onChange={(e) => onUpdate('nr_mo', e.target.value)}
            placeholder="ex: 205-210"
            className="input text-sm"
          />
        </div>
      </div>
    </div>
  );
}
