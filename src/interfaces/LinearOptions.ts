export interface LinearOptions<D> {
  type: 'linear'
  value: (d: D, i: number) => number
}
