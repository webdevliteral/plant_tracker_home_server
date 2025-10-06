function Header({ caretaker, onExport, onImport }) {
  return (
    <header className="header">
      <div>
        <div>
          <h1>Plant Tracker</h1>
          <p>Hello, {caretaker}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
          <button onClick={onExport} className="icon-button" title="Export Data">
            <i className="fas fa-download"></i>
          </button>
          <label className="icon-button" style={{ cursor: 'pointer', margin: 0 }} title="Import Data">
            <i className="fas fa-upload"></i>
            <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </header>
  )
}

export default Header