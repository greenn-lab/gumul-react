import scroll from './scroll'
import wheel from './wheel'
import mouseenter from './axis/mouseenter'
import resize from './cell/resize'

export default {
  scroll,
  wheel,
  cell: {
    resize
  },
  axis: {
    mouseenter
  }
}
