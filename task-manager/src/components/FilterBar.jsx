const FILTERS = ['all', 'active', 'completed']

export function FilterBar({ filter, onChange, remaining }) {
  return (
    <div className="filter-bar">
      <span className="remaining">{remaining} remaining</span>
      <div className="filter-buttons">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => onChange(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}
