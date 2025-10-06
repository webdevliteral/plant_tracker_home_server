import { useState } from 'react'

function PlantDetailModal({ plant, onClose, onAddActivity, recommendations, caretaker }) {
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activityType, setActivityType] = useState('water')
  const [note, setNote] = useState('')

  const handleAddActivity = () => {
    if (activityType) {
      onAddActivity(plant.id, {
        type: activityType,
        note: note,
        caretaker: caretaker
      })
      setNote('')
      setShowActivityForm(false)
    }
  }

  const activityIcons = {
    water: 'fa-droplet',
    feed: 'fa-leaf',
    prune: 'fa-scissors',
    note: 'fa-note-sticky'
  }

  const activityColors = {
    water: '#4a90e2',
    feed: '#5a8a5e',
    prune: '#9b59b6',
    note: '#81a684'
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div>
          <div>
            <div>
              <h2>{plant.name}</h2>
              <p>{plant.strain}</p>
              <p style={{ color: '#81a684', fontSize: '0.9em', marginTop: '8px' }}>
                <i className="fas fa-seedling"></i> Stage: {plant.stage}
              </p>
            </div>
            <button onClick={onClose}>×</button>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="recommendation" style={{ marginBottom: '32px' }}>
            <div style={{ fontWeight: '500', marginBottom: '12px', color: '#2d5016' }}>
              <i className="fas fa-lightbulb"></i> Care Recommendations
            </div>
            {recommendations.map((rec, i) => (
              <div key={i} style={{ marginBottom: '8px', fontSize: '0.95em' }}>{rec}</div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowActivityForm(!showActivityForm)}
          className="button button-primary"
          style={{ width: '100%', marginBottom: '24px' }}
        >
          <i className="fas fa-plus"></i> Log Care Activity
        </button>

        {showActivityForm && (
          <div style={{ padding: '24px', border: '1px solid #e8ede9', borderRadius: '8px', marginBottom: '32px', background: '#fafbfa' }}>
            <div className="activity-buttons">
              {Object.entries(activityIcons).map(([type, icon]) => (
                <div
                  key={type}
                  onClick={() => setActivityType(type)}
                  className={`activity-button ${activityType === type ? 'active' : ''}`}
                >
                  <i className={`fas ${icon}`}></i>
                  <span>{type}</span>
                </div>
              ))}
            </div>
            <div className="input-group">
              <label>Notes (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any additional details..."
                rows="3"
              />
            </div>
            <button onClick={handleAddActivity} className="button button-primary" style={{ width: '100%' }}>
              Save Activity
            </button>
          </div>
        )}

        <div className="activity-log">
          <h3>Activity Log</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {plant.activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div>
                  <span>
                    <i className={`fas ${activityIcons[activity.type]}`}></i>
                    {activity.type}
                  </span>
                  <span style={{ fontSize: '0.85em', color: '#81a684' }}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                {activity.note && (
                  <p style={{ marginTop: '8px', marginBottom: '8px' }}>
                    {activity.note}
                  </p>
                )}
                <p style={{ fontSize: '0.85em', color: '#81a684' }}>by {activity.caretaker}</p>
              </div>
            ))}
            {plant.activities.length === 0 && (
              <p style={{ textAlign: 'center', color: '#81a684', padding: '32px' }}>
                No activities logged yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetailModal