import * as d3 from 'd3'
import { AxisOptions } from './interfaces/AxisOptions'
import { AxisUtils } from './interfaces/AxisUtils'

export function getAxisUtils<Datum> ({
  axisOptions, data, mainLength, crossLength, type
}: {
  axisOptions: AxisOptions<Datum>
  data: Datum[]
  mainLength: number
  crossLength: number
  type: 'x' | 'y'
}): AxisUtils<Datum> {
  let axisUtils: AxisUtils<Datum>
  switch (axisOptions.type) {
    case 'linear': {
      const scale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d, i) => axisOptions.value(d, i)) ?? 0])
        .range(type === 'y' ? [mainLength, 0] : [0, mainLength])
      const getWidth = mainLength / data.length
      const getOffset = (d: Datum, i: number): number => scale(axisOptions.value(d, i))
      axisUtils = {
        type: 'linear',
        scale,
        getWidth,
        getOffset,
        getValue: axisOptions.value,
        getZero: crossLength,
        mainLength,
        crossLength
      }
      break
    }
    case 'category':
    default: {
      const scale = d3
        .scaleBand()
        .domain(data.map((d, i) => axisOptions.value(d, i)))
        .range([0, mainLength])
        .padding(0.2)
      const getWidth = scale.bandwidth()
      axisUtils = {
        type: 'category',
        scale,
        getValue: axisOptions.value,
        getWidth,
        getOffset: (d: Datum, i: number): number => scale(axisOptions.value(d, i)) ?? 0,
        getZero: crossLength,
        mainLength,
        crossLength
      }
      break
    }
  }
  return axisUtils
}
