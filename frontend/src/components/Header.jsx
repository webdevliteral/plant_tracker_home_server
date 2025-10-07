function Header({ profile, onSwitchProfile, onExport, onImport, onManageCategories }) {
  return (
    <header className="header">
      <div>
        <div>
          <h1>Plant Tracker</h1>
          <p>Hello, {profile.name}</p>
        </div>
        <div>
          <button onClick={onManageCategories} className="icon-button" title="Manage Categories">
            <i className="fas fa-layer-group"></i>
          </button>
          <button onClick={onSwitchProfile} className="icon-button" title="Switch Profile">
            <i className="fas fa-user-circle"></i>
          </button>
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