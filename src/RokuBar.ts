import * as d3 from 'd3'
import { type Datum } from './interfaces'
import { type RokuChart } from './RokuChart'
import { getMinDifference } from './utils/getMinDifference'
import { type Config } from './main'

export class RokuBar implements RokuChart {
  padding: number = 50
  ayGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  axGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  dataGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  svg?: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  shape?: DOMRect
  wrapperDom?: HTMLDivElement
  catalogScale?: any
  valueScale?: any
  data: Datum[] = []
  config: Config = {}
  private constructor () { }

  static New (selector: string): RokuBar {
    const chart = new RokuBar()
    chart.initGroups(selector)
    // resize
    return chart
  }

  private initGroups (selector: string): void {
    const wrapper = d3.select<HTMLDivElement, unknown>(selector)
    const wrapperDom = wrapper.node()
    if (wrapperDom === null) {
      throw new Error('wrapper is not exists')
    }
    this.wrapperDom = wrapperDom
    this.shape = wrapperDom.getBoundingClientRect()
    this.svg = wrapper.append('svg').attr('width', '100%').attr('height', '100%')
    this.dataGroup = this.svg.append('g').attr('class', 'data-group')
    this.axGroup = this.svg.append('g').attr('class', 'x-axis-group')
    this.ayGroup = this.svg.append('g').attr('class', 'y-axis-group')
    if (this.wrapperDom === undefined) {
      throw new Error('wrapper is not exists')
    }
    let init = true
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.shape = entry.contentRect
      }
      if (init) {
        init = false
        return
      }
      this.draw({
        animate: false,
      })
    })
    resizeObserver.observe(this.wrapperDom)
  }

  setData (data: Datum[]): this {
    this.data = data
    return this
  }

  setConfig (config: Config): this {
    this.config = config
    return this
  }

  isBandScale (scale: any): scale is d3.ScaleBand<any> {
    return scale.bandwidth !== undefined
  }

  isLinearScale (scale: any): scale is d3.ScaleLinear<any, any> {
    return scale.rangeRound !== undefined
  }

  isTimeScale (scale: any): scale is d3.ScaleTime<any, any> {
    return scale.rangeRound !== undefined
  }

  isLogScale (scale: any): scale is d3.ScaleLogarithmic<any, any> {
    return scale.base !== undefined
  }

  draw ({ animate = true }: { animate?: boolean }): this {
    const data = this.data
    this.updateAxis({ animate })
    const updateAttrs = (g: d3.Selection<any, Datum, SVGGElement, unknown>, r: d3.Selection<SVGRectElement, Datum, SVGGElement, unknown>): void => {
      if (animate ?? true) {
        console.log('animate', g)
        r = r.transition('a').delay((_, i) => i * 50) as any
        g = g.transition('b').delay((_, i) => i * 50) as any
      }
      r.attr('fill', 'DarkSlateGray')
        .attr('width', (_) => {
          if (this.isBandScale(this.catalogScale)) {
            return this.catalogScale.bandwidth()
          } else {
            const width = this.getWidth(data)
            // TODO: with as value
            return width
          }
        })
        .attr('height', d => {
          if (this.isBandScale(this.valueScale)) {
            return this.valueScale.bandwidth()
          } else {
            return (this.shape?.height ?? 0) - this.padding - this.valueScale(d.value)
          }
        })
      g.attr('transform', d => {
        if (this.isBandScale(this.catalogScale)) {
          return `translate(${this.catalogScale(d.id) ?? 0}, ${this.valueScale(d.value) - (this.shape?.height ?? 0) + this.padding})`
        }
        let offset = 0
        offset = this.getWidth(data) / 2
        const x = this.catalogScale(d.id) as number - offset
        return `translate(${x}, ${(this.valueScale(d.value) as number) + this.padding - (this.shape?.height ?? 0)})`
      })
    }
    this.dataGroup?.selectAll<SVGGElement, Datum>('g')
      .data(data, this.config.dataKey ?? ((_: Datum, i) => i))
      .join(
        enter => {
          const g = enter.append('g').attr('opacity', 1).attr('transform', d => {
            let offset = 0
            if (this.isBandScale(this.catalogScale)) {
              return `translate(${this.catalogScale(d.id) ?? 0}, ${(this.valueScale.range()[0] as number) + this.padding - (this.shape?.height ?? 0)})`
            } else {
              offset = this.getWidth(data) / 2
            }
            const x = this.catalogScale(d.id) as number - offset
            return `translate(${x}, ${(this.valueScale.range()[0] as number) + this.padding - (this.shape?.height ?? 0)})`
          })
          const r = g.append('rect').attr('width', () => {
            if (this.isBandScale(this.catalogScale)) {
              return this.catalogScale.bandwidth()
            } else {
              const width = this.getWidth(data)
              console.log(width)
              return width
            }
          }).attr('height', 0)
          updateAttrs(g, r)
          return g
        }, update => {
          updateAttrs(update, update.select('rect'))
          return update
        }, exit => {
          exit.transition().attr('opacity', 0).remove()
        })
    return this
  }

  private getWidth (data: Datum[], padding: number = 0.1): number {
    const range = this.catalogScale.range()
    const domain = this.catalogScale.domain()
    const minDiff = getMinDifference(data, (d) => d.id)
    const width = (range[1] - range[0]) / (domain[1] - domain[0]) * minDiff
    console.log('width', width)
    return width * (1 - padding)
  }

  private updateAxis ({ animate }: { animate: boolean }): void {
    const data = this.data
    this.dataGroup?.attr('transform', `translate(${this.padding}, ${(this.shape?.height ?? 0) - this.padding})`)
    this.axGroup?.attr('transform', `translate(${this.padding}, ${(this.shape?.height ?? 0) - this.padding})`)
    this.ayGroup?.attr('transform', `translate(${this.padding}, 0)`)
    if (data.length === 0) {
      throw new Error('data is empty')
    }
    if (this.axGroup === undefined || this.ayGroup === undefined || this.shape === undefined) {
      throw new Error('not initialized')
    }
    const datum = data[0]
    const domain = d3.extent(data, d => d.id)
    if (domain[0] === undefined || domain[1] === undefined) {
      throw new Error('domain is undefined')
    }
    if (datum.id instanceof Date) {
      const domainDate = domain as Date[]
      domainDate[0] = new Date(domainDate[0].getTime() - getMinDifference(this.data, (d) => d.id) / 2)
      domainDate[1] = new Date(domainDate[1].getTime() + getMinDifference(this.data, (d) => d.id) / 2)
      this.catalogScale = d3.scaleTime().range([0, this.shape.width - this.padding * 2]).domain(domainDate)
    } else if (typeof datum.id === 'number') {
      const domainNumber = domain as number[]
      this.catalogScale = d3.scaleLinear().range([0, this.shape.width - this.padding * 2]).domain(domainNumber)
    } else if (typeof datum.id === 'string') {
      this.catalogScale = d3.scaleBand().range([0, this.shape.width - this.padding * 2]).domain(data.map(d => (d as { id: string }).id)).padding(0.1)
    }
    const callXAxis = (): void => {
      const xAxis = d3.axisBottom(this.catalogScale)
      if (animate) {
        this.axGroup?.transition().call(xAxis)
      } else {
        this.axGroup?.call(xAxis)
      }
    }

    callXAxis()
    const callYAxis = (): void => {
      const yAxis = d3.axisLeft(this.valueScale)
      if (animate) {
        this.ayGroup?.transition().call(yAxis)
      } else {
        this.ayGroup?.call(yAxis)
      }
    }
    if (datum.value instanceof Date) {
      this.valueScale = d3.scaleTime().range([this.shape.height - this.padding, this.padding])
    } else if (typeof datum.value === 'number') {
      const domain = d3.extent(data, d => (d as { value: number }).value)
      domain[0] = 0
      if (domain[0] === undefined || domain[1] === undefined) {
        throw new Error('domain is undefined')
      }
      this.valueScale = d3.scaleLinear().range([this.shape.height - this.padding, this.padding]).domain(domain)
    } else if (typeof datum.value === 'string') {
      this.valueScale = d3.scaleBand().range([this.shape.height - this.padding, this.padding]).domain(data.map(d => (d as { value: string }).value))
    }
    callYAxis()
  }
}
