import { useState } from 'react'

function AddPlantModal({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    strain: '',
    stage: 'seedling'
  })

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onAdd(formData)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Plant Baby 🌱✨</h2>
        <div>
          <div className="input-group">
            <label>
              <i className="fas fa-tag"></i> Plant Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Rosie the Rose 🌹"
            />
          </div>
          <div className="input-group">
            <label>
              <i className="fas fa-dna"></i> Strain (optional)
            </label>
            <input
              type="text"
              value={formData.strain}
              onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
              placeholder="e.g., Blue Dream 💙"
            />
          </div>
          <div className="input-group">
            <label>
              <i className="fas fa-seedling"></i> Growth Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            >
              <option value="seedling">🌱 Baby Seedling</option>
              <option value="vegetative">🌿 Growing Strong</option>
              <option value="flowering">🌸 Flowering Beauty</option>
              <option value="harvest">🎉 Ready to Harvest</option>
            </select>
          </div>
        </div>
        <div className="button-group">
          <button onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="button button-primary">
            <i className="fas fa-heart"></i> Add Plant Baby!
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPlantModal
