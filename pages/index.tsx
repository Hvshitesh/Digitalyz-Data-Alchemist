import Head from 'next/head'
import { useState } from 'react'
import FileUploader from '../components/FileUploader'
import DataGrid from '../components/DataGrid'
import RuleInputPanel from '../components/RuleInputPanel'
import PrioritizationPanel from '../components/PrioritizationPanel'
import NaturalLanguageSearch from '../components/NaturalLanguageSearch'
import ExportPanel from '../components/ExportPanel'
import { validateClients, validateWorkers, validateTasks } from '../utils/validation'

type ValidationErrors = { [rowIndex: number]: { [column: string]: string } }

export default function Home() {
  const [clientsData, setClientsData] = useState<any[]>([])
  const [workersData, setWorkersData] = useState<any[]>([])
  const [tasksData, setTasksData] = useState<any[]>([])

  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([])
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])

  const [clientsErrors, setClientsErrors] = useState<ValidationErrors>({})
  const [workersErrors, setWorkersErrors] = useState<ValidationErrors>({})
  const [tasksErrors, setTasksErrors] = useState<ValidationErrors>({})

  const [rules, setRules] = useState<any[]>([])
  const [weights, setWeights] = useState<{ [key: string]: number }>({
    PriorityLevel: 3,
    RequestedTaskIDs: 3,
    Fairness: 3,
    Cost: 3,
  })

  const mapValidationErrors = (errors: { rowIndex: number; column: string; message: string }[]): ValidationErrors => {
    const mapped: ValidationErrors = {}
    errors.forEach(({ rowIndex, column, message }) => {
      if (!mapped[rowIndex]) mapped[rowIndex] = {}
      mapped[rowIndex][column] = message
    })
    return mapped
  }

  const handleDataLoaded = (entity: string, data: any[]) => {
    if (entity === 'clients') {
      setClientsData(data)
      setFilteredClients(data)
      const validation = validateClients(data, tasksData)
      setClientsErrors(mapValidationErrors(validation.errors))
    } else if (entity === 'workers') {
      setWorkersData(data)
      setFilteredWorkers(data)
      const validation = validateWorkers(data, tasksData)
      setWorkersErrors(mapValidationErrors(validation.errors))
    } else if (entity === 'tasks') {
      setTasksData(data)
      setFilteredTasks(data)
      const validation = validateTasks(data, workersData)
      setTasksErrors(mapValidationErrors(validation.errors))
    }
  }

  const handleClientsChange = (data: any[]) => {
    setClientsData(data)
    setFilteredClients(data)
    const validation = validateClients(data, tasksData)
    setClientsErrors(mapValidationErrors(validation.errors))
  }

  const handleWorkersChange = (data: any[]) => {
    setWorkersData(data)
    setFilteredWorkers(data)
    const validation = validateWorkers(data, tasksData)
    setWorkersErrors(mapValidationErrors(validation.errors))
  }

  const handleTasksChange = (data: any[]) => {
    setTasksData(data)
    setFilteredTasks(data)
    const validation = validateTasks(data, workersData)
    setTasksErrors(mapValidationErrors(validation.errors))
  }

  const handleSearch = (query: string) => {
    // Basic keyword filter implementation as placeholder
    const lowerQuery = query.toLowerCase()
    setFilteredClients(
      clientsData.filter((row) =>
        Object.values(row).some((val) => val && val.toString().toLowerCase().includes(lowerQuery))
      )
    )
    setFilteredWorkers(
      workersData.filter((row) =>
        Object.values(row).some((val) => val && val.toString().toLowerCase().includes(lowerQuery))
      )
    )
    setFilteredTasks(
      tasksData.filter((row) =>
        Object.values(row).some((val) => val && val.toString().toLowerCase().includes(lowerQuery))
      )
    )
  }

  return (
    <>
      <Head>
        <title>Digitalyz Data Alchemist</title>
        <meta name="description" content="AI enabled data cleaning and rule builder" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Welcome to Digitalyz Data Alchemist</h1>
        <p>Upload your CSV or XLSX files for clients, workers, and tasks to get started.</p>

        <NaturalLanguageSearch onSearch={handleSearch} />

        <FileUploader entity="clients" onDataLoaded={handleDataLoaded} />
        <DataGrid data={filteredClients} onDataChange={handleClientsChange} validationErrors={clientsErrors} />

        <FileUploader entity="workers" onDataLoaded={handleDataLoaded} />
        <DataGrid data={filteredWorkers} onDataChange={handleWorkersChange} validationErrors={workersErrors} />

        <FileUploader entity="tasks" onDataLoaded={handleDataLoaded} />
        <DataGrid data={filteredTasks} onDataChange={handleTasksChange} validationErrors={tasksErrors} />

        <RuleInputPanel rules={rules} onRulesChange={setRules} />
        <PrioritizationPanel weights={weights} onWeightsChange={setWeights} />
        <ExportPanel
          clientsData={clientsData}
          workersData={workersData}
          tasksData={tasksData}
          rules={rules}
          weights={weights}
        />
      </main>
    </>
  )
}
