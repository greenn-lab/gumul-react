export default (a: HTMLDivElement, b: HTMLDivElement): void => {
  a.addEventListener('mouseenter', () => {
    a.style.zIndex = '6'
    b.style.zIndex = '5'
  })

  b.addEventListener('mouseenter', () => {
    b.style.zIndex = '6'
    a.style.zIndex = '5'
  })
}
