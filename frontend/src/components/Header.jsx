function Header({ caretaker, onExport, onImport }) {
  return (
    <header className="header">
      <div>
        <div>
          <h1>Plant Tracker</h1>
          <p>Hello, {caretaker}</p>
        </div>
        <div>
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