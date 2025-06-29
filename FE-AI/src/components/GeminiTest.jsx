// This file tests a basic Gemini API call using the API key from the .env file.
// The result will be logged to the console when the app loads.

import { useState } from 'react';
import { fetchImageAsBase64 } from './fetchImageAsBase64';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


const GeminiTest = () => {
  const [studentImage, setStudentImage] = useState(null);
  const [studentPreview, setStudentPreview] = useState(null);
  const [solutionPreview, setSolutionPreview] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendPrompt() {
    if (!studentImage) {
      setResponse('Please upload a student answer image.');
      return;
    }
    setLoading(true);
    setResponse('');
    try {
      // Read both images as base64
      const [studentBase64, solutionBase64] = await Promise.all([
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(studentImage);
        }),
        fetchImageAsBase64('/src/assets/solution.jpg')
      ]);
      const prompt = 'You are an autograder. Compare image #1 (student answer) with image #2 (official solution containing a rubric).\nRespond ONLY with valid JSON:\n\n{\n  "correct": boolean,\n  "pointsPossible": integer,\n  "pointsAwarded": integer,\n  "feedback": string,   // ≤150 chars\n  "fixSteps": [string]\n}';
      const contents = [
        {
          parts: [
            {
              inlineData: {
                mimeType: studentImage.type,
                data: studentBase64,
              },
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: solutionBase64,
              },
            },
            { text: prompt },
          ],
        },
      ];
      const res = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({ contents }),
      });
      const data = await res.json();
      let answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
      // Try to pretty-print JSON if possible
      try {
        answer = JSON.stringify(JSON.parse(answer), null, 2);
      } catch {}
      setResponse(answer);
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
    setLoading(false);
  }

  function handleStudentImageChange(e) {
    const file = e.target.files[0];
    setStudentImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setStudentPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setStudentPreview(null);
    }
  }

  // No need for handleSolutionImageChange, but show preview
  // Load solution preview on mount
  React.useEffect(() => {
    fetch('/src/assets/solution.jpg')
      .then(res => res.blob())
      .then(blob => {
        setSolutionPreview(URL.createObjectURL(blob));
      });
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Autograder (Gemini Vision)</h2>
      <div style={{ marginBottom: 12 }}>
        <label><strong>Student Answer Image:</strong></label><br />
        <input
          type="file"
          accept="image/*"
          onChange={handleStudentImageChange}
          style={{ marginBottom: 8 }}
        />
        {studentPreview && (
          <div style={{ margin: '8px 0' }}>
            <img src={studentPreview} alt="Student Answer Preview" style={{ maxWidth: '100%', maxHeight: 150, border: '1px solid #ccc' }} />
          </div>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label><strong>Solution Image:</strong></label><br />
        {solutionPreview && (
          <div style={{ margin: '8px 0' }}>
            <img src={solutionPreview} alt="Solution Preview" style={{ maxWidth: '100%', maxHeight: 150, border: '1px solid #ccc' }} />
          </div>
        )}
        <div style={{ fontSize: 12, color: '#888' }}>(Loaded from assets/solution.jpg)</div>
      </div>
      <button onClick={sendPrompt} disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Grading...' : 'Grade'}
      </button>
      <div style={{ marginTop: 16, minHeight: 40, textAlign: 'left' }}>
        <strong>Autograder JSON Response:</strong>
        <div style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{response}</div>
      </div>
    </div>
  );
};

export default GeminiTest;
