import PlantCard from './PlantCard'

function PlantGrid({ plants, onSelectPlant, onAddPlant, getRecommendations }) {
  return (
    <div className="plants-grid">
      {plants.map(plant => (
        <PlantCard
          key={plant.id}
          plant={plant}
          onClick={() => onSelectPlant(plant)}
          getRecommendations={getRecommendations}
        />
      ))}

      <div onClick={onAddPlant} className="plant-card add-plant-card">
        <i className="fas fa-plus-circle"></i>
        <span style={{ color: '#ff69b4', fontWeight: 'bold', fontSize: '1.2em' }}>
          Add New Plant Baby 🌟
        </span>
      </div>
    </div>
  )
}

export default PlantGrid
