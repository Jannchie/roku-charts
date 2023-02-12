import * as d3 from 'd3'

export function getMainGroup ({ chart, margin }: {
  chart: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  margin: { top: number, right: number, bottom: number, left: number }
}): d3.Selection<SVGGElement, unknown, HTMLElement, any> {
  return chart
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left}, ${margin.top})`
    )
}
