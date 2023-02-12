export function getColor (colorScheme: readonly string[], i: number, c?: string): string {
  const defaultColor = colorScheme[i % colorScheme.length]
  const color = c !== undefined ? c : defaultColor
  return color
}
