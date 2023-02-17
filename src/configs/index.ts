export interface CalData {
  value?: number
  day: string
  week: string
  date: string
}

export interface RokuCalendarConfig {
  sideLength?: number
  gap?: number
  padding?: number
  durationDays?: number
  padRight?: boolean
  padLeft?: boolean
  tooltipFormatter?: (d: CalData) => string
  fontSize?: number
  animate?: boolean
  animateRandom?: number
  animateDelay?: number
}

export const defaultCalendarConfig = {
  sideLength: 10,
  gap: 3,
  padding: 30,
  durationDays: 0,
  fontSize: 12,
  padRight: false,
  padLeft: true,
  animate: true,
  animateRandom: 2,
  animateDelay: 300,
  tooltipFormatter: (d: CalData) => {
    return `
      <div style="font-weight: bold">
        ${d.date}</div><div class="tooltip-value">${d.value ?? 'N/A'}
      </div>`
  },
}
