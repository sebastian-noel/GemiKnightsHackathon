
import React, { forwardRef, useImperativeHandle } from 'react';
import { Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';

const TldrawComponent = forwardRef((props, ref) => {
  const editor = useEditor();

  useImperativeHandle(ref, () => ({
    exportImage: async () => {
      if (!editor) return null;
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) return null;
      const { blob } = await editor.toImage([...shapeIds], { format: 'png', background: false });
      return blob;
    }
  }), [editor]);

  return (
    <div className='whiteboard'>
      <Tldraw components={{}} />
    </div>
  );
});

export default TldrawComponent;