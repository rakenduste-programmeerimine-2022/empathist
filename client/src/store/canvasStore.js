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
  setCanvas: (canvas) => set(() => ({canvas})),
  setContext: (context) => set(() => ({context})),
  setMouseDown: (value) => set(() => ({ mouseDown: value })),
  setMouseMove: (value) => set(() => ({ mouseMove: value })),
  setMousePosition: (e) => {
    const rect = get().canvas.getBoundingClientRect()
    const scaleX = get().canvas.width / rect.width
    const scaleY = get().canvas.height / rect.height
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    }
  },

  resizeCanvasToDisplaySize :() => {
    const canvas = get().canvas
    const dpr = window.devicePixelRatio;
    const {width, height} = canvas.getBoundingClientRect();
    const displayWidth  = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);

    const needResize = canvas.width  !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }


}))

export const useBrushStore = create((set, get) => ({
  handleBrushPick: (tool) => {
    const canvas = useCanvasStore.getState().canvas
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
    canvas.onmousemove = (e) => {
      useCanvasStore.getState().setMouseMove(true)
      if (useCanvasStore.getState().mouseDown) {
        const mousePosition = useCanvasStore.getState().setMousePosition(e)
        get().draw(mousePosition.x, mousePosition.y)
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
      const mousePosition = useCanvasStore.getState().setMousePosition(e)
      context.moveTo(
          mousePosition.x, mousePosition.y
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
        const mousePosition = useCanvasStore.getState().setMousePosition(e)
        get().draw(mousePosition.x, mousePosition.y)
      }
    }
    canvas.onmouseup = (e) => {
      useCanvasStore.getState().setMouseDown(false)
    }
    canvas.onmousedown = (e) => {
      const context = useCanvasStore.getState().context
      useCanvasStore.getState().setMouseDown(true)
      const mousePosition = useCanvasStore.getState().setMousePosition(e)
      set(() => ({
        startingCords: {
          x: mousePosition.x,
          y: mousePosition.y,
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
        const mousePosition = useCanvasStore.getState().setMousePosition(e)
        let currentX = mousePosition.x
        let currentY = mousePosition.y
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
      const mousePosition = useCanvasStore.getState().setMousePosition(e)
      set(() => ({
        startingCords: {
          x: mousePosition.x,
          y: mousePosition.y,
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
        const mousePosition = useCanvasStore.getState().setMousePosition(e)
        let currentX = mousePosition.x
        let currentY = mousePosition.y
        let width = currentX - get().startingCords.x
        let height = currentY - get().startingCords.y
        let r = Math.sqrt(width** 2 +  height** 2)
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
      const mousePosition = useCanvasStore.getState().setMousePosition(e)
      set(() => ({
        startingCords: {
          x: mousePosition.x,
          y: mousePosition.y,
        },
      }))
      set(() => ({ save: canvas.toDataURL() }))
    }
  },
  draw: (x, y, r) => {
    const img = new Image()
    const canvas = useCanvasStore.getState().canvas
    const context = useCanvasStore.getState().context
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
        get().draw(get().oldCordsTo.x, get().oldCordsTo.y)
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
