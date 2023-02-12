import * as d3 from 'd3'
import { AnimateOptions } from './interfaces/AnimateOptions'
import { AxisUtils } from './interfaces/AxisUtils'

export function drawBar<Datum> ({
  yAxisUtils, main, data, color, animate, xAxisUtils, innerHeight
}: {
  yAxisUtils: AxisUtils<Datum>
  main: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  data: Datum[]
  color: string
  xAxisUtils: AxisUtils<Datum>
  innerHeight: number
  animate?: AnimateOptions<Datum>
}): void {
  let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  const bar = main
    .selectAll()
    .data(data)
    .enter()
    .append('rect')
    .style('fill', color)
  if (yAxisUtils.type === 'category') {
    bar
      .attr('x', 0)
      .attr('y', yAxisUtils.getOffset)
      .attr('height', yAxisUtils.getWidth)
      .attr('width', 0)
    if (animate !== undefined) {
      bar.transition()
        .ease(animate.ease ?? d3.easeBackOut)
        .delay(animate.delay ?? ((_, i) => i * 100))
        .duration(animate.duration ?? 1000)
        .attr('y', yAxisUtils.getOffset)
        .attr('width', xAxisUtils.getOffset)
    } else {
      bar.attr('y', yAxisUtils.getOffset)
        .attr('width', xAxisUtils.getOffset)
    }
  } else {
    bar
      .attr('width', xAxisUtils.getWidth)
      .style('fill', color)
      .attr('x', xAxisUtils.getOffset)
      .attr('y', xAxisUtils.getZero)
      .attr('height', 0)
    if (animate !== undefined) {
      bar.transition()
        .ease(animate.ease ?? d3.easeBackOut)
        .delay(animate.delay ?? ((_, i) => i * 100))
        .duration(animate.duration ?? 1000)
        .attr('y', yAxisUtils.getOffset)
        .attr('height', (d, i) => innerHeight - yAxisUtils.getOffset(d, i))
    } else {
      bar.attr('y', yAxisUtils.getOffset)
        .attr('height', (d, i) => innerHeight - yAxisUtils.getOffset(d, i))
    }
  }
  bar.on('mouseover', (_, d) => {
    tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('border-radius', '1rem')
      .style('font-size', '1rem')
      .style('padding', '0.5rem')
      .style('border', '1px solid #CCC')
      .style('background-color', '#FFF')
      .html(`
      <div style="display: flex; align-items: center;">
        <div style="width: 1rem; height: 1rem; background-color: ${color}; border-radius: 50%; margin-right: 0.5rem;"></div>
        <div style="font-size: 1rem">${xAxisUtils.getValue(d, 0)}: ${yAxisUtils.getValue(d, 0)}</div>
      </div>
    `)
  })
    .on('mousemove', function (event: MouseEvent) { return tooltip?.style('top', `${event.pageY + 15}px`).style('left', `${event.pageX + 15}px`) })
    .on('mouseout', function () { return tooltip?.style('opacity', 0).remove() })
}
