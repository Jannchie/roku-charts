import * as d3 from 'd3'
import { AnimateOptions } from './interfaces/AnimateOptions'
import { AxisUtils } from './interfaces/AxisUtils'

export function drawLine<Datum> ({ main, data, color, xAxisUtils, yAxisUtils, animate }: {
  main: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  data: Datum[]
  color: string
  xAxisUtils: AxisUtils<Datum>
  yAxisUtils: AxisUtils<Datum>
  animate?: AnimateOptions<Datum>
}): void {
  const path = main
    .append('path')
    .datum(data)
    .attr('stroke', color)
    .attr('fill', 'none')
    .attr('d', d3.line<Datum>()
      .x((d, i) => xAxisUtils.getOffset(d, i) + xAxisUtils.getWidth / 2)
      .y((d, i) => yAxisUtils.getOffset(d, i)).curve(d3.curveMonotoneX)
    )
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')

  main.selectAll('.dot')
    .data(data)
    .enter().append('circle').attr('fill', color).attr('stroke', 'white')
    .attr('class', 'dot') // Assign a class for styling
    .attr('cx', (d, i) => xAxisUtils.getOffset(d, i) + xAxisUtils.getWidth / 2)
    .attr('cy', (d, i) => yAxisUtils.getOffset(d, i))
    .attr('r', 5)
    .on('mouseout', function () { })

  const totalLength = path.node()?.getTotalLength()
  if (totalLength !== undefined) {
    path
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .ease(animate?.ease ?? d3.easeBackOut)
      .delay((d, i) => ((animate?.delay) != null) ? animate?.delay(d[i], i) : 0)
      .duration(animate?.duration ?? 1000)
      .ease(animate?.ease ?? d3.easeExpOut)
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', 0)
  }
}
