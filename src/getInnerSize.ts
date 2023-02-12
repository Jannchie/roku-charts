
export function getInnerSize ({ width, height, margin }: {
  height: number
  width: number
  margin: { top: number, right: number, bottom: number, left: number }
}): { innerWidth: number, innerHeight: number } {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  return { innerWidth, innerHeight }
}
