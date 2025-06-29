import React, { useState } from 'react'

const aiResult = {
  correct: false,
  pointsPossible: 5,
  pointsAwarded: 4,
  feedback: "Excellent explanations for parts (a) and (b). For part (c), your loop is conceptually correct but has an off-by-one error. C array indexing starts at 0, not 1.",
  fixSteps: [
    "In the for-loop for part (c), change the initialization int c=1 to int c=0.",
    "The loop should iterate from c=0 up to (but not including) cols to copy every element from the original row."
  ]
};

const SlidingMenu = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={`sliding-menu ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      >
        <div className="sliding-menu-content" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setOpen(false)}>Close</button>
          <h2>AI Autograder Result</h2>
          <div style={{ background: '#f6f6f6', borderRadius: 8, padding: 16, margin: '16px 0', boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontWeight: 700, color: aiResult.correct ? '#27ba71' : '#e74c3c', fontSize: 18 }}>
              {aiResult.correct ? '✔ Correct' : '✖ Incorrect'}
            </div>
            <div style={{ margin: '8px 0' }}>
              <strong>Points:</strong> {aiResult.pointsAwarded} / {aiResult.pointsPossible}
            </div>
            <div style={{ margin: '8px 0', color: '#333' }}>
              <strong>Feedback:</strong>
              <div style={{ marginTop: 4, fontStyle: 'italic' }}>{aiResult.feedback}</div>
            </div>
            <div style={{ margin: '8px 0' }}>
              <strong>How to Fix:</strong>
              <ol style={{ margin: '8px 0 0 20px', color: '#444' }}>
                {aiResult.fixSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="sliding-menu-edge" onClick={() => setOpen(true)} />
    </>
  )
}

export default SlidingMenu