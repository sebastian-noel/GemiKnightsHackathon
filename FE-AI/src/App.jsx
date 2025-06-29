import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TldrawComponent from './components/TldrawComponent'
import TopNav from './components/TopNav'
import SlidingMenu from './components/SlidingMenu'
import Question from './components/Question'

import { useRef } from 'react';
import domtoimage from 'dom-to-image-more';

function App() {
  const screenshotRef = useRef(null);

  const handleSubmitScreenshot = async () => {
    if (!screenshotRef.current) {
      console.warn('No node to screenshot.');
      return;
    }
    try {
      const dataUrl = await domtoimage.toJpeg(screenshotRef.current, { quality: 1.0 });
      console.log('Screenshot captured and saved as base64:', dataUrl);
    } catch (err) {
      console.warn('Screenshot failed:', err);
    }
  };

  return (
    <>
      <SlidingMenu />
      <TopNav onSubmitScreenshot={handleSubmitScreenshot} />
      <div className="container" ref={screenshotRef}>
        <div className="problem"><Question /></div>
        <TldrawComponent />
      </div>
    </>
  );
}

export default App
