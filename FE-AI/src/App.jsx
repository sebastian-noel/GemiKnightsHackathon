import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ExcalidrawComponent from './components/ExcalidrawComponent'
import TopNav from './components/TopNav'

function App() {
  return (
    <>
      <TopNav/>
      <ExcalidrawComponent/>
    </>
  )
}

export default App
