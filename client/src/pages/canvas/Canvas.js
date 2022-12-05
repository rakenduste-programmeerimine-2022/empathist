import Toolbar from "./Toolbar"
import { useRef, useEffect } from "react"
import { useCanvasStore } from "../../store/canvasStore"

const Canvas = () => {
  const canvasRef = useRef()
  const contextRef = useRef()

  const setContext = useCanvasStore((state) => state.setContext)

  const setCanvas = useCanvasStore((state) => state.setCanvas)

  useEffect(() => {
    /*
    const handleResize = () => {
      let boxWidth = document.getElementById("canvasContainer").offsetWidth
      canvas.width = boxWidth
      canvas.height = boxWidth
    }
    */

    const canvas = canvasRef.current
    canvas.width = 500
    canvas.height = 500
    setCanvas(canvas)
    const ctx = canvas.getContext("2d")
    setContext(ctx)
    useCanvasStore.subscribe((state) => (canvasRef.current = state.canvas))
    useCanvasStore.subscribe((state) => (contextRef.current = state.context))
    /*
    handleResize()
    window.addEventListener("resize", handleResize)
    */
  }, [])

  return (
    <>
      <section className="hero is-halfheight canvas-section">
        <section className="hero-head">
          <Toolbar />
        </section>
        <section className="hero-body canvas-section">
          <div id="canvasContainer">
            <canvas id="canvas" className="canvas" ref={canvasRef}></canvas>
          </div>
        </section>
      </section>
    </>
  )
}

export default Canvas
