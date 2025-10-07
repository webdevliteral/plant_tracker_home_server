import { useState } from 'react'

const PROFILE_COLORS = [
  '#5a8a5e', '#81a684', '#43a047', '#66bb6a', '#2e7d32',
  '#558b2f', '#7cb342', '#8bc34a', '#689f38', '#33691e'
]

function ProfileSelector({ profiles, onSelectProfile, onAddProfile }) {
  const [showAddProfile, setShowAddProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      const color = PROFILE_COLORS[profiles.length % PROFILE_COLORS.length]
      onAddProfile({ name: newProfileName.trim(), color })
      setNewProfileName('')
      setShowAddProfile(false)
    }
  }

  return (
    <div className="profile-selector-screen">
      <div className="profile-selector-container">
        <h1>Who's tending the garden?</h1>
        <div className="profiles-grid">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="profile-card"
              onClick={() => onSelectProfile(profile)}
            >
              <div className="profile-avatar" style={{ backgroundColor: profile.color }}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <span className="profile-name">{profile.name}</span>
            </div>
          ))}
          
          <div className="profile-card add-profile-card" onClick={() => setShowAddProfile(true)}>
            <div className="profile-avatar add-avatar">
              <i className="fas fa-plus"></i>
            </div>
            <span className="profile-name">Add Profile</span>
          </div>
        </div>
      </div>

      {showAddProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Profile</h2>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProfile()}
                placeholder="Enter your name"
                autoFocus
              />
            </div>
            <div className="button-group">
              <button onClick={() => {setShowAddProfile(false); setNewProfileName('')}} className="button button-secondary">
                Cancel
              </button>
              <button onClick={handleAddProfile} className="button button-primary">
                <i className="fas fa-check"></i> Create Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileSelector