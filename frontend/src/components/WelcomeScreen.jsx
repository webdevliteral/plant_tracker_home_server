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
        <h1 style={{ color: '#ff1493', fontSize: '2.5em', marginBottom: '10px' }}>
          Plant Babies Tracker 🌱
        </h1>
        <p style={{ color: '#ff69b4', marginBottom: '30px', fontSize: '1.2em' }}>
          Welcome! What's your name? 💖
        </p>
        <input
          type="text"
          placeholder="Enter your name ✨"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1em',
            borderRadius: '15px',
            border: '3px solid #ffd1dc',
            marginBottom: '20px',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={handleSubmit}
          className="button button-primary"
          style={{ width: '100%' }}
        >
          Let's Go! 🌟
        </button>
      </div>
    </div>
  )
}

export default WelcomeScreen