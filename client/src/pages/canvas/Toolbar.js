import {
  useBrushStore,
  useLineStore,
  useCanvasStore,
  useRectangleStore,
  useCircleStore,
} from "../../store/canvasStore"

const Toolbar = () => {
  const handleBrushPick = useBrushStore((state) => state.handleBrushPick)
  const handleLinePick = useLineStore((state) => state.handleLinePick)
  const handleCirclePick = useCircleStore((state) => state.handleCirclePick)
  const handleRectPick = useRectangleStore((state) => state.handleRectPick)
  const strokeStyle = useCanvasStore((state) => state.strokeStyle)
  const setStrokeStyle = useCanvasStore((state) => state.setStrokeStyle)
  const lineWidth = useCanvasStore((state) => state.lineWidth)
  const setLineWidth = useCanvasStore((state) => state.setLineWidth)
  const setFillStyle = useCanvasStore((state) => state.setFillStyle)
  const fillStyle = useCanvasStore((state) => state.fillStyle)

  return (
    <div className="toolbar">
      <button
        className="button is-primary"
        onClick={() => handleBrushPick("eraser")}
      >
        Eraser
      </button>
      <button
        className="button is-info"
        onClick={() => handleBrushPick("brush")}
      >
        Brush
      </button>
      <button className="button is-warning" onClick={handleCirclePick}>
        Circle
      </button>
      <button className="button is-warning" onClick={handleRectPick}>
        Rect
      </button>
      <button className="button is-success" onClick={handleLinePick}>
        Line
      </button>
      <input
        type="color"
        value={strokeStyle}
        onChange={(e) => setStrokeStyle(e.target.value)}
      ></input>
      <input
        type="color"
        value={fillStyle}
        onChange={(e) => setFillStyle(e.target.value)}
      ></input>

      <div className="line-width mx-2">
        <label htmlFor="line-width">Line width: {lineWidth}</label>
        <input
          id="line-width"
          type="range"
          min="1"
          max="50"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        ></input>
      </div>
    </div>
  )
}

export default Toolbar
