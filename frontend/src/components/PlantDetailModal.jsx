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
    feed: '#50c878',
    prune: '#9b59b6',
    note: '#ff69b4'
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ borderBottom: '3px solid #ffd1dc', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2>{plant.name} 🌸</h2>
              <p style={{ color: '#ff69b4', fontSize: '1.1em' }}>{plant.strain}</p>
              <p style={{ color: '#999', fontSize: '0.9em', marginTop: '5px' }}>
                <i className="fas fa-seedling"></i> Stage: {plant.stage}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2em',
                color: '#ff69b4',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="recommendation" style={{ marginBottom: '25px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              <i className="fas fa-sparkles"></i> Plant Care Tips
            </div>
            {recommendations.map((rec, i) => (
              <div key={i} style={{ marginBottom: '5px', fontSize: '0.95em' }}>
                {rec}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowActivityForm(!showActivityForm)}
          className="button button-primary"
          style={{ width: '100%', marginBottom: '20px' }}
        >
          <i className="fas fa-plus"></i> Log Care Activity 💕
        </button>

        {showActivityForm && (
          <div
            style={{
              padding: '20px',
              border: '3px solid #ffd1dc',
              borderRadius: '20px',
              marginBottom: '25px',
              background: '#fff0f5'
            }}
          >
            <div className="activity-buttons">
              {Object.entries(activityIcons).map(([type, icon]) => (
                <div
                  key={type}
                  onClick={() => setActivityType(type)}
                  className={`activity-button ${activityType === type ? 'active' : ''}`}
                >
                  <i
                    className={`fas ${icon}`}
                    style={{ color: activityType === type ? 'white' : activityColors[type] }}
                  ></i>
                  <span style={{ fontSize: '0.9em', textTransform: 'capitalize' }}>{type}</span>
                </div>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add notes (optional) 📝"
              rows="3"
            />
            <button onClick={handleAddActivity} className="button button-primary" style={{ width: '100%', marginTop: '15px' }}>
              Save Activity
            </button>
          </div>
        )}

        <div className="activity-log">
          <h3 style={{ fontWeight: 'bold', color: '#ff1493', marginBottom: '15px' }}>
            Activity Log 📋
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {plant.activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#ff1493', textTransform: 'capitalize' }}>
                    <i className={`fas ${activityIcons[activity.type]}`} style={{ marginRight: '8px' }}></i>
                    {activity.type}
                  </span>
                  <span style={{ fontSize: '0.85em', color: '#999' }}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                {activity.note && (
                  <p style={{ color: '#666', fontSize: '0.95em', marginBottom: '5px' }}>
                    {activity.note}
                  </p>
                )}
                <p style={{ fontSize: '0.85em', color: '#999' }}>by {activity.caretaker}</p>
              </div>
            ))}
            {plant.activities.length === 0 && (
              <p style={{ textAlign: 'center', color: '#ff69b4', padding: '20px' }}>
                No activities logged yet 🌱
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetailModal