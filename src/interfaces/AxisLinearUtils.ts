import * as d3 from 'd3'
import { AxisBaseUtils } from './AxisBaseUtils'

export interface AxisLinearUtils<D> extends AxisBaseUtils<D> {
  type: 'linear'
  getValue: (d: D, i: number) => number
  scale: d3.ScaleLinear<number, number>
}
