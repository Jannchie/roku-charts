
export interface AxisBaseUtils<D> {
  getWidth: number
  getOffset: (d: D, i: number) => number
  getZero: ((d: D, i: number) => number) | number
  mainLength: number
  crossLength: number
}
