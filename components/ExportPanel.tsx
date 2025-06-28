import React from 'react'
import { utils, writeFile } from 'xlsx'

interface ExportPanelProps {
  clientsData: any[]
  workersData: any[]
  tasksData: any[]
  rules: any[]
  weights: { [key: string]: number }
}

const ExportPanel: React.FC<ExportPanelProps> = ({ clientsData, workersData, tasksData, rules, weights }) => {
  const exportCSV = (data: any[], filename: string) => {
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Sheet1')
    writeFile(wb, filename)
  }

  const exportRulesJSON = () => {
    const rulesConfig = {
      rules,
      prioritization: weights,
    }
    const blob = new Blob([JSON.stringify(rulesConfig, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rules.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Export Cleaned Data & Rules</h2>
      <button onClick={() => exportCSV(clientsData, 'clients_cleaned.csv')} style={{ marginRight: '1rem' }}>
        Export Clients CSV
      </button>
      <button onClick={() => exportCSV(workersData, 'workers_cleaned.csv')} style={{ marginRight: '1rem' }}>
        Export Workers CSV
      </button>
      <button onClick={() => exportCSV(tasksData, 'tasks_cleaned.csv')} style={{ marginRight: '1rem' }}>
        Export Tasks CSV
      </button>
      <button onClick={exportRulesJSON}>Export Rules JSON</button>
    </div>
  )
}

export default ExportPanel
