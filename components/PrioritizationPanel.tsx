import React, { useState } from 'react'

interface PrioritizationPanelProps {
  weights: { [key: string]: number }
  onWeightsChange: (weights: { [key: string]: number }) => void
}

const presetProfiles = {
  'Maximize Fulfillment': { PriorityLevel: 5, RequestedTaskIDs: 4, Fairness: 3, Cost: 1 },
  'Fair Distribution': { PriorityLevel: 3, RequestedTaskIDs: 3, Fairness: 5, Cost: 2 },
  'Minimize Workload': { PriorityLevel: 1, RequestedTaskIDs: 2, Fairness: 3, Cost: 5 },
}

type PresetProfileKey = keyof typeof presetProfiles

const PrioritizationPanel: React.FC<PrioritizationPanelProps> = ({ weights, onWeightsChange }) => {
  const [selectedProfile, setSelectedProfile] = useState<PresetProfileKey | ''>('')

  const handleSliderChange = (key: string, value: number) => {
    onWeightsChange({ ...weights, [key]: value })
    setSelectedProfile('')
  }

  const applyPreset = (profile: PresetProfileKey) => {
    const preset = presetProfiles[profile]
    if (preset) {
      onWeightsChange(preset)
      setSelectedProfile(profile)
    }
  }

  return (
    <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Prioritization & Weights</h2>
      <div>
        <label>
          Preset Profiles:
          <select
            value={selectedProfile}
            onChange={(e) => applyPreset(e.target.value as PresetProfileKey)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="">Select a profile</option>
            {Object.keys(presetProfiles).map((profile) => (
              <option key={profile} value={profile}>
                {profile}
              </option>
            ))}
          </select>
        </label>
      </div>
      {Object.keys(weights).map((key) => (
        <div key={key} style={{ marginTop: '0.5rem' }}>
          <label>
            {key}:
            <input
              type="range"
              min={1}
              max={5}
              value={weights[key]}
              onChange={(e) => handleSliderChange(key, Number(e.target.value))}
              style={{ marginLeft: '0.5rem' }}
            />
            <span style={{ marginLeft: '0.5rem' }}>{weights[key]}</span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default PrioritizationPanel
