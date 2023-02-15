export type Datum = Record<string, any>

export interface BaseAxisConfig {
  show?: boolean
}

export interface AxisConfigBand extends BaseAxisConfig {
  type?: 'band'
  domain?: [string, string] | ((data: Datum) => [string, string])
}

export interface AxisConfigLinear extends BaseAxisConfig {
  type?: 'linear'
  domain?: [number, number] | ((data: Datum) => [number, number])
  ticks?: number
  tickFormat?: (d: number) => string
}

export interface AxisConfigDate extends BaseAxisConfig {
  type?: 'date'
  domain?: [Date, Date] | ((data: Datum) => [Date, Date])
  ticks?: number
  tickFormat?: (d: Date) => string
}

export type AxisConfig = AxisConfigBand | AxisConfigLinear | AxisConfigDate
