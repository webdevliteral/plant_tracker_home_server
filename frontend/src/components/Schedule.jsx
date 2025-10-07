function Schedule({ schedule, profiles, onAssignTask }) {
  return (
    <div className="schedule-card">
      <h2>Upcoming Plant Care</h2>
      <div>
        {schedule.map((item, i) => (
          <div key={item.key} className="schedule-item">
            <div>
              <p>
                <i className={`fas ${item.icon}`}></i> {item.plant}
              </p>
              <p>{item.action} Time</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p>{item.date.toLocaleDateString()}</p>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9em', color: '#81a684' }}>Assignee:</label>
                <select
                  value={item.profileId ?? 'auto'}
                  onChange={(e) => {
                    const v = e.target.value;
                    onAssignTask(item.key, v === 'auto' ? null : Number(v));
                  }}
                >
                  <option value="auto">Auto (rotate)</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <p style={{ marginTop: 6 }}>
                {item.profileId
                  ? `${profiles.find(p => p.id === item.profileId)?.name || 'Unknown'}'s task`
                  : `Auto: ${item.caretaker}'s turn`}
              </p>
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
