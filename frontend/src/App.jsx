import { useState, useEffect } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import Header from './components/Header'
import Navigation from './components/Navigation'
import PlantGrid from './components/PlantGrid'
import Schedule from './components/Schedule'
import AddPlantModal from './components/AddPlantModal'
import PlantDetailModal from './components/PlantDetailModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [plants, setPlants] = useState([])
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [view, setView] = useState('plants')
  const [showAddPlant, setShowAddPlant] = useState(false)
  const [caretaker, setCaretaker] = useState('')
  const [loading, setLoading] = useState(false)

  // Load data from server
  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  // Load caretaker from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('caretaker')
    if (saved) {
      setCaretaker(saved)
    }
  }, [])

  // Save caretaker to localStorage
  useEffect(() => {
    if (caretaker) {
      localStorage.setItem('caretaker', caretaker)
    }
  }, [caretaker])

  const loadData = async () => {
    try {
      const response = await fetch(`${API_URL}/data`)
      const data = await response.json()
      setPlants(data.plants || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const saveData = async (newPlants) => {
    try {
      await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plants: newPlants, caretakers: [] })
      })
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }

  const addPlant = async (plantData) => {
    const newPlant = {
      id: Date.now(),
      ...plantData,
      activities: [],
      createdAt: new Date().toISOString()
    }
    const newPlants = [...plants, newPlant]
    setPlants(newPlants)
    await saveData(newPlants)
    setShowAddPlant(false)
  }

  const addActivity = async (plantId, activity) => {
    const newPlants = plants.map(p =>
      p.id === plantId
        ? {
            ...p,
            activities: [
              { ...activity, id: Date.now(), timestamp: new Date().toISOString() },
              ...p.activities
            ]
          }
        : p
    )
    setPlants(newPlants)
    await saveData(newPlants)
  }

  const getRecommendations = (plant) => {
    const recommendations = []
    const lastWater = plant.activities.find(a => a.type === 'water')
    const lastFeed = plant.activities.find(a => a.type === 'feed')
    const now = new Date()

    if (lastWater) {
      const daysSince = Math.floor((now - new Date(lastWater.timestamp)) / (1000 * 60 * 60 * 24))
      if (daysSince >= 3) {
        recommendations.push(`🚰 It's been ${daysSince} days since watering! Time for a drink! 💧`)
      }
    } else {
      recommendations.push('🌊 No watering recorded yet! Give me some water! 💦')
    }

    if (lastFeed) {
      const daysSince = Math.floor((now - new Date(lastFeed.timestamp)) / (1000 * 60 * 60 * 24))
      if (daysSince >= 7) {
        recommendations.push(`🍽️ It's been ${daysSince} days since feeding! I'm hungry! 🌱`)
      }
    } else {
      recommendations.push('🍕 No feeding recorded yet! Feed me! 🌿')
    }

    return recommendations
  }

  const exportData = async () => {
    const dataStr = JSON.stringify({ plants, caretaker }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `plant-babies-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const importData = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result)
          setPlants(data.plants || [])
          setCaretaker(data.caretaker || '')
          await saveData(data.plants || [])
        } catch (error) {
          alert('Oops! Error importing data 😢')
        }
      }
      reader.readAsText(file)
    }
  }

  const getSchedule = () => {
    const schedule = []
    const today = new Date()

    plants.forEach(plant => {
      const lastWater = plant.activities.find(a => a.type === 'water')
      if (lastWater) {
        const nextWater = new Date(lastWater.timestamp)
        nextWater.setDate(nextWater.getDate() + 3)
        if (nextWater >= today) {
          schedule.push({
            plant: plant.name,
            action: 'Water',
            icon: 'fa-droplet',
            date: nextWater,
            caretaker: plant.activities.length % 2 === 0 ? 'You' : 'Partner'
          })
        }
      }

      const lastFeed = plant.activities.find(a => a.type === 'feed')
      if (lastFeed) {
        const nextFeed = new Date(lastFeed.timestamp)
        nextFeed.setDate(nextFeed.getDate() + 7)
        if (nextFeed >= today) {
          schedule.push({
            plant: plant.name,
            action: 'Feed',
            icon: 'fa-leaf',
            date: nextFeed,
            caretaker: plant.activities.filter(a => a.type === 'feed').length % 2 === 0 ? 'You' : 'Partner'
          })
        }
      }
    })

    return schedule.sort((a, b) => a.date - b.date)
  }

  if (!caretaker) {
    return <WelcomeScreen onSetCaretaker={setCaretaker} />
  }

  return (
    <div className="container">
      <Header
        caretaker={caretaker}
        onExport={exportData}
        onImport={importData}
      />

      <Navigation view={view} onViewChange={setView} />

      {view === 'plants' && (
        <PlantGrid
          plants={plants}
          onSelectPlant={setSelectedPlant}
          onAddPlant={() => setShowAddPlant(true)}
          getRecommendations={getRecommendations}
        />
      )}

      {view === 'schedule' && <Schedule schedule={getSchedule()} />}

      {showAddPlant && (
        <AddPlantModal
          onAdd={addPlant}
          onClose={() => setShowAddPlant(false)}
        />
      )}

      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onAddActivity={addActivity}
          recommendations={getRecommendations(selectedPlant)}
          caretaker={caretaker}
        />
      )}
    </div>
  )
}

export default App