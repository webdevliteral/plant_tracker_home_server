function Navigation({ view, onViewChange }) {
  return (
    <nav className="nav">
      <button
        onClick={() => onViewChange('plants')}
        className={view === 'plants' ? 'active' : ''}
      >
        <i className="fas fa-seedling"></i> My Plant Babies
      </button>
      <button
        onClick={() => onViewChange('schedule')}
        className={view === 'schedule' ? 'active' : ''}
      >
        <i className="fas fa-calendar-heart"></i> Care Schedule
      </button>
    </nav>
  )
}

export default Navigation