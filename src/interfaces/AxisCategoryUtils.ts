import * as d3 from 'd3'
import { AxisBaseUtils } from './AxisBaseUtils'

export interface AxisCategoryUtils<D> extends AxisBaseUtils<D> {
  type: 'category'
  getValue: (d: D, i: number) => string
  scale: d3.ScaleBand<string>
}
