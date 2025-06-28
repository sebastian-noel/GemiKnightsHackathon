import React, { useState } from 'react'
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

const TopNav = () => {
    const [selected, setSelected] = useState(options[0]);
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
            
            <DynamicIcon name="play" color="white" size={48} />
            <p>Time Left: </p>
        </div>
    </div>
  )
}

export default TopNav