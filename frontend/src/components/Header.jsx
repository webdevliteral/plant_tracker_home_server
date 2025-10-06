function Header({ caretaker, onExport, onImport }) {
  return (
    <header className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🌱 Plant Babies Tracker 🌿</h1>
          <p>Hello, {caretaker}! 💕</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onExport} className="icon-button" title="Export Data">
            <i className="fas fa-download"></i>
          </button>
          <label className="icon-button" style={{ cursor: 'pointer' }} title="Import Data">
            <i className="fas fa-upload"></i>
            <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </header>
  )
}

export default Header