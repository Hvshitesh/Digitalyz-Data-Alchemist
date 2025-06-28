import React, { useState } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

type DataRow = { [key: string]: any }

interface FileUploaderProps {
  entity: string
  onDataLoaded: (entity: string, data: DataRow[]) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ entity, onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    const fileName = file.name.toLowerCase()
    

    reader.onload = (evt: ProgressEvent<FileReader>) => {
      const data = evt.target?.result
      if (!data) {
        setError('Failed to read file')
        return
      }

      if (fileName.endsWith('.csv')) {
        const text = data as string
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<DataRow>) => {
            onDataLoaded(entity, results.data)
          },
          error: (err: Papa.ParseError) => {
            setError('CSV parse error: ' + err.message)
          },
        })
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
        onDataLoaded(entity, jsonData as DataRow[])
      } else {
        setError('Unsupported file type')
      }
    }

    if (fileName.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsBinaryString(file)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        Upload {entity} file (CSV or XLSX):
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFile}
        />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default FileUploader
