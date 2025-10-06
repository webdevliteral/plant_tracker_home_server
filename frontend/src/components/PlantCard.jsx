function PlantCard({ plant, onClick, getRecommendations }) {
  const lastWater = plant.activities.find(a => a.type === 'water')
  const daysSinceWater = lastWater
    ? Math.floor((Date.now() - new Date(lastWater.timestamp)) / (1000 * 60 * 60 * 24))
    : null

  const recommendations = getRecommendations(plant)

  return (
    <div onClick={onClick} className="plant-card">
      <h3>{plant.name} 🌸</h3>
      <p style={{ color: '#ff69b4', marginBottom: '15px', fontSize: '0.95em' }}>
        {plant.strain || 'Special Baby'}
      </p>
      <div>
        <div className="stat">
          <i className="fas fa-droplet"></i>
          {lastWater ? `Watered ${daysSinceWater}d ago` : 'Not watered yet 💦'}
        </div>
        <div className="stat">
          <i className="fas fa-seedling"></i>
          Stage: {plant.stage || 'Growing'} 🌱
        </div>
      </div>
      {recommendations.length > 0 && (
        <div className="recommendation">
          <i className="fas fa-lightbulb"></i>
          <span style={{ fontSize: '0.9em' }}>{recommendations[0]}</span>
        </div>
      )}
    </div>
  )
}

export default PlantCard