import React, { useState } from 'react'

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
          <h2>Sliding Menu</h2>
          <p>
            This is some dummy text inside the sliding menu. You can put any content here.
          </p>
        </div>
      </div>
      <div className="sliding-menu-edge" onClick={() => setOpen(true)} />
    </>
  )
}

export default SlidingMenu