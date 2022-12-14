import Toolbar from "./Toolbar"
import { useRef, useEffect } from "react"
import { useCanvasStore } from "../../store/canvasStore"

const Canvas = () => {
  const canvasRef = useRef()

  const setContext = useCanvasStore((state) => state.setContext)
  const setCanvas = useCanvasStore((state) => state.setCanvas)
  //const resizeCanvasToDisplaySize = useCanvasStore((state) => state.resizeCanvasToDisplaySize)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    setCanvas(canvas)
    //resizeCanvasToDisplaySize()
    setContext(context)
    useCanvasStore.subscribe((state) => (canvasRef.current = state.canvas))

  }, [])

  return (
      <section className="hero is-halfheight" /*onResize={resizeCanvasToDisplaySize}*/>
        <div className="hero-head">
          <Toolbar />
        </div>
        <div className="hero-body canvas-section" >
            <canvas id="canvas" className="canvas" width={2560} height={1440} ref={canvasRef}></canvas>
        </div>
      </section>
  )
}

export default Canvas
