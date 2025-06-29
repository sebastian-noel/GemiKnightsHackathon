import React from 'react'
import ReactPanZoom from 'react-image-pan-zoom-rotate';

const Question = () => {
  return (
    <div className = "ImageContainer">
        <ReactPanZoom alt="Image"
        image="src/assets/FeData/FE-May25-02.jpg"
        className = "QuestionViewer" />
  </div>
  )
}


export default Question