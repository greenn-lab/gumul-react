import Gumul from '../Gumul'

export default {
  x(e: WheelEvent, x: HTMLDivElement) {
    if (x.dataset.throttle) return
    else {
      x.dataset.throttle = 'ing'
      setTimeout(() =>
          delete x.dataset.throttle,
        150 - Math.abs(e.deltaX * 30)
      )

      x.scrollLeft += (e.deltaX > 0 ? 1 : e.deltaX < 0 ? -1 : 0) * Gumul.SCROLL_X_SIZE
    }
  },
  y(e: WheelEvent, y: HTMLDivElement): void {
    if (y.dataset.throttle) return
    else {
      y.dataset.throttle = 'ing'
      setTimeout(() =>
          delete y.dataset.throttle,
        150 - Math.abs(e.deltaY * 30))

      y.scrollTop += (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0) * Gumul.SCROLL_Y_SIZE
    }
  }
}
