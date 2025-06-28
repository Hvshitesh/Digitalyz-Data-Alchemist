import React, { useState } from 'react'

interface NaturalLanguageSearchProps {
  onSearch: (query: string) => void
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    onSearch(query)
  }

  return (
    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
      <label>
        Natural Language Search:
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query in plain English"
          style={{ marginLeft: '0.5rem', width: '60%' }}
        />
      </label>
      <button onClick={handleSearch} style={{ marginLeft: '0.5rem' }}>
        Search
      </button>
    </div>
  )
}

export default NaturalLanguageSearch
