import Gumul from '../Gumul'

export default {
  x(e: WheelEvent, x: HTMLDivElement) {
    if (x.dataset.wheelXThrottle) return
    else {
      x.dataset.wheelXThrottle = 'ing'
      setTimeout(() =>
          delete x.dataset.wheelXThrottle,
        150 - Math.abs(e.deltaX * 30)
      )

      x.scrollLeft += (e.deltaX > 0 ? 1 : e.deltaX < 0 ? -1 : 0) * Gumul.SCROLL_X_SIZE
    }
  },
  y(e: WheelEvent, y: HTMLDivElement): void {
    if (y.dataset.wheelYThrottle) return
    else {
      y.dataset.wheelYThrottle = 'ing'
      setTimeout(() =>
          delete y.dataset.wheelYThrottle,
        150 - Math.abs(e.deltaY * 30))

      y.scrollTop += (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0) * Gumul.SCROLL_Y_SIZE
    }
  }
}
