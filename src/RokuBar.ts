import * as d3 from 'd3'
import { type Datum } from './interfaces'
import { RokuChart } from './RokuChart'

export interface Config {
  idKey: (d: Datum, i?: number, arr?: Datum[]) => string | number | Date
  valueKey: (d: Datum, i?: number, arr?: Datum[]) => number
  animate: number
  stepWidth?: number
  itemCount: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  valueDomain: 'from-zero' | 'auto'
  onHover?: (d: Datum) => void
}

export const defaultBarConfig: Config = {
  idKey: (d) => d.id,
  valueKey: (d) => d.value,
  animate: 500,
  itemCount: 10,
  valueDomain: 'auto',
}

export class RokuBar extends RokuChart<Datum, Config> {
  paddingLeft = 10
  paddingRight = 50
  paddingTop = 10
  paddingBottom = 20
  ayGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, never>
  axGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, never>
  dataGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, never>
  catalogScale?: d3.ScaleBand<never> | d3.ScaleLinear<never, never> | d3.ScaleTime<never, never>
  valueScale?: d3.ScaleLinear<never, never>
  config: Config = defaultBarConfig
  private constructor() {
    super()
  }

  static new(selector: string) {
    const chart = new RokuBar()
    chart.init(selector)
    chart.initGroups()
    return chart
  }

  private initGroups(): void {
    if (this.svg === undefined) {
      throw new Error('svg is not exists')
    }
    this.dataGroup = this.svg.append('g').attr('class', 'data-group')
    this.axGroup = this.svg.append('g').attr('class', 'x-axis-group')
    this.ayGroup = this.svg.append('g').attr('class', 'y-axis-group')
    if (this.wrapperDom === undefined) {
      throw new Error('wrapper is not exists')
    }
  }

  setData(data: Datum[]): this {
    this.data = data
    return this
  }

  private idIsDate(data: Datum[]): data is ({ _id: Date })[] {
    return data[0]._id instanceof Date
  }

  private idIsNumber(data: Datum[]): data is ({ _id: number })[] {
    return typeof data[0]._id === 'number'
  }

  private idIsString(data: Datum[]): data is ({ _id: string })[] {
    return typeof data[0]._id === 'string'
  }


  private isScaleBand(scale: object): scale is d3.ScaleBand<never> {
    return scale.hasOwnProperty('bandwidth')
  }
  private isScaleTime(scale: object): scale is d3.ScaleTime<never, never> {
    return scale.hasOwnProperty('ticks')
  }

  draw(): this {
    if (this.svg === undefined) {
      throw new Error('svg is not exists')
    }
    if (this.axGroup === undefined || this.ayGroup === undefined) {
      throw new Error('axGroup or ayGroup is not exists')
    }
    if (this.dataGroup === undefined) {
      throw new Error('dataGroup is not exists')
    }
    const cfg = this.config

    this.paddingBottom = cfg.paddingBottom ? cfg.paddingBottom : this.paddingBottom
    this.paddingTop = cfg.paddingTop ? cfg.paddingTop : this.paddingTop
    this.paddingLeft = cfg.paddingLeft ? cfg.paddingLeft : this.paddingLeft
    this.paddingRight = cfg.paddingRight ? cfg.paddingRight : this.paddingRight

    const data = this.data.map((d, i, arr) => ({
      ...d,
      _value: cfg.valueKey(d, i, arr),
      _id: cfg.idKey(d, i, arr),
    }))
    const innerWidth = this.shape.width - this.paddingLeft - this.paddingRight
    const innerHeight = this.shape.height - this.paddingBottom - this.paddingTop
    const itemCount = data.length < cfg.itemCount ? data.length : cfg.itemCount
    const cfgStepWidth = (cfg.stepWidth ? cfg.stepWidth : innerWidth / itemCount)
    const scaleX = this.getScaleX(data, cfgStepWidth)
    const stepWidth = this.isScaleBand(scaleX) ? scaleX.step() : cfgStepWidth
    const initYOffset = innerWidth - scaleX.range()[1]!
    this.dataGroup.attr('transform', `translate(${this.paddingLeft}, ${this.paddingTop})`)
    if (this.dataGroup.select('g').empty()) {
      this.dataGroup.append('g').attr('clip-path', 'url(#clip)').attr('class', 'data-group-inner')
    }
    const clipGroup = this.dataGroup.select('g')
    if (d3.select('#clip').empty()) {
      this.svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', innerWidth).attr('height', this.shape.height)
    }
    if (clipGroup.select('g').empty()) {
      clipGroup.append('g').attr('transform', `translate(${initYOffset}, 0)`)
    } else {
      clipGroup.select('g').attr('transform', `translate(${initYOffset}, 0)`)
    }
    const dataGroup = clipGroup.select('g')
    const showingData = data.filter((d) => {
      if (this.isScaleTime(scaleX)) {
        const val = scaleX(d._id as never)
        return val >= -initYOffset && val <= -initYOffset + innerWidth
      }
      return true
    })

    let scaleY = this.getScaleY(showingData)
    const ayGroup = this.ayGroup
      .attr('transform', `translate(${this.shape.width - this.paddingRight}, ${this.paddingTop})`)

    ayGroup.call(d3.axisRight(scaleY).tickFormat(this.theme.valueFormat))
    ayGroup.selectAll('text').attr('fill', this.theme.textColor)
    ayGroup.selectAll('line, path').attr('stroke', this.theme.lineColor)

    dataGroup.selectAll('g').data(data).join(
      (enter) => {
        const res = enter.append('g')
        res.append('rect')
          .attr('class', 'bar-bg')
          .attr('height', innerHeight)
          .attr('width', () => {
            if (this.isScaleBand(scaleX)) {
              return scaleX.bandwidth()
            }
            return stepWidth * (1 - this.theme.gap)
          })
          .attr('fill', this.theme.itemBGColor)
          .attr('x', (d) => {
            if (this.isScaleTime(scaleX)) {
              return scaleX(d._id as never)
            }
            return scaleX(d._id as never) || 0
          })
        res.append('rect')
          .attr('class', 'bar')
          .attr('height', d => d3.max([0, innerHeight - scaleY(d._value)]) ?? 0)
          .attr('width', () => {
            if (this.isScaleBand(scaleX)) {
              return scaleX.bandwidth()
            }
            return stepWidth * 0.8
          })
          // radius
          .attr('rx', this.theme.borderRadius)
          .attr('fill', this.theme.fillColor)
          .attr('x', (d) => {
            if (this.isScaleTime(scaleX)) {
              return scaleX(d._id as never)
            }
            return scaleX(d._id as never) || 0
          })
          .attr('y', (d) => {
            if (this.shape === undefined) {
              throw new Error('shape is not exists')
            }
            return scaleY(d._value)
          })
        return res
      },
      (update) => {
        update.selectAll<never, {
          _id: string | number | Date
          _value: number
        }>('.bar').transition()
          .attr('height', d => d3.max([0, innerHeight - scaleY(d._value as never)]) ?? 0)
          .attr('width', () => {
            if (this.isScaleBand(scaleX)) {
              return scaleX.bandwidth()
            }
            return stepWidth * 0.8
          })
          .attr('x', (d) => {
            if (this.isScaleTime(scaleX)) {
              return scaleX(d._id as never)
            }
            return scaleX(d._id as never) || 0
          })
          .attr('y', (d) => {
            if (this.shape === undefined) {
              throw new Error('shape is not exists')
            }
            return scaleY(d._value)
          })
        update.selectAll<never, {
          _id: string | number | Date
          _value: number
        }>('.bar-bg').transition()
          .attr('height', innerHeight)
          .attr('width', () => {
            if (this.isScaleBand(scaleX)) { return scaleX.bandwidth() }
            return stepWidth * (1 - this.theme.gap)
          })
          .attr('x', (d) => {
            if (this.isScaleTime(scaleX)) {
              return scaleX(d._id as never)
            }
            return scaleX(d._id as never) || 0
          })
        return update
      },
      (exit) => {
        exit.remove()
      },
    )
    if (this.svg.select('.x-axis-group').select('g').empty()) {
      this.axGroup
        .attr('clip-path', 'url(#clip)')
        .attr('transform', `translate(${this.paddingLeft}, ${this.shape.height - this.paddingBottom})`)
        .append('g').attr('class', 'test')
    }
    const axGroup = this.svg.select('.x-axis-group').select('g')
      .call(d3.axisBottom(scaleX as never) as never)
    axGroup.attr('transform', `translate(${initYOffset}, 0)`)
    axGroup.selectAll('text').attr('fill', this.theme.textColor)
    axGroup.selectAll('line, path').attr('stroke', this.theme.lineColor)
    let startX = 0
    const drag = d3.drag()
      .on('start', function (e: d3.D3DragEvent<SVGGElement, unknown, unknown>) {
        const currentX = Number(dataGroup.attr('transform').match(/translate\((-?\d+\.?\d*), (-?\d+\.?\d*)\)/)?.[1])
        if (isNaN(currentX)) {
          return
        }
        startX = e.x - currentX
      })
      .on('drag', (e: d3.D3DragEvent<SVGGElement, unknown, unknown>) => {
        let deltaX = e.x - startX
        if (deltaX > 0) {
          deltaX = 0
        } else if (innerWidth - deltaX > scaleX.range()[1]) {
          deltaX = innerWidth - scaleX.range()[1]
        }
        dataGroup.attr('transform', `translate(${deltaX}, ${0})`)
        axGroup.attr('transform', `translate(${deltaX}, 0)`)
      })
      .on('end', () => {
        const currentX = Number(dataGroup.attr('transform').match(/translate\((-?\d+\.?\d*), (-?\d+\.?\d*)\)/)?.[1])
        const targetX = Math.round(currentX / stepWidth) * (stepWidth)
        dataGroup.transition().attr('transform', `translate(${targetX}, ${0})`)
        axGroup.transition().attr('transform', `translate(${targetX}, 0)`)
        const showingData = data.filter((d) => {
          if (this.isScaleTime(scaleX)) {
            const val = scaleX(d._id as never)
            return val >= -targetX && val <= -targetX + innerWidth - stepWidth
          }
          return true
        })
        scaleY = this.getScaleY(showingData)
        ayGroup.transition().call(d3.axisRight(scaleY).tickFormat(this.theme.valueFormat))
        ayGroup.selectAll('text').attr('fill', this.theme.textColor)
        ayGroup.selectAll('line, path').attr('stroke', this.theme.lineColor)
        dataGroup.selectAll('.bar').transition().attr('height', (d) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return d3.max([0, innerHeight - scaleY((d as any)._value)]) || 0
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).attr('y', (d) => scaleY((d as any)._value))
        d3.selectAll('.hover-line').remove()
      });
    this.svg.call(drag as never)
    if (cfg.onHover) {
      let lastDatum: Datum | null = null
      this.svg.on('pointermove', (e: PointerEvent) => {
        e.stopPropagation()
        const target = e.target
        if (target) {
          const datum = d3.select<never, Datum>(target as never).datum()
          if (datum && cfg.onHover && typeof datum._id !== 'undefined' && lastDatum !== datum) {
            dataGroup.selectAll<never, Datum>('line').data([datum], d => d._id).join(
              (enter) => enter.insert('line', ":first-child")
                .attr('class', 'hover-line')
                .attr('stroke', this.theme.lineColor)
                .attr('stroke-width', 1)
                .attr('transform', `translate(${stepWidth * (1 - this.theme.gap) / 2}, 0)`)
                .attr('x1', d => scaleX(d._id as never) ?? 0)
                .attr('y1', 0)
                .attr('x2', d => scaleX(d._id as never) ?? 0)
                .attr('y2', scaleY(datum._value) - 4 || 0),
            )
            lastDatum = datum
            cfg.onHover(datum)
          }
        }
      })
    }
    return this
  }

  private getScaleY(data: { _value: number }[]) {
    if (this.shape === undefined) {
      throw new Error('shape is not exists')
    }
    const domain = [0, d3.max(data, (d) => d._value) || 0]
    const maxDomain = domain[1]
    const minDomain = d3.min(data, (d) => d._value) || 0
    if (this.config.valueDomain === 'auto') {
      domain[0] = d3.max([0, maxDomain - (maxDomain - minDomain) * 2]) || 0
    }
    const scale = d3.scaleLinear().domain(domain).range([0, this.shape.height - this.paddingTop - this.paddingBottom].reverse()).nice()
    return scale
  }

  private getScaleX(data: { _value: number; _id: string | number | Date }[], barWidth = 20) {
    let scale
    if (this.idIsDate(data)) {
      const domain = d3.extent(data, (d) => d._id)
      const deltaTime = (domain[1] as Date).getTime() - (domain[0] as Date).getTime()
      const everyDelta = data.map((d, i) => {
        if (i === 0) {
          return Infinity
        }
        return (d._id as Date).getTime() - (data[i - 1]._id as Date).getTime()
      })
      const minDeltaTime = d3.min(everyDelta) ?? 0
      const range = barWidth * deltaTime / minDeltaTime + barWidth
      if (domain[0] === undefined || domain[1] === undefined) {
        throw new Error('domain is not exists')
      }
      domain[1] = new Date((domain[1] as Date).getTime() + minDeltaTime)
      scale = d3.scaleTime().domain(domain).range([0, range])
    }
    if (this.idIsString(data)) {
      scale = d3.scaleBand().domain(d3.map(data, (d) => d._id)).range([0, this.shape.width - this.paddingLeft - this.paddingRight]).padding(0.1)
    }
    if (this.idIsNumber(data)) {
      const domain = d3.extent(data, (d) => d._id)
      if (domain[0] === undefined || domain[1] === undefined) {
        throw new Error('domain is not exists')
      }
      scale = d3.scaleLinear().domain(domain).range([0, this.shape.width - this.paddingLeft - this.paddingRight]).nice()
    }
    if (scale === undefined) {
      throw new Error('cannot get scale')
    }
    return scale
  }
}
