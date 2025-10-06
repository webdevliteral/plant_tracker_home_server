function Schedule({ schedule }) {
  return (
    <div className="schedule-card">
      <h2 style={{ color: '#ff1493', marginBottom: '20px', textAlign: 'center' }}>
        Upcoming Plant Care 📅
      </h2>
      <div>
        {schedule.map((item, i) => (
          <div key={i} className="schedule-item">
            <div>
              <p style={{ fontWeight: 'bold', color: '#ff1493', fontSize: '1.1em' }}>
                <i className={`fas ${item.icon}`}></i> {item.plant}
              </p>
              <p style={{ color: '#666', marginTop: '5px' }}>{item.action} Time!</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 'bold', color: '#ff69b4' }}>
                {item.date.toLocaleDateString()}
              </p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>{item.caretaker}'s turn 💕</p>
            </div>
          </div>
        ))}
        {schedule.length === 0 && (
          <p style={{ textAlign: 'center', color: '#ff69b4', padding: '40px', fontSize: '1.2em' }}>
            No tasks scheduled yet! 🎉
          </p>
        )}
      </div>
    </div>
  )
}

export default Schedule