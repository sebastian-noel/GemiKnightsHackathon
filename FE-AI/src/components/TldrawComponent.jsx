import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const TldrawComponent = forwardRef((props, ref) => {
  const editorRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getImageBlob: async () => {
      const editor = editorRef.current
      if (!editor) return null
      // Get SVG element of the current drawing
      const svg = await editor.getSvg()
      if (!svg) return null

      // Convert SVG to PNG Blob using a canvas
      const svgString = new XMLSerializer().serializeToString(svg)
      const svg64 = btoa(unescape(encodeURIComponent(svgString)))
      const image64 = 'data:image/svg+xml;base64,' + svg64

      return await new Promise((resolve) => {
        const img = new window.Image()
        img.onload = function () {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            resolve(blob)
          }, 'image/png')
        }
        img.src = image64
      })
    }
  }), [])

  return (
    <div className='whiteboard'>
      <Tldraw
        onMount={editor => {
          editorRef.current = editor
        }}
      />
    </div>
  )
})

export default TldrawComponent