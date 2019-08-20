import Gumul from '../../Gumul'

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
  y: function(e: WheelEvent): void {
    // const { element, scroll, data } = this
    //
    // if (element.container.dataset.wheelYThrottle) return
    // else {
    //   element.container.dataset.wheelYThrottle = 'ing'
    //   setTimeout(() =>
    //       delete element.container.dataset.wheelYThrottle,
    //     150 - Math.abs(e.deltaY * 30))
    //
    //   scroll.top += (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0)
    //
    //   if (scroll.top < 0)
    //     scroll.top = 0
    //   else if (scroll.top > data.length - 1)
    //     scroll.top = data.length - 1
    // }
  }
}
