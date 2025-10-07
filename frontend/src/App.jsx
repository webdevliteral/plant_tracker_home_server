// src/App.jsx - Fresh Complete File
import { useState, useEffect } from 'react'
import './App.css'
import ProfileSelector from './components/ProfileSelector'
import Header from './components/Header'
import Navigation from './components/Navigation'
import PlantGrid from './components/PlantGrid'
import Schedule from './components/Schedule'
import AddPlantModal from './components/AddPlantModal'
import PlantDetailModal from './components/PlantDetailModal'
import CategoriesManager from './components/CategoriesManager'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [plants, setPlants] = useState([])
  const [profiles, setProfiles] = useState([])
  const [categories, setCategories] = useState()
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [view, setView] = useState('plants')
  const [showAddPlant, setShowAddPlant] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [taskAssignments, setTaskAssignments] = useState({});
  

  // Load data from server
  useEffect(() => {
    (async () => {
      // Load everything
      const dataRes = await fetch(`${API_URL}/data`);
      const data = await dataRes.json();
      setPlants(data.plants ?? []);
      setProfiles(data.profiles ?? []);
      setCategories(data.categories ?? []);

      const taRes = await fetch(`${API_URL}/task-assignments`);
      const ta = await taRes.json();
      setTaskAssignments(ta || {});
    })();
  }, []);

  // Load current profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('currentProfile')
    if (saved) {
      setCurrentProfile(JSON.parse(saved))
    }
  }, [])

  // Save current profile to localStorage
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile))
    }
  }, [currentProfile])

  const saveData = async (newPlants, newProfiles) => {
    try {
      await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plants: newPlants, profiles: newProfiles || profiles })
      })
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }

  const addProfile = async (profileData) => {
    const newProfile = {
      id: Date.now(),
      ...profileData,
      createdAt: new Date().toISOString()
    }
    const newProfiles = [...profiles, newProfile]
    setProfiles(newProfiles)
    await saveData(plants, newProfiles)
    // Auto-select the newly created profile
    setCurrentProfile(newProfile)
    return newProfile
  }

  const selectProfile = (profile) => {
    setCurrentProfile(profile)
  }

  const switchProfile = () => {
    setCurrentProfile(null)
    localStorage.removeItem('currentProfile')
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
    await saveData(newPlants, profiles)
    setShowAddPlant(false)
  }

  const deletePlant = async (plantId) => {
    const confirmed = window.confirm('Are you sure you want to delete this plant? This cannot be undone.')
    if (confirmed) {
      const newPlants = plants.filter(p => p.id !== plantId)
      setPlants(newPlants)
      await saveData(newPlants, profiles)
      setSelectedPlant(null)
    }
  }

  const addActivity = async (plantId, activity) => {
    const newPlants = plants.map(p =>
      p.id === plantId
        ? {
            ...p,
            activities: [
              { 
                ...activity, 
                id: Date.now(), 
                timestamp: new Date().toISOString(), 
                profile: currentProfile.name 
              },
              ...p.activities
            ]
          }
        : p
    )
    setPlants(newPlants)
    await saveData(newPlants, profiles)
  }

  const getRecommendations = (plant) => {
    const recommendations = []
    const lastWater = plant.activities.find(a => a.type === 'water')
    const lastFeed = plant.activities.find(a => a.type === 'feed')
    const now = new Date()

    if (lastWater) {
      const daysSince = Math.floor((now - new Date(lastWater.timestamp)) / (1000 * 60 * 60 * 24))
      if (daysSince >= 3) {
        recommendations.push(`It's been ${daysSince} days since watering. Time to water!`)
      }
    } else {
      recommendations.push('No watering recorded yet. Give this plant some water!')
    }

    if (lastFeed) {
      const daysSince = Math.floor((now - new Date(lastFeed.timestamp)) / (1000 * 60 * 60 * 24))
      if (daysSince >= 7) {
        recommendations.push(`It's been ${daysSince} days since feeding. Consider adding nutrients.`)
      }
    } else {
      recommendations.push('No feeding recorded yet.')
    }

    return recommendations
  }

  const exportData = async () => {
    const dataStr = JSON.stringify({ plants, profiles }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `plant-tracker-${new Date().toISOString().split('T')[0]}.json`
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
          setProfiles(data.profiles || [])
          await saveData(data.plants || [], data.profiles || [])
        } catch (error) {
          alert('Error importing data')
        }
      }
      reader.readAsText(file)
    }
  }

  const getSchedule = () => {
    const today = new Date();
    const horizonDays = 14; // show 2 weeks out
    const horizon = new Date(today); horizon.setDate(horizon.getDate() + horizonDays);

    const byId = Object.fromEntries(categories.map(c => [c.id, c]));
    const result = [];

    plants.forEach(plant => {
      const cat = byId[plant.categoryId] || { wateringDays: 3, feedingDays: 7 };
      const lastWater = plant.activities.slice().reverse().find(a => a.type === 'water');
      const lastFeed  = plant.activities.slice().reverse().find(a => a.type === 'feed');

      // Compute next due dates from last activities; if none, make it due today.
      const nextWater = new Date(lastWater?.timestamp || today);
      if (lastWater) nextWater.setDate(new Date(lastWater.timestamp).getDate() + (cat.wateringDays || 3));
      const nextFeed  = new Date(lastFeed?.timestamp || today);
      if (lastFeed) nextFeed.setDate(new Date(lastFeed.timestamp).getDate() + (cat.feedingDays || 7));

      const pushIfInRange = (action, due) => {
        if (due <= horizon) {
          const dateKey = formatISODateOnly(due);
          const key = `${plant.id}:${action}:${dateKey}`;

          // explicit assignment, else deterministic round-robin
          const assignedProfileId = taskAssignments[key]
            ? taskAssignments[key]
            : (pickRoundRobinProfile(key, profiles)?.id ?? null);

          const assignedProfile = profiles.find(p => p.id === assignedProfileId) || null;

          result.push({
            key,
            plantId: plant.id,
            plant: plant.name,
            action: action === 'water' ? 'Water' : 'Feed',
            icon: action === 'water' ? 'fa-droplet' : 'fa-bottle-water',
            date: due,
            profileId: assignedProfile?.id ?? null,
            caretaker: assignedProfile?.name ?? (assignedProfileId ? 'Unknown' : 'Unassigned'),
          });
        }
      };

      pushIfInRange('water', nextWater);
      pushIfInRange('feed', nextFeed);
    });

    // Sort by due date ascending
    return result.sort((a, b) => a.date - b.date);
  };


  async function handleSaveCategories(nextCategories) {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextCategories),
    });
    const saved = await res.json();
    setCategories(saved);
    setShowCategories(false);
  }

  async function handleAssignTask(taskKey, profileId) {
    const next = { ...taskAssignments, [taskKey]: profileId || undefined };
    setTaskAssignments(next);
    // Persist (sends only changed entries; backend merges)
    await fetch(`${API_URL}/task-assignments`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [taskKey]: profileId || undefined })
    });
  }

  function pickRoundRobinProfile(key, profs) {
    if (!Array.isArray(profs) || profs.length === 0) return null;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return profs[hash % profs.length];
  }

  function formatISODateOnly(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  if (!currentProfile) {
    return <ProfileSelector profiles={profiles} onSelectProfile={selectProfile} onAddProfile={addProfile} />
  }

  return (
    <div className="container">
      <Header
        profile={currentProfile}
        onSwitchProfile={switchProfile}
        onExport={exportData}
        onImport={importData}
        onManageCategories={() => setShowCategories(true)}
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

      {view === 'schedule' && (
        <Schedule
          schedule={getSchedule()}
          profiles={profiles}
          onAssignTask={handleAssignTask}
        />
      )}

      {showAddPlant && (
        <AddPlantModal
          onAdd={addPlant}
          onClose={() => setShowAddPlant(false)}
          categories={categories}   // ← add this line
        />
      )}

      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onAddActivity={addActivity}
          onDeletePlant={deletePlant}
          recommendations={getRecommendations(selectedPlant)}
          profile={currentProfile}
        />
      )}

      {showCategories && (
        <CategoriesManager
          categories={categories}
          onSave={handleSaveCategories}        // see below
          onClose={() => setShowCategories(false)}
        />
      )}
    </div>
  )
}

export default App