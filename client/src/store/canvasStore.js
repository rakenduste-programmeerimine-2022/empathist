import create from "zustand"

export const useCanvasStore = create((set, get) => ({
  canvas: null,
  context: null,
  mouseDown: false,
  mouseMove: false,
  lineCap: "round",
  strokeStyle: "#000000",
  lineWidth: "1",
  fillStyle: "#000000",
  setLineCap: (value) => {
    set(() => ({ lineCap: value }))
    get().context.lineCap = value
  },
  setStrokeStyle: (value) => {
    set(() => ({ strokeStyle: value }))
    get().context.strokeStyle = value
  },
  setFillStyle: (value) => {
    set(() => ({ fillStyle: value }))
    get().context.fillStyle = value
  },
  setLineWidth: (value) => {
    set(() => ({ lineWidth: value }))
    get().context.lineWidth = value
  },
  setCanvas: (canvas) => set(() => ({ canvas })),
  setContext: (context) => set(() => ({ context: context })),
  setMouseDown: (value) => set(() => ({ mouseDown: value })),
  setMouseMove: (value) => set(() => ({ mouseMove: value })),
}))

export const useBrushStore = create((set, get) => ({
  handleBrushPick: (tool) => {
    const context = useCanvasStore.getState().context
    if (tool === "brush") {
      context.lineCap = useCanvasStore.getState().lineCap
      context.strokeStyle = useCanvasStore.getState().strokeStyle
      context.lineWidth = useCanvasStore.getState().lineWidth
      context.miterLimit = "1"
    }
    if (tool === "eraser") {
      context.lineCap = "round"
      context.strokeStyle = "white"
      context.lineWidth = "20"
    }
    const canvas = useCanvasStore.getState().canvas
    canvas.onmousemove = (e) => {
      useCanvasStore.getState().setMouseMove(true)
      if (useCanvasStore.getState().mouseDown) {
        get().draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
      }
    }
    canvas.onmouseup = (e) => {
      useCanvasStore.getState().setMouseDown(false)
      useCanvasStore.getState().context.closePath()
    }
    canvas.onmousedown = (e) => {
      const context = useCanvasStore.getState().context

      useCanvasStore.getState().setMouseDown(true)
      context.beginPath()
      context.moveTo(
        e.pageX - e.target.offsetLeft,
        e.pageY - e.target.offsetTop
      )
    }
  },
  draw: (x, y) => {
    const context = useCanvasStore.getState().context
    context.lineTo(x, y)
    context.stroke()
  },
}))

export const useLineStore = create((set, get) => ({
  startingCords: { x: 0, y: 0 },
  save: null,
  handleLinePick: () => {
    const canvas = useCanvasStore.getState().canvas
    const context = useCanvasStore.getState().context
    context.lineCap = useCanvasStore.getState().lineCap
    context.strokeStyle = useCanvasStore.getState().strokeStyle
    context.lineWidth = useCanvasStore.getState().lineWidth
    canvas.onmousemove = (e) => {
      if (useCanvasStore.getState().mouseDown) {
        get().draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
      }
    }
    canvas.onmouseup = (e) => {
      useCanvasStore.getState().setMouseDown(false)
    }
    canvas.onmousedown = (e) => {
      const context = useCanvasStore.getState().context
      useCanvasStore.getState().setMouseDown(true)
      set(() => ({
        startingCords: {
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
        },
      }))
      context.beginPath()
      context.moveTo(get().startingCords.x, get().startingCords.y)
      set(() => ({ save: canvas.toDataURL() }))
    }
  },
  draw: (x, y) => {
    const img = new Image()
    const context = useCanvasStore.getState().context
    const canvas = useCanvasStore.getState().canvas
    img.src = get().save
    img.onload = async () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
      context.beginPath()
      context.moveTo(get().startingCords.x, get().startingCords.y)
      context.lineTo(x, y)
      context.stroke()
    }
  },
}))
export const useRectangleStore = create((set, get) => ({
  startingCords: { x: 0, y: 0 },
  handleRectPick: () => {
    useCanvasStore.getState().context.miterLimit = "10"
    const canvas = useCanvasStore.getState().canvas
    canvas.onmousemove = (e) => {
      useCanvasStore.getState().setMouseMove(true)
      if (useCanvasStore.getState().mouseDown) {
        let currentX = e.pageX - e.target.offsetLeft
        let currentY = e.pageY - e.target.offsetTop
        set(() => ({
          size: {
            width: currentX - get().startingCords.x,
            height: currentY - get().startingCords.y,
          },
        }))
        get().draw(
          get().startingCords.x,
          get().startingCords.y,
          get().size.width,
          get().size.height
        )
      }
    }
    canvas.onmouseup = (e) => {
      useCanvasStore.getState().setMouseDown(false)
    }
    canvas.onmousedown = (e) => {
      useCanvasStore.getState().setMouseDown(true)
      const context = useCanvasStore.getState().context
      context.beginPath()
      set(() => ({
        startingCords: {
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
        },
      }))
      set(() => ({ save: canvas.toDataURL() }))
    }
  },
  draw: (x, y, w, h) => {
    const img = new Image()
    const context = useCanvasStore.getState().context
    const canvas = useCanvasStore.getState().canvas
    img.src = get().save
    img.onload = async () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
      context.beginPath()
      context.rect(x, y, w, h)
      context.fill()
      context.stroke()
    }
  },
}))
export const useCircleStore = create((set, get) => ({
  startingCords: { x: 0, y: 0 },
  handleCirclePick: () => {
    const canvas = useCanvasStore.getState().canvas
    canvas.onmousemove = (e) => {
      useCanvasStore.getState().setMouseMove(true)
      if (useCanvasStore.getState().mouseDown) {
        let currentX = e.pageX - e.target.offsetLeft
        let currentY = e.pageY - e.target.offsetTop
        let width = currentX - get().startingCords.x
        let height = currentY - get().startingCords.y
        let r = Math.sqrt(width ** 2 + height ** 2)
        get().draw(get().startingCords.x, get().startingCords.y, r)
      }
    }
    canvas.onmouseup = (e) => {
      useCanvasStore.getState().setMouseDown(false)
    }
    canvas.onmousedown = (e) => {
      useCanvasStore.getState().setMouseDown(true)
      const context = useCanvasStore.getState().context
      context.beginPath()
      set(() => ({
        startingCords: {
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
        },
      }))
      set(() => ({ save: canvas.toDataURL() }))
    }
  },
  draw: (x, y, r) => {
    const img = new Image()
    const context = useCanvasStore.getState().context
    const canvas = useCanvasStore.getState().canvas
    img.src = get().save
    img.onload = async () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
      context.beginPath()
      context.arc(x, y, r, 0, 2 * Math.PI)
      context.fill()
      context.stroke()
    }
  },
}))
export const useArtStore = create((set, get) => ({
  //artistic regime
  startingCords: { x: 0, y: 0 },
  oldCordsTo: { x: 0, y: 0 },
  handleArtPick: () => {
    const canvas = useCanvasStore.getState().canvas
    canvas.onmousemove = (e) => {
      const context = useCanvasStore.getState().context
      useCanvasStore.getState().setMouseMove(true)
      if (useCanvasStore.getState().mouseDown) {
        context.strokeStyle = "white"
        context.beginPath()
        context.moveTo(get().startingCords.x, get().startingCords.y)
        get().draw(get().oldToX, get().oldToY)
        set(() => ({
          oldCordsTo: {
            x: e.pageX - e.target.offsetLeft,
            y: e.pageY - e.target.offsetTop,
          },
        }))
        context.strokeStyle = "black"
        context.beginPath()
        context.moveTo(get().startingCords.x, get().startingCords.y)
        get().draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
      }
    }
    canvas.onmouseup = (e) => {
      useCanvasStore.getState().setMouseDown(false)
      get().draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
    canvas.onmousedown = (e) => {
      set(() => ({
        startingCords: {
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
        },
      }))
      useCanvasStore.getState().setMouseDown(true)
    }
  },
  draw: (x, y) => {
    const context = useCanvasStore.getState().context
    context.lineTo(x, y)
    context.stroke()
  },
}))
