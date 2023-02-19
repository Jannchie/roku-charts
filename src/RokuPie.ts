import { defaultTheme, type Theme } from './themes/index'
import * as d3 from 'd3'
import { RokuChart } from '.'

export interface PieDatum {
  value: number
  key: string
}
export const defaultPieConfig = {
  dataKey: ((d) => d.key) as d3.ValueFn<d3.BaseType, PieDatum, string>,
  valueKey: ((d) => d.value) as d3.ValueFn<d3.BaseType, PieDatum, number>,
  innerRadius: 90 as number | ((d: PieDatum, ...args: any[]) => number),
  outerRadius: 0 as number | ((d: PieDatum, ...args: any[]) => number),
  padding: 20,
}
export type PieConfig = typeof defaultPieConfig

export class RokuPie extends RokuChart<PieDatum, PieConfig> {
  data = [] as PieDatum[]
  theme: Theme = defaultTheme
  config = defaultPieConfig
  group?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  public init (selector: string) {
    super.init(selector)
    this.group = this.svg?.append('g').attr('class', 'data-group')
  }

  public setConifg (cfg: Partial<PieConfig>) {
    this.config = { ...this.config, ...cfg }
  }

  public setData (data: PieDatum[]): this {
    this.data = data
    return this
  }

  public static new (selector: string): RokuPie {
    const chart = new RokuPie()
    chart.init(selector)
    return chart
  }

  override draw (cfg?: Partial<PieConfig>): void {
    const config = { ...this.config, ...cfg }
    // eslint-disable-next-line no-console
    if (this.group === undefined) {
      throw new Error('group is not exists')
    }
    if (this.shape === undefined) {
      throw new Error('shape is not exists')
    }
    const size = Math.min(this.shape.width, this.shape.height)
    const r = size / 2 - config.padding * 2
    const pie = d3.pie<PieDatum>().value((d) => d.value)
    let outerRadius: typeof config.outerRadius = r
    if (config.outerRadius !== 0) {
      outerRadius = config.outerRadius
    }

    const arcs = this.group.selectAll<SVGPathElement, d3.PieArcDatum<PieDatum>>('g').data(pie(this.data), key => key.data.key)
    const arc = d3.arc<d3.PieArcDatum<PieDatum>>()
      .innerRadius(config.innerRadius as any)
      .outerRadius(outerRadius as any)
      .cornerRadius(2)
      .padAngle(0.1)

    arcs.join(enter => {
      if (this.group?.attr('transform') === null) {
        this.group?.attr('transform', `translate(${size / 2}, ${size / 2}) rotate(-90)`).transition('A').duration(this.theme.animateDuration).attr('transform', `translate(${size / 2}, ${size / 2}) rotate(0)`)
      }
      const arcStart = d3.arc<d3.PieArcDatum<PieDatum>>()
        .innerRadius(config.innerRadius as any * 0.1)
        .outerRadius(outerRadius as any * 0.5)
        .cornerRadius(2)
        .padAngle(0.1)

      const group = enter
        .append('g')
      const path = group.append('path')
        .attr('opacity', 0)
        .attr('d', arcStart)
        .transition('B')
        .duration(this.theme.animateDuration)
        .delay((_, i: number) => this.theme.animateDelay * i / enter.data().length * (1 + Math.random() * this.theme.animateRandom))
        .attr('opacity', 1)
        .attr('d', arc)
        .attr('fill', (_, i) => this.theme.colorScheme[i % this.theme.colorScheme.length])

      // group.append('text').attr('class', 'pie-label')
      //   .text(d => d.data.key)
      //   .attr('transform', function (d) {
      //     const pos = arc.centroid(d)
      //     const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      //     pos[0] = r * 0.99 * (midangle < Math.PI ? 1 : -1)
      //     return `translate(${pos[0]}, ${pos[1]})`
      //   })
      //   .style('text-anchor', function (d) {
      //     const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      //     return (midangle < Math.PI ? 'start' : 'end')
      //   })

      path.nodes().forEach((d: { _prev?: d3.PieArcDatum<PieDatum> } & SVGPathElement, i: number) => {
        d._prev = enter.data()[i]
      })
      return group
    }, update => {
      function c (this: SVGPathElement & { _prev: d3.PieArcDatum<PieDatum> }, d: d3.PieArcDatum<PieDatum>) {
        const interpolate = d3.interpolate(this._prev, d)
        this._prev = interpolate(0)
        return function (t: number) {
          return arc(interpolate(t)) ?? ''
        }
      }
      // update.selectAll('.pie-label').data(update.data(), d => d.data.key).transition().attr('transform', function (d) {
      //   const pos = arc.centroid(d)
      //   const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      //   pos[0] = r * 0.99 * (midangle < Math.PI ? 1 : -1)
      //   return `translate(${pos[0]}, ${pos[1]})`
      // }).style('text-anchor', function (d) {
      //   const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      //   return (midangle < Math.PI ? 'start' : 'end')
      // })

      update
        .selectAll<never, d3.PieArcDatum<PieDatum>>('path')
        .data(update.data(), d => d.data.key).transition()
        .duration(this.theme.animateDuration)
        .attrTween('d', c as any)
      return update
    })
  }
}
