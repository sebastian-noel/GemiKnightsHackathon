import React, { useState, useRef, useEffect } from 'react'
import { DynamicIcon } from 'lucide-react/dynamic';
const options = [
  "Queues",
  "Recurrence Relations",
  "Recursion",
  "Sorting",
  "Stacks",
  "Summations",
  "Tries",
  "Alg Analysis",
  "DMA",
  "Binary Trees"
];
const TEN_MINUTES = 10 * 60; // seconds

const TopNav = () => {
    const [selected, setSelected] = useState(options[0]);
    const [timeLeft, setTimeLeft] = useState(TEN_MINUTES);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    
    useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeLeft === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft]);

    const handlePlayPause = () => {
      setIsRunning(prev => !prev);
    };
  
    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };
  return (
    <div className='TopNav'>
        <select
            className="topic-dropdown"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={{ marginRight: '1rem' }}
        >
            {options.map(option => (
            <option key={option} value={option}>{option}</option>
            ))}
        </select>

        <button className='submit-btn'>Submit</button>
        <div className="timer">
            
            <button onClick={handlePlayPause} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <DynamicIcon name={isRunning ? "pause" : "play"} color="white" size={48} />
            </button>
            <p><p>Time Left: {formatTime(timeLeft)}</p></p>
        </div>
    </div>
  )
}

export default TopNav