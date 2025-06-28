import React, { useState } from 'react'

interface Rule {
  id: string
  type: string
  description: string
  data: any
}

interface RuleInputPanelProps {
  rules: Rule[]
  onRulesChange: (rules: Rule[]) => void
}

const RuleInputPanel: React.FC<RuleInputPanelProps> = ({ rules, onRulesChange }) => {
  const [newRuleType, setNewRuleType] = useState<string>('coRun')
  const [newRuleData, setNewRuleData] = useState<string>('')
  const [nlRuleInput, setNlRuleInput] = useState<string>('')

  const addRule = () => {
    if (!newRuleData.trim()) return
    const newRule: Rule = {
      id: Date.now().toString(),
      type: newRuleType,
      description: `${newRuleType} - ${newRuleData}`,
      data: newRuleData,
    }
    onRulesChange([...rules, newRule])
    setNewRuleData('')
  }

  const removeRule = (id: string) => {
    onRulesChange(rules.filter((r) => r.id !== id))
  }

  const convertNlRuleToStructured = (nlText: string): Rule | null => {
    // Stub AI conversion: just create a coRun rule with the text
    if (!nlText.trim()) return null
    return {
      id: Date.now().toString(),
      type: 'coRun',
      description: `AI Converted Rule: ${nlText}`,
      data: nlText,
    }
  }

  const handleAddNlRule = () => {
    const newRule = convertNlRuleToStructured(nlRuleInput)
    if (newRule) {
      onRulesChange([...rules, newRule])
      setNlRuleInput('')
    }
  }

  const generateRuleRecommendations = () => {
    // Stub AI recommendations: add a sample coRun rule
    const sampleRule: Rule = {
      id: Date.now().toString(),
      type: 'coRun',
      description: 'AI Recommendation: Tasks T12 and T14 always run together',
      data: { type: 'coRun', tasks: ['T12', 'T14'] },
    }
    onRulesChange([...rules, sampleRule])
  }

  return (
    <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Business Rules</h2>
      <div>
        <label>
          Rule Type:
          <select value={newRuleType} onChange={(e) => setNewRuleType(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="coRun">Co-run</option>
            <option value="slotRestriction">Slot Restriction</option>
            <option value="loadLimit">Load Limit</option>
            <option value="phaseWindow">Phase Window</option>
            <option value="patternMatch">Pattern Match</option>
            <option value="precedenceOverride">Precedence Override</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <label>
          Rule Data (JSON or plain text):
          <input
            type="text"
            value={newRuleData}
            onChange={(e) => setNewRuleData(e.target.value)}
            style={{ width: '100%', marginTop: '0.25rem' }}
            placeholder="Enter rule details"
          />
        </label>
      </div>
      <button onClick={addRule} style={{ marginTop: '0.5rem' }}>
        Add Rule
      </button>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Natural Language Rule Input:
          <textarea
            value={nlRuleInput}
            onChange={(e) => setNlRuleInput(e.target.value)}
            rows={3}
            style={{ width: '100%', marginTop: '0.25rem' }}
            placeholder="Enter rule in plain English"
          />
        </label>
        <button onClick={handleAddNlRule} style={{ marginTop: '0.5rem' }}>
          Add Rule from Natural Language
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={generateRuleRecommendations}>Generate AI Rule Recommendations</button>
      </div>

      <ul style={{ marginTop: '1rem' }}>
        {rules.map((rule) => (
          <li key={rule.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{rule.type}:</strong> {rule.description}{' '}
            <button onClick={() => removeRule(rule.id)} style={{ marginLeft: '1rem' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RuleInputPanel
