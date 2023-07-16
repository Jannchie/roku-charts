import * as d3 from 'd3'
export const defaultTheme = {
  outlineColor: 'rgba(27, 31, 35, 0.06)',
  strokeColor: 'rgba(27, 31, 35, 0.1)',
  outlineWidth: 1,
  borderRadius: 2,
  outlineOffset: -1,
  nanFillColor: '#ebedf0',
  visualMap: d3.schemeBuGn[6].slice(1) as string[] | readonly string[],
  colorScheme: d3.schemeTableau10,
  fillColor: 'DarkSlateGray',
  lineColor: '#333',
  textColor: '#333',
  itemBGColor: '#0000',
  animateRandom: 0,
  gap: 0.2,
  animateDelay: 300,
  animateDuration: 500,
  valueFormat: d3.format('.2s'),
  labelFormat: (d: string) => d,
  timeFormat: (d: Date) => d3.timeFormat('%Y-%m-%d')(d),
}

export const darkTheme = {
  nanFillColor: '#161b22',
  visualMap: d3.schemeBuGn[8].slice(3).reverse(),
  fillColor: 'DarkSlateGray',
  textColor: '#AAA',
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
