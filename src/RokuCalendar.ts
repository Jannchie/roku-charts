import { type Datum } from './interfaces'
import { RokuChart } from './RokuChart'
import * as d3 from 'd3'

interface RokuCalendarConfig {
  sideLength?: number
  gap?: number
  padding?: number
  outlineColor?: string
  outlineWidth?: string
  borderRadius?: string
  outlineOffset?: string
  nanFillColor?: string
}
export class RokuCal extends RokuChart {
  data: Datum[] = []
  config: Required<RokuCalendarConfig> = {
    sideLength: 10,
    gap: 3,
    padding: 50,
    outlineColor: 'rgba(27, 31, 35, 0.06)',
    outlineWidth: '1px',
    borderRadius: '2px',
    outlineOffset: '-1px',
    nanFillColor: '#ebedf0',
  }

  weekScale?: d3.ScaleBand<string>
  dataGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  xAxisGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  yAxisGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  setData (data: Datum[]) {
    this.data = data
    return this
  }

  private constructor () {
    super()
  }

  static New (selector: string) {
    const chart = new RokuCal()
    chart.init(selector)
    chart.initGroup()
    return chart
  }

  private initGroup () {
    if (this.svg === undefined) {
      throw new Error('svg is not exists')
    }
    this.dataGroup = this.svg.append('g').attr('class', 'data-group').attr('transform', `translate(${this.config.padding}, ${this.config.padding})`)
    this.xAxisGroup = this.svg.append('g').attr('class', 'x-axis-group').attr('transform', `translate(${this.config.padding}, ${this.config.padding})`)
    this.yAxisGroup = this.svg.append('g').attr('class', 'y-axis-group').attr('transform', `translate(${this.config.padding}, ${this.config.padding})`)
  }

  setConfig (config: RokuCalendarConfig) {
    this.config = {
      sideLength: config.sideLength ?? this.config.sideLength,
      gap: config.gap ?? this.config.gap,
      padding: config.padding ?? this.config.padding,
      outlineColor: config.outlineColor ?? this.config.outlineColor,
      outlineWidth: config.outlineWidth ?? this.config.outlineWidth,
      borderRadius: config.borderRadius ?? this.config.borderRadius,
      outlineOffset: config.outlineOffset ?? this.config.outlineOffset,
      nanFillColor: config.nanFillColor ?? this.config.nanFillColor,
    }
    return this
  }

  getDayFromDate (d: Date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[d.getDay()]
  }

  weeksAgo (date: Date) {
    const today = new Date()
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    let weeksAgo = Math.floor(daysAgo / 7)
    if (today.getDay() < date.getDay()) {
      weeksAgo++
    }
    return Math.max(weeksAgo, 0)
  }

  draw () {
    if (this.svg === undefined) {
      throw new Error('svg is not exists')
    }
    if (this.shape === undefined) {
      throw new Error('shape is not exists')
    }
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    this.weekScale = d3.scaleBand().domain(days).range([0, this.shape.width])
    interface CalData {
      value?: number
      day: string
      week: string
      date: string
    }
    const calData = this.data.map<CalData>(d => {
      const date = new Date(d.date)
      return {
        value: d.value,
        day: this.getDayFromDate(date),
        week: String(this.weeksAgo(date)),
        date: d.date,
      }
    })

    const valueDomain = d3.extent(calData, d => d.value)
    const weekDomain = calData.map(d => d.week)
    if (weekDomain[0] === undefined || valueDomain[0] === undefined) {
      throw new Error('domain\'s value is undefined')
    }

    const cols = 7
    const rows = Math.ceil(weekDomain.length / cols) + 1
    let boxA = d3.min([this.shape.width / rows, this.shape.height / cols]) ?? 0
    if (this.config.sideLength !== undefined) {
      boxA = this.config.sideLength + this.config.gap
    }
    // fill no data to calData, let the calendar looks like a full week
    console.log(boxA)
    const firstWeek = calData[0].week
    const lastWeek = calData[calData.length - 1].week
    const countFirstWeek = calData.filter(d => d.week === firstWeek).length
    const countLastWeek = calData.filter(d => d.week === lastWeek).length
    if (countFirstWeek < 7) {
      for (let i = 0; i < 7 - countFirstWeek; i++) {
        calData.unshift({
          value: undefined,
          day: days[i],
          week: firstWeek,
          date: '',
        })
      }
    }
    if (countLastWeek < 7) {
      for (let i = 0; i < 7 - countLastWeek; i++) {
        calData.push({
          value: undefined,
          day: days[6 - i],
          week: lastWeek,
          date: '',
        })
      }
    }
    const monthIdx2Name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const scalePadding = this.config.gap / (this.config.gap + this.config.sideLength)
    console.log(scalePadding * 14, this.config.gap)
    this.svg.attr('width', boxA * rows + this.config.padding * 2).attr('height', boxA * cols + this.config.padding * 2)
    const colorScale = d3.scaleSequential(d3.interpolateBuGn).domain(valueDomain)
    const weekScale = d3.scaleBand().domain(weekDomain).range([0, boxA * rows]).round(true).paddingInner(scalePadding)
    const dayScale = d3.scaleBand().domain(days).range([0, boxA * cols]).round(true).paddingInner(scalePadding)
    this.yAxisGroup?.call(d3.axisLeft(dayScale).tickValues(['Mon', 'Wed', 'Fri']))
    this.xAxisGroup?.call(d3.axisTop(weekScale).tickFormat(d => {
      const weeks = Number(d)
      const now = new Date()
      const date = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
      return monthIdx2Name[date.getMonth()]
    }))
    this.dataGroup?.selectAll<SVGGElement, CalData>('g').data<CalData>(calData, d => d.date).join((enter) => {
      const e = enter.append('g').attr('transform', d => `translate(${weekScale(d.week) ?? 0}, ${dayScale(d.day) ?? 0} )`)
      e.append('rect')
        .attr('rx', 2)
        .attr('width', weekScale.bandwidth())
        .attr('height', dayScale.bandwidth())
        .attr('fill', d => { return d.value ? colorScale(d.value) : this.config.nanFillColor })
        .attr('style', `outline: 1px solid ${this.config.outlineColor}; border-radius: ${this.config.borderRadius};outline-offset: ${this.config.outlineOffset};`)
      return e
    })
  }
}
