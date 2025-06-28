import React, { useState, useEffect } from 'react'

type DataRow = { [key: string]: any }
type ValidationErrors = { [rowIndex: number]: { [column: string]: string } }

interface DataGridProps {
  data: DataRow[]
  onDataChange: (data: DataRow[]) => void
  validationErrors?: ValidationErrors
}

const DataGrid: React.FC<DataGridProps> = ({ data, onDataChange, validationErrors = {} }) => {
  const [gridData, setGridData] = useState<DataRow[]>([])

  useEffect(() => {
    setGridData(data)
  }, [data])

  const handleCellChange = (rowIndex: number, column: string, value: any) => {
    const newData = [...gridData]
    newData[rowIndex] = { ...newData[rowIndex], [column]: value }
    setGridData(newData)
    onDataChange(newData)
  }

  if (gridData.length === 0) {
    return <p>No data to display</p>
  }

  const columns = Object.keys(gridData[0])

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1rem' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              style={{
                border: '1px solid #ccc',
                padding: '0.5rem',
                backgroundColor: '#f9f9f9',
                textAlign: 'left',
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {gridData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => {
              const error = validationErrors[rowIndex]?.[col]
              return (
                <td key={col} style={{ border: '1px solid #ccc', padding: '0.25rem' }}>
                  <input
                    type="text"
                    value={row[col] ?? ''}
                    onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                    style={{
                      width: '100%',
                      border: error ? '2px solid red' : '1px solid #ccc',
                      backgroundColor: error ? '#ffe6e6' : 'white',
                      padding: '0.25rem',
                    }}
                    title={error || ''}
                  />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataGrid
