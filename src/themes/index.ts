import * as d3 from 'd3'
export const defaultTheme = {
  colors: d3.schemeCategory10,
  outlineColor: 'rgba(27, 31, 35, 0.06)',
  strokeColor: 'rgba(27, 31, 35, 0.1)',
  outlineWidth: 1,
  borderRadius: 2,
  outlineOffset: -1,
  nanFillColor: '#ebedf0',
  visualMap: ['#9be9a8', '#40c463', '#30a14e', '#216e39'] as readonly string[],
  fillColor: 'DarkSlateGray',
  textColor: '#333',
}

export const darkTheme = {
  nanFillColor: '#161b22',
  visualMap: ['#0e4429', '#006d32', '#26a641', '#39d353'] as readonly string[],
  fillColor: 'DarkSlateGray',
  textColor: '#888',
}

export type Theme = typeof defaultTheme

const themes = new Map<string, Theme>()

registerTheme('light', defaultTheme)
registerTheme('dark', darkTheme)

export function registerTheme (name: string, theme: Partial<Theme>) {
  themes.set(name, { ...defaultTheme, ...theme })
}

export function getTheme (name: string): Required<Theme> {
  return themes.get(name) ?? defaultTheme
}
