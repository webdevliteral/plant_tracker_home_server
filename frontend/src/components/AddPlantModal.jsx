// AddPlantModal.jsx
import { useState } from 'react'

function AddPlantModal({ onAdd, onClose, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    strain: '',
    stage: 'seedling',
    categoryId: categories.length > 0 ? categories[0].id : null
  })

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onAdd(formData)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Plant</h2>
        <div>
          <div className="input-group">
            <label><i className="fas fa-tag"></i> Plant Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Northern Lights #1"
            />
          </div>

          <div className="input-group">
            <label><i className="fas fa-layer-group"></i> Category</label>
            <select
              value={formData.categoryId ?? ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: e.target.value ? parseInt(e.target.value, 10) : null
                })
              }
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label><i className="fas fa-dna"></i> Strain/Variety (optional)</label>
            <input
              type="text"
              value={formData.strain}
              onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
              placeholder="e.g., Blue Dream, Roma Tomato"
            />
          </div>

          <div className="input-group">
            <label><i className="fas fa-seedling"></i> Growth Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            >
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="harvest">Ready to Harvest</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button onClick={onClose} className="button button-secondary">Cancel</button>
          <button onClick={handleSubmit} className="button button-primary">
            <i className="fas fa-plus"></i> Add Plant
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPlantModal
