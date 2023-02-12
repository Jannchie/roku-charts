import { XAxisOptions } from './XAxisOptions'
import { YAxisOptions } from './YAxisOptions'
import { Series } from './Series'

export interface ChartOptions<D> {
  width: number
  height: number
  margin: { top: number, right: number, bottom: number, left: number }
  yAxis: YAxisOptions<D>
  xAxis: XAxisOptions<D>
  data: D[]
  animate?: {
    duration?: number
    ease?: (t: number) => number
    delay?: (d: D, i: number) => number
  }
  series: Series[] | Series
}
