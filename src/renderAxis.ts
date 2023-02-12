import * as d3 from 'd3'
import { AxisUtils } from './interfaces/AxisUtils'
import { XAxisOptions } from './interfaces/XAxisOptions'
import { YAxisOptions } from './interfaces/YAxisOptions'

export function renderAxis<Datum> ({
  axisOptions, axisUtils, main, innerHeight, innerWidth
}: {
  axisOptions: XAxisOptions<Datum> | YAxisOptions<Datum>
  axisUtils: AxisUtils<Datum>
  main: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  innerHeight: number
  innerWidth: number
}
): void {
  switch (axisOptions.position) {
    case 'top': {
      let topAxis
      switch (axisUtils.type) {
        case 'linear': {
          topAxis = d3.axisTop<number>(axisUtils.scale)
          break
        }
        case 'category':
        default: {
          topAxis = d3.axisTop<string>(axisUtils.scale)
        }
      }
      main.append('g').call(topAxis)
      break
    }
    case 'left': {
      let leftAxis
      switch (axisUtils.type) {
        case 'linear': {
          leftAxis = d3.axisLeft<number>(axisUtils.scale)
          break
        }
        case 'category':
        default: {
          leftAxis = d3.axisLeft<string>(axisUtils.scale)
        }
      }
      main.append('g').call(leftAxis)
      break
    }
    case 'right': {
      let right
      switch (axisUtils.type) {
        case 'linear': {
          right = d3.axisRight<number>(axisUtils.scale)
          break
        }
        case 'category':
        default: {
          right = d3.axisRight<string>(axisUtils.scale)
        }
      }
      main.append('g')
        .attr('transform', `translate(${innerWidth}, 0)`)
        .call(right)
      break
    }
    default: {
      let bottomAxis
      switch (axisUtils.type) {
        case 'linear': {
          bottomAxis = d3.axisBottom<number>(axisUtils.scale)
          break
        }
        case 'category':
        default: {
          bottomAxis = d3.axisBottom<string>(axisUtils.scale)
        }
      }
      main
        .append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(bottomAxis)
    }
  }
}
