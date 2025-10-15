function Header({ profile, onSwitchProfile, onExport, onImport, onManageCategories, onScanBarcode, onPrintBarcodes }) {
  return (
    <header className="header">
      <div>
        <div>
          <h1>Plant Tracker</h1>
          <p>Hello, {profile.name}</p>
        </div>
        <div>
          <button onClick={onScanBarcode} className="icon-button" title="Scan Barcode">
            <i className="fas fa-qrcode"></i>
          </button>
          <button onClick={onPrintBarcodes} className="icon-button" title="Print Barcodes">
            <i className="fas fa-print"></i>
          </button>
          <button onClick={onManageCategories} className="icon-button" title="Manage Categories">
            <i className="fas fa-layer-group"></i>
          </button>
          <button onClick={onSwitchProfile} className="icon-button" title="Switch Profile">
            <i className="fas fa-user-circle"></i>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header