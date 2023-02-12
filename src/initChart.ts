import * as d3 from 'd3'

export function initChart (
  { width, height, app }: { width: number, height: number, app: d3.Selection<d3.BaseType, unknown, HTMLElement, any> }
): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {
  return app
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('class', 'roku-chart')
}
