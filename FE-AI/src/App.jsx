import React, { useRef } from 'react'
import './App.css'
import TldrawComponent from './components/TldrawComponent'
import TopNav from './components/TopNav'
import SlidingMenu from './components/SlidingMenu'
import Question from './components/Question'

function App() {
  const tldrawRef = useRef()

  // Handler to be called on submit
  const handleSubmit = async () => {
    if (tldrawRef.current && tldrawRef.current.getImageBlob) {
      const blob = await tldrawRef.current.getImageBlob()
      if (blob) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result
          console.log('Base64 Image:', base64data)
        }
        reader.readAsDataURL(blob)
      }
    }
  }

  return (
    <>
      <SlidingMenu/>
      <TopNav onSubmit={handleSubmit}/>
      <div className="container">
        <div className="problem"><Question/></div>
        <TldrawComponent ref={tldrawRef}/>
      </div>
    </>
  )
}

export default App