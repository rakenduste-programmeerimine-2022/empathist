import Toolbar from "./Toolbar"
import { useRef, useEffect } from "react"
import { useCanvasStore } from "../../store/canvasStore"

const Canvas = () => {
  const canvasRef = useRef()
  const contextRef = useRef()

  const setContext = useCanvasStore((state) => state.setContext)

  const setCanvas = useCanvasStore((state) => state.setCanvas)

  useEffect(() => {
    const handleResize = () => {
      let boxWidth = document.getElementById("canvasContainer").offsetWidth
      canvas.width = boxWidth
      canvas.height = boxWidth
    }
    const canvas = canvasRef.current
    setCanvas(canvas)
    const ctx = canvas.getContext("2d")
    setContext(ctx)
    useCanvasStore.subscribe((state) => (canvasRef.current = state.canvas))
    useCanvasStore.subscribe((state) => (contextRef.current = state.context))
    handleResize()
    window.addEventListener("resize", handleResize)
  }, [])

  //setTool(new Brush(lineCap, strokeStyle, lineWidth))

  return (
    <>
      <section className="hero-head">
        <Toolbar />
      </section>
      <section className="hero-body canvasSection p-0 m-0">
        <div id="canvasContainer">
          <canvas id="canvas" className="canvas" ref={canvasRef}></canvas>
        </div>
      </section>
    </>
  )
}

export default Canvas
