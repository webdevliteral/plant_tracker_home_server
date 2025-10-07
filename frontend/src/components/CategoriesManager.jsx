import { useState } from 'react'

function CategoriesManager({ categories, onSave, onClose }) {
  const [localCategories, setLocalCategories] = useState([...categories])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now(),
        name: newCategoryName.trim(),
        wateringDays: 3,
        feedingDays: 7,
        color: '#5a8a5e'
      }
      setLocalCategories([...localCategories, newCategory])
      setNewCategoryName('')
      setShowAddCategory(false)
    }
  }

  const updateCategory = (id, field, value) => {
    setLocalCategories(localCategories.map(cat =>
      cat.id === id ? { ...cat, [field]: value } : cat
    ))
  }

  const deleteCategory = (id) => {
    if (window.confirm('Delete this category? Plants using it will remain but lose their category.')) {
      setLocalCategories(localCategories.filter(cat => cat.id !== id))
    }
  }

  const handleSave = () => {
    onSave(localCategories)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2>Plant Categories & Care Schedules</h2>
          <p style={{ color: '#81a684', fontSize: '0.95em', marginTop: '8px' }}>
            Customize care schedules for different types of plants
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          {localCategories.map(category => (
            <div key={category.id} className="category-card">
              <div style={{ flex: 1 }}>
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label><i className="fas fa-droplet"></i> Water every (days)</label>
                    <input
                      type="number"
                      min="1"
                      value={category.wateringDays}
                      onChange={(e) => updateCategory(category.id, 'wateringDays', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <label><i className="fas fa-leaf"></i> Feed every (days)</label>
                    <input
                      type="number"
                      min="1"
                      value={category.feedingDays}
                      onChange={(e) => updateCategory(category.id, 'feedingDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              {/* <button
                onClick={() => deleteCategory(category.id)}
                className="icon-button"
                style={{ color: '#c62828' }}
                title="Delete Category"
              >
                <i className="fas fa-trash"></i>
              </button> */}
            </div>
          ))}
        </div>

        {showAddCategory ? (
          <div style={{ padding: '20px', background: '#fafbfa', borderRadius: '8px', marginBottom: '24px' }}>
            <div className="input-group">
              <label>New Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                placeholder="e.g., Succulents, Herbs, Tropicals..."
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => {setShowAddCategory(false); setNewCategoryName('')}} className="button button-secondary">
                Cancel
              </button>
              <button onClick={addCategory} className="button button-primary">
                <i className="fas fa-plus"></i> Add Category
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategory(true)}
            className="button button-secondary"
            style={{ width: '100%', marginBottom: '24px' }}
          >
            <i className="fas fa-plus"></i> Add New Category
          </button>
        )}

        <div className="button-group">
          <button onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="button button-primary">
            <i className="fas fa-check"></i> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoriesManager