export default function getElementContentWidth (element) {
  const { paddingLeft, paddingRight } = getComputedStyle(element)
  const padding = parseFloat(paddingLeft) + parseFloat(paddingRight)

  return element.clientWidth - padding
}
