import * as d3 from 'd3'
import { AxisUtils } from './interfaces/AxisUtils'
import { ChartOptions } from './interfaces/ChartOptions'
import { renderChart } from './renderChart'
import { initChart } from './initChart'
import { getInnerSize } from './getInnerSize'
import { getMainGroup } from './getMainGroup'
import { getAxisUtils } from './getAxisUtils'
import { renderAxis } from './renderAxis'

export function draw<Datum> (selector: string, { width, height, margin, yAxis, xAxis, data, animate, series }: ChartOptions<Datum>): void {
  xAxis.position = xAxis.position ?? 'bottom'
  yAxis.position = yAxis.position ?? 'left'
  const app = d3.select(selector)
  const chart = initChart({ app, width, height })
  const main = getMainGroup({ chart, margin })
  const { innerWidth, innerHeight } = getInnerSize({ width, height, margin })
  const xAxisUtils: AxisUtils<Datum> = getAxisUtils({ data, axisOptions: xAxis, mainLength: innerWidth, crossLength: innerHeight, type: 'x' })
  const yAxisUtils: AxisUtils<Datum> = getAxisUtils({ data, axisOptions: yAxis, mainLength: innerHeight, crossLength: innerWidth, type: 'y' })
  const seriesList = []

  if (series instanceof Array) {
    seriesList.push(...series)
  } else {
    seriesList.push(series)
  }
  const colorScheme = d3.schemeTableau10
  for (let i = 0; i < seriesList.length; i++) {
    renderChart<Datum>({ i, seriesList, colorScheme, main, data, xAxisUtils, yAxisUtils, innerHeight, animate })
  }
  renderAxis<Datum>({ axisOptions: yAxis, axisUtils: yAxisUtils, main, innerHeight, innerWidth })
  renderAxis<Datum>({ axisOptions: xAxis, axisUtils: xAxisUtils, main, innerHeight, innerWidth })
}
