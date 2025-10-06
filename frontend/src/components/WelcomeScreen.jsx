import { useState } from 'react'

function WelcomeScreen({ onSetCaretaker }) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim()) {
      onSetCaretaker(name.trim())
    }
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-box">
        <i className="fas fa-seedling"></i>
        <h1>Plant Tracker</h1>
        <p>Welcome! Please enter your name</p>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit} className="button button-primary" style={{ width: '100%' }}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default WelcomeScreen