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
  padding: 10,
}
export type PieConfig = typeof defaultPieConfig

export class RokuPie extends RokuChart<PieDatum, PieConfig> {
  data = []
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

  public static new (selector: string): RokuPie {
    const chart = new RokuPie()
    chart.init(selector)
    return chart
  }

  override draw (cfg?: PieConfig): void {
    const config = { ...this.config, ...cfg }
    // eslint-disable-next-line no-console
    console.log(config)
    if (this.group === undefined) {
      throw new Error('group is not exists')
    }
    if (this.shape === undefined) {
      throw new Error('shape is not exists')
    }
    const size = Math.min(this.shape.width, this.shape.height)
    const r = size / 2 - config.padding * 2
    // eslint-disable-next-line no-console
    console.log(r, this.shape)

    this.group.attr('transform', `translate(${size / 2}, ${size / 2})`)
    const pie = d3.pie<PieDatum>().value((d) => d.value)
    let outerRadius: typeof config.outerRadius = r
    if (config.outerRadius !== 0) {
      outerRadius = config.outerRadius
    }
    const arc = d3.arc<d3.PieArcDatum<PieDatum>>()
      .innerRadius(config.innerRadius as any)
      .outerRadius(outerRadius as any)
      .cornerRadius(2)
      .padAngle(0.1)
    const arcs = this.group.selectAll<SVGPathElement, PieDatum>('path').data(pie(this.data))
    arcs.join(enter => enter.append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => this.theme.colors[i]))
  }
}
