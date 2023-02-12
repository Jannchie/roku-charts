export interface CategoryOptions<D> {
  type: 'category'
  value: (d: D, i: number) => string
}
