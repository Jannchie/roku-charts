
export interface AnimateOptions<D> {
  duration?: number
  ease?: ((t: number) => number)
  delay?: ((d: D, i: number) => number)
}
