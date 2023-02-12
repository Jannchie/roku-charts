import * as d3 from 'd3'
import { getColor } from './getColor'
import { drawBar } from './drawBar'
import { AnimateOptions } from './interfaces/AnimateOptions'
import { Series } from './interfaces/Series'
import { AxisUtils } from './interfaces/AxisUtils'
import { drawLine } from './drawLine'

export function renderChart<Datum> ({ i, seriesList, colorScheme, main, data, xAxisUtils, yAxisUtils, innerHeight, animate }: {
  seriesList: Series[]
  i: number
  colorScheme: readonly string[]
  main: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  data: Datum[]
  xAxisUtils: AxisUtils<Datum>
  yAxisUtils: AxisUtils<Datum>
  innerHeight: number
  animate?: AnimateOptions<Datum>
}): void {
  const s = seriesList[i]
  const color = getColor(colorScheme, i, s.color)
  switch (s.type) {
    case 'bar': {
      drawBar({ main, data, color, xAxisUtils, yAxisUtils, innerHeight, animate })
      break
    }
    case 'line': {
      drawLine({ main, data, color, xAxisUtils, yAxisUtils, animate })
      break
    }
    default: {
      break
    }
  }
}
