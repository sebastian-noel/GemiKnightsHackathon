
import React, { useState, useRef } from 'react';
import domtoimage from 'dom-to-image-more';
import './App.css';
import TldrawComponent from './components/TldrawComponent';
import TopNav from './components/TopNav';
import SlidingMenu from './components/SlidingMenu';
import Question from './components/Question';


function App() {
  const screenshotRef = useRef(null);
  const tldrawRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState('FE-Aug22-02.jpg');
  const [isLoading, setIsLoading] = useState(false);

  // Helper to get solution file name
  function getSolutionFileName(questionFile) {
    // e.g. FE-Aug22-02.jpg => FE-Aug22-Sol-02.jpg
    return questionFile.replace(/(FE-[A-Za-z]+\d{2}-)(\d{2})/, '$1Sol-$2');
  }

  const handleSubmitScreenshot = async () => {
    setIsLoading(true);
    try {
      // 1. Export student answer from tldraw as PNG
      let studentBase64 = null;
      if (tldrawRef.current && tldrawRef.current.exportImage) {
        const blob = await tldrawRef.current.exportImage();
        if (!blob) throw new Error('No shapes on the canvas or export failed.');
        studentBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        throw new Error('Tldraw export not available.');
      }

      // 2. Fetch solution image as base64
      const solutionFile = getSolutionFileName(currentQuestion);
      const solutionUrl = `/src/assets/Solutions/${solutionFile}`;
      const solutionRes = await fetch(solutionUrl);
      const solutionBlob = await solutionRes.blob();
      const solutionBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(solutionBlob);
      });

      // 3. Prepare Gemini API call
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const prompt = `You are an autograder. Compare (student answer) image\nwith the (official solution containing a rubric) image.\nRespond ONLY with valid JSON:\n\n{\n\"correct\": boolean,\n\"pointsPossible\": integer,\n\"pointsAwarded\": integer,\n\"feedback\": string,   // ≤150 chars\n\"fixSteps\": [string], "extractedText\" : [string]\n}`;

      const body = {
        contents: [
          {
            parts: [
              { inlineData: { mimeType: 'image/png', data: studentBase64 } },
              { inlineData: { mimeType: 'image/jpeg', data: solutionBase64 } },
              { text: prompt },
            ],
          },
        ],
      };

      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      let answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
      try {
        answer = JSON.stringify(JSON.parse(answer), null, 2);
      } catch {}
      console.log('Gemini autograder JSON:', answer);
    } catch (err) {
      console.warn('Screenshot or Gemini call failed:', err);
    }
    setIsLoading(false);
  };

  return (
    <>
      <SlidingMenu />
      <TopNav onSubmitScreenshot={handleSubmitScreenshot} />
      <div className="container" ref={screenshotRef}>
        <div className="problem"><Question currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} /></div>
        <TldrawComponent ref={tldrawRef} />
      </div>
      {isLoading && <div style={{color:'blue',margin:'1rem'}}>Grading in progress...</div>}
    </>
  );
}

export default App
