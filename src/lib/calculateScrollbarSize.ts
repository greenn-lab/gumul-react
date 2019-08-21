let width: number

export default (): number => {
  return width ? width : width = getSize()
}

function getSize(): number {
  const a: HTMLDivElement = document.createElement('div')
  const b: HTMLDivElement = document.createElement('div')

  a.style.visibility = 'hidden'
  a.style.overflow = 'scroll'
  a.style.width = '100px'
  a.appendChild(b)
  document.body.appendChild(a)

  const size: number = 100 - b.clientWidth

  document.body.removeChild(a)

  return size
}
