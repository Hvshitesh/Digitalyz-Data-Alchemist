type DataRow = { [key: string]: any }

interface ValidationError {
  rowIndex: number
  column: string
  message: string
}

export interface ValidationResult {
  errors: ValidationError[]
}

export function validateClients(clients: DataRow[], tasks: DataRow[]): ValidationResult {
  const errors: ValidationError[] = []
  const taskIds = new Set(tasks.map((t) => t.TaskID))

  const clientIdSet = new Set<string>()

  clients.forEach((client, i) => {
    // Missing required ClientID
    if (!client.ClientID || client.ClientID.trim() === '') {
      errors.push({ rowIndex: i, column: 'ClientID', message: 'ClientID is required' })
    } else {
      if (clientIdSet.has(client.ClientID)) {
        errors.push({ rowIndex: i, column: 'ClientID', message: 'Duplicate ClientID' })
      } else {
        clientIdSet.add(client.ClientID)
      }
    }

    // PriorityLevel out of range 1-5
    const priority = Number(client.PriorityLevel)
    if (isNaN(priority) || priority < 1 || priority > 5) {
      errors.push({ rowIndex: i, column: 'PriorityLevel', message: 'PriorityLevel must be 1-5' })
    }

    // RequestedTaskIDs must exist in tasks
    if (client.RequestedTaskIDs) {
      const requestedTasks = client.RequestedTaskIDs.split(',').map((s: string) => s.trim())
      requestedTasks.forEach((taskId: string) => {
        if (!taskIds.has(taskId)) {
          errors.push({ rowIndex: i, column: 'RequestedTaskIDs', message: `Unknown TaskID: ${taskId}` })
        }
      })
    }

    // AttributesJSON must be valid JSON
    if (client.AttributesJSON) {
      try {
        JSON.parse(client.AttributesJSON)
      } catch {
        errors.push({ rowIndex: i, column: 'AttributesJSON', message: 'Invalid JSON' })
      }
    }
  })

  return { errors }
}

export function validateWorkers(workers: DataRow[], tasks: DataRow[]): ValidationResult {
  const errors: ValidationError[] = []
  const workerIdSet = new Set<string>()

  workers.forEach((worker, i) => {
    // Missing required WorkerID
    if (!worker.WorkerID || worker.WorkerID.trim() === '') {
      errors.push({ rowIndex: i, column: 'WorkerID', message: 'WorkerID is required' })
    } else {
      if (workerIdSet.has(worker.WorkerID)) {
        errors.push({ rowIndex: i, column: 'WorkerID', message: 'Duplicate WorkerID' })
      } else {
        workerIdSet.add(worker.WorkerID)
      }
    }

    // AvailableSlots must be numeric list separated by | or comma
    if (worker.AvailableSlots) {
      const slots = worker.AvailableSlots.toString().split(/[\|,]/).map((s: string) => s.trim())
      for (const slot of slots) {
        if (!/^\d+$/.test(slot)) {
          errors.push({ rowIndex: i, column: 'AvailableSlots', message: `Malformed slot: ${slot}` })
        }
      }
    }

    // MaxLoadPerPhase must be a positive integer
    const maxLoad = Number(worker.MaxLoadPerPhase)
    if (isNaN(maxLoad) || maxLoad < 1) {
      errors.push({ rowIndex: i, column: 'MaxLoadPerPhase', message: 'MaxLoadPerPhase must be >= 1' })
    }
  })

  return { errors }
}

export function validateTasks(tasks: DataRow[], workers: DataRow[]): ValidationResult {
  const errors: ValidationError[] = []
  const taskIdSet = new Set<string>()
  const skillSet = new Set<string>()

  // Collect all worker skills
  workers.forEach((worker) => {
    if (worker.Skills) {
      worker.Skills.toString()
      .split(',')
      .map((s: string) => s.trim())
      .forEach((skill: string) => skillSet.add(skill))
    }
  })

  tasks.forEach((task, i) => {
    // Missing required TaskID
    if (!task.TaskID || task.TaskID.trim() === '') {
      errors.push({ rowIndex: i, column: 'TaskID', message: 'TaskID is required' })
    } else {
      if (taskIdSet.has(task.TaskID)) {
        errors.push({ rowIndex: i, column: 'TaskID', message: 'Duplicate TaskID' })
      } else {
        taskIdSet.add(task.TaskID)
      }
    }

    // Duration must be >= 1
    const duration = Number(task.Duration)
    if (isNaN(duration) || duration < 1) {
      errors.push({ rowIndex: i, column: 'Duration', message: 'Duration must be >= 1' })
    }

    // RequiredSkills must be covered by at least one worker
    if (task.RequiredSkills) {
      const requiredSkills = task.RequiredSkills.toString().split(',').map((s: string) => s.trim())
      requiredSkills.forEach((skill: string) => {
        if (!skillSet.has(skill)) {
          errors.push({ rowIndex: i, column: 'RequiredSkills', message: `Skill not covered by any worker: ${skill}` })
        }
      })
    }

    // PreferredPhases must be valid list or range
    if (task.PreferredPhases) {
      const val = task.PreferredPhases.toString().trim()
      if (!/^(\d+(-\d+)?)(,\d+(-\d+)?)*$/.test(val)) {
        errors.push({ rowIndex: i, column: 'PreferredPhases', message: 'Malformed PreferredPhases' })
      }
    }

    // MaxConcurrent must be positive integer
    const maxConc = Number(task.MaxConcurrent)
    if (isNaN(maxConc) || maxConc < 1) {
      errors.push({ rowIndex: i, column: 'MaxConcurrent', message: 'MaxConcurrent must be >= 1' })
    }
  })

  return { errors }
}
