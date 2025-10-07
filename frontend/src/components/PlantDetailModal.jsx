// src/components/PlantDetailModal.jsx
import { useState } from 'react'

function PlantDetailModal({ plant, onClose, onAddActivity, onDeletePlant, recommendations, profile }) {
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activityType, setActivityType] = useState('water')
  const [note, setNote] = useState('')
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const API_ORIGIN = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

  const handleAddActivity = async () => {
    if (!activityType) return

    let imageUrls = []
    try {
      if (files.length > 0) {
        const form = new FormData()
        files.forEach(f => form.append('photos', f))
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/upload`, {
          method: 'POST',
          body: form
        })
        const { files: uploaded } = await res.json()
        imageUrls = (uploaded || []).map(f => `${API_ORIGIN}${f.url}`)
      }
    } catch (e) {
      console.error('Upload failed:', e)
    }

    onAddActivity(plant.id, {
      type: activityType,
      note,
      caretaker: profile.name,
      images: imageUrls
    })

    // cleanup
    setNote('')
    setFiles([])
    previews.forEach((p) => URL.revokeObjectURL(p))
    setPreviews([])
    setShowActivityForm(false)
  }

  const handleDelete = () => {
    onDeletePlant(plant.id)
  }

  const handleFileChange = (e) => {
    const f = Array.from(e.target.files || [])
    setFiles(f)
    previews.forEach((p) => URL.revokeObjectURL(p))
    setPreviews(f.map(file => URL.createObjectURL(file)))
  }

  const removePreview = (index) => {
    URL.revokeObjectURL(previews[index])
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const activityIcons = {
    water: 'fa-droplet',
    feed: 'fa-leaf',
    prune: 'fa-scissors',
    note: 'fa-note-sticky'
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

            <div className="input-group">
              <label>Photos (optional)</label>
              <label className="camera-upload-button">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <i className="fas fa-camera"></i>
                <span>Take or Upload Photos</span>
              </label>
              
              {previews.length > 0 && (
                <div className="photo-previews">
                  {previews.map((src, i) => (
                    <div key={i} className="photo-preview">
                      <img src={src} alt={`preview-${i}`} />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => removePreview(i)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                <p style={{ fontSize: '0.85em', color: '#81a684' }}>by {activity.caretaker || activity.profile}</p>
                {Array.isArray(activity.images) && activity.images.length > 0 && (
                  <div className="activity-photos">
                    {activity.images.map((u, i) => (
                      <a key={i} href={u} target="_blank" rel="noreferrer" className="activity-photo">
                        <img src={u} alt={`activity-${i}`} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {plant.activities.length === 0 && (
              <p style={{ textAlign: 'center', color: '#81a684', padding: '32px' }}>
                No activities logged yet
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="button button-danger"
          style={{ width: '100%', marginTop: '24px' }}
        >
          <i className="fas fa-trash"></i> Delete Plant
        </button>
      </div>
    </div>
  )
}

export default PlantDetailModal