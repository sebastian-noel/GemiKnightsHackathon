import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ExcalidrawComponent from './components/TldrawComponent'
import TopNav from './components/TopNav'

function App() {
  return (
    <>
      <TopNav/>
      <div className="container">
        <div className="problem"></div>
        <ExcalidrawComponent/>
      </div>
      
    </>
  )
}

export default App
