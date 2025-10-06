function Navigation({ view, onViewChange }) {
  return (
    <nav className="nav">
      <button
        onClick={() => onViewChange('plants')}
        className={view === 'plants' ? 'active' : ''}
      >
        <i className="fas fa-leaf"></i> My Plants
      </button>
      <button
        onClick={() => onViewChange('schedule')}
        className={view === 'schedule' ? 'active' : ''}
      >
        <i className="fas fa-calendar-alt"></i> Care Schedule
      </button>
    </nav>
  )
}

export default Navigation