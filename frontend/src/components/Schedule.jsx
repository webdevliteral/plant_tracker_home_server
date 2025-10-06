function Schedule({ schedule }) {
  return (
    <div className="schedule-card">
      <h2>Upcoming Plant Care</h2>
      <div>
        {schedule.map((item, i) => (
          <div key={i} className="schedule-item">
            <div>
              <p>
                <i className={`fas ${item.icon}`}></i> {item.plant}
              </p>
              <p>{item.action} Time</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p>{item.date.toLocaleDateString()}</p>
              <p>{item.caretaker}'s turn</p>
            </div>
          </div>
        ))}
        {schedule.length === 0 && (
          <p style={{ textAlign: 'center', color: '#81a684', padding: '40px', fontSize: '1.1em' }}>
            No tasks scheduled yet
          </p>
        )}
      </div>
    </div>
  )
}

export default Schedule