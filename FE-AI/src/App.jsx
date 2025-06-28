import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TldrawComponent from './components/TldrawComponent'
import TopNav from './components/TopNav'
import SlidingMenu from './components/SlidingMenu'

function App() {
  return (
    <>
      <SlidingMenu/>
      <TopNav/>
      <div className="container">
        <div className="problem"></div>
        <TldrawComponent/>
      </div>
      
    </>
  )
}

export default App
