import {
  useBrushStore,
  useLineStore,
  useCanvasStore,
  useRectangleStore,
  useCircleStore,
} from "../../store/canvasStore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEraser,
  faPaintBrush,
  faCircle,
  faSquare,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons"

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
    <div className="toolbar mb-3">
      <button
        className="button is-text p-1"
        onClick={() => handleBrushPick("eraser")}
      >
        <FontAwesomeIcon icon={faEraser} className="is-size-3" />
      </button>
      <button
        className="button is-text p-1"
        onClick={() => handleBrushPick("brush")}
      >
        <FontAwesomeIcon icon={faPaintBrush} className="is-size-3" />
      </button>
      <button className="button is-text p-1" onClick={handleCirclePick}>
        <FontAwesomeIcon icon={faCircle} className="is-size-3" />
      </button>
      <button className="button is-text p-1" onClick={handleRectPick}>
        <FontAwesomeIcon icon={faSquare} className="is-size-3" />
      </button>
      <button className="button is-text p-1" onClick={handleLinePick}>
        <FontAwesomeIcon icon={faArrowTrendUp} className="is-size-3" />
      </button>
      <div className="toolbar-item mx-2">
        <label className="label my-0">Stroke</label>
        <input
          className="input p-1"
          type="color"
          value={strokeStyle}
          onChange={(e) => setStrokeStyle(e.target.value)}
        ></input>
      </div>

      <div className="toolbar-item mx-2">
        <label className="label my-0">Fill</label>
        <input
          className="input p-1"
          type="color"
          value={fillStyle}
          onChange={(e) => setFillStyle(e.target.value)}
        ></input>
      </div>

      <div className="toolbar-item mx-2">
        <label className="label my-0">Width</label>
        <input
          className="input"
          type="number"
          min="1"
          max="100"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        ></input>
      </div>
    </div>
  )
}

export default Toolbar
