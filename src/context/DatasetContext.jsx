import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'

export const DatasetContext = createContext()

export const DatasetProvider = ({ children }) => {
  const [datasetState, setDatasetState] = useState({
    data: {},
    error: null,
    isLoading: true
  })

  const resetDatasetState = () => {
    setDatasetState({
      data: {},
      error: null,
      isLoading: true
    })
  }

  const value = {
    ...datasetState,
    setDatasetState,
    resetDatasetState
  }

  return (
    <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>
  )
}

DatasetProvider.propTypes = {
  children: PropTypes.any
}
