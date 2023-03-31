import { type Datum } from './interfaces'
import { RokuChart } from './RokuChart'
import * as d3 from 'd3'
import { arrow, computePosition, offset } from '@floating-ui/dom'
import { type RokuCalendarConfig, type CalData, defaultCalendarConfig } from './configs'

export class RokuCal extends RokuChart<CalData, RokuCalendarConfig> {
  data: CalData[] = []
  config: Required<RokuCalendarConfig> = defaultCalendarConfig

  weekScale?: d3.ScaleBand<string>
  dataGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  xAxisGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  yAxisGroup?: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  selector?: string

  private constructor () {
    super()
  }

  static New (selector: string) {
    const chart = new RokuCal()
    chart.selector = selector
    chart.init(selector)
    chart.initGroup()
    return chart
  }

  override setData (data: any[]): this {
    this.data = data
    return this
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
    this.config = { ...this.config, ...config }
    return this
  }

  getDayFromDate (d: Date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[d.getDay()]
  }

  weeksAgo (date: Date, latestDate: Date = new Date()) {
    const daysAgo = Math.floor((latestDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    let weeksAgo = Math.floor(daysAgo / 7)
    if (latestDate.getDay() < date.getDay()) {
      weeksAgo++
    }
    return Math.max(weeksAgo, 0)
  }

  draw (cfg?: RokuCalendarConfig) {
    const config = { ...this.config, ...cfg }
    if (this.svg === undefined) {
      throw new Error('svg is not exists')
    }
    if (this.shape === undefined) {
      throw new Error('shape is not exists')
    }
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    this.weekScale = d3.scaleBand().domain(days).range([0, this.shape.width])
    let [startDate, endDate] = d3.extent<Datum, Date>(this.data, d => new Date(d.date))
    if (!startDate) {
      startDate = new Date()
    }
    if (!endDate) {
      endDate = new Date()
    }
    if (config.durationDays !== 0) {
      if (startDate > new Date(endDate.getTime() - config.durationDays * 86400000)) {
        startDate = new Date(endDate.getTime() - config.durationDays * 86400000)
      }
    }
    const dateRange = this.getDateRange(startDate, endDate)
    const dataMap = new Map(this.data.map(({ date, value }) => [new Date(date).getTime(), value]))
    this.fillResults(dataMap, dateRange)
    const latestDate = d3.max(this.data, da => new Date(da.date)) ?? new Date()
    if (config.durationDays !== 0) {
      this.data = this.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).filter(d => new Date(d.date).getTime() > latestDate.getTime() - config.durationDays * 86400000)
    }
    const calData = this.data.map<CalData>(d => {
      const date = new Date(d.date)
      return {
        value: d.value,
        day: this.getDayFromDate(date),
        week: String(this.weeksAgo(date, latestDate)),
        date: d.date,
      }
    })
    const valueDomain = d3.extent(calData, d => d.value)
    const weekDomain = calData.map(d => d.week)
    if (valueDomain[0] === undefined || weekDomain[0] === undefined) {
      throw new Error('data is empty')
    }
    const cols = 7
    const rows = new Set(weekDomain).size
    let boxA = d3.min([this.shape.width / rows, this.shape.height / cols]) ?? 0
    if (config.sideLength !== undefined) {
      boxA = config.sideLength + config.gap
    }
    if (config.padLeft) {
      const firstWeek = calData[0].week
      const countFirstWeek = calData.filter(d => d.week === firstWeek).length
      if (countFirstWeek < 7) {
        for (let i = 0; i < 7 - countFirstWeek; i++) {
          const date = new Date(new Date(calData[0].date).getTime() - 1000 * 60 * 60 * 24)
          calData.unshift({
            value: undefined,
            day: days[i],
            week: firstWeek,
            date: d3.timeFormat('%Y-%m-%d')(date),
          })
        }
      }
    }
    if (config.padRight) {
      const lastWeek = calData[calData.length - 1].week
      const countLastWeek = calData.filter(d => d.week === lastWeek).length
      if (countLastWeek < 7) {
        for (let i = 0; i < 7 - countLastWeek; i++) {
          const date = new Date(new Date(calData[calData.length - 1].date).getTime() + 1000 * 60 * 60 * 24)
          calData.push({
            value: undefined,
            day: days[6 - i],
            week: lastWeek,
            date: d3.timeFormat('%Y-%m-%d')(date),
          })
        }
      }
    }
    const monthIdx2Name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const scalePadding = config.gap / (config.gap + config.sideLength)
    this.svg.attr('width', boxA * rows + config.padding).attr('height', boxA * cols + config.padding)
    const visualMapList = this.theme.visualMap
    const visualMapListLength = visualMapList.length
    const colorScale = d3
      .scaleThreshold([...visualMapList])
      .domain(visualMapList.map((_, i) => (1 + i) / visualMapListLength * (valueDomain[1] - valueDomain[0]) + valueDomain[0]))
    const weekScale = d3.scaleBand().domain(weekDomain).range([0, boxA * rows]).round(true).paddingInner(scalePadding)
    const dayScale = d3.scaleBand().domain(days).range([0, boxA * cols]).round(true).paddingInner(scalePadding)
    this.yAxisGroup?.transition().call(d3.axisLeft(dayScale)
      .tickPadding(0)
      .tickValues(['Mon', 'Wed', 'Fri']))
    this.yAxisGroup?.selectAll('.domain').remove()
    this.yAxisGroup?.selectAll('.tick').select('line').remove()
    this.yAxisGroup?.selectAll('.tick').select('text').attr('style', `color: ${this.theme.textColor}`)
    const xAxisTickFormat = (d: string) => {
      const weeks = Number(d)

      const date = new Date(latestDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
      return monthIdx2Name[date.getMonth()]
    }
    this.xAxisGroup?.transition().call(d3.axisTop(weekScale)
      .tickValues(weekScale.domain().filter((_, i) => {
        const domain = weekScale.domain()
        return i !== 0 && xAxisTickFormat(domain[i]) !== xAxisTickFormat(domain[i - 1])
      }))
      .tickPadding(0)
      .tickFormat(xAxisTickFormat))
    this.xAxisGroup?.style('font-size', `${config.fontSize}px`)
    this.xAxisGroup?.selectAll('.tick').select('text').attr('style', `color: ${this.theme.textColor}`)
    this.xAxisGroup?.selectAll('.domain').remove()
    this.xAxisGroup?.selectAll('.tick').select('line').remove()
    if (!this.dataGroup) return
    const binded = this.dataGroup.selectAll<SVGGElement, CalData>('g').data<CalData>(calData, d => d.date)
    binded.join((enter) => {
      const e = enter.append('g').attr('transform', d => `translate(${weekScale(d.week) ?? 0}, ${dayScale(d.day) ?? 0})`)
      let rect: any = e.append('rect')
      if (config.animate) {
        rect = rect.transition().duration(this.theme.animateDuration).delay((_: CalData, i: number) => this.theme.animateDelay * i / e.data().length * Math.random() * this.theme.animateRandom)
      }
      rect.attr('rx', this.theme.borderRadius)
        .attr('width', weekScale.bandwidth())
        .attr('height', dayScale.bandwidth())
        .attr('fill', (d: CalData) => {
          return d.value ? colorScale(d.value) : this.theme.nanFillColor
        })
        .attr('style', `outline: 1px solid ${this.theme.outlineColor}; border-radius: ${this.theme.borderRadius}px; outline-offset: ${this.theme.outlineOffset}px;`)
      e.nodes().forEach((dom) => {
        dom.addEventListener('mouseenter', () => {
          const data = d3.select<SVGGElement, CalData>(dom).datum()
          const tooltipsSelection = d3.select(this.selector ?? 'body').append('div')
            .style('position', 'absolute')
            .style('padding', '0.2rem 0.4rem')
            .style('font-size', `${config.fontSize}px`)
            .style('color', '#fff')
            .style('background', '#111')
            .style('border-radius', '0.2rem')
            .attr('id', 'roku-tooltip')
            .html(config.tooltipFormatter(data))
          const arrowEl = tooltipsSelection.append('div')
            .style('position', 'absolute')
            .style('width', '10px')
            .style('height', '10px')
            .style('background', '#111')
            .style('transform', 'rotate(45deg)').node()
          const tooltips = tooltipsSelection.style('opacity', 0).transition().duration(100).style('opacity', 1).node()
          if (tooltips && arrowEl) {
            void computePosition(dom, tooltips, { placement: 'top', middleware: [offset(10), arrow({ element: arrowEl })] }).then((d) => {
              Object.assign(tooltips.style, {
                top: `${d.y}px`,
                left: `${d.x}px`,
              })
              const { x } = d.middlewareData?.arrow ?? { x: 0, y: 0 }
              Object.assign(arrowEl.style, {
                left: `${x ?? 0}px`,
                bottom: `${-arrowEl.offsetHeight / 2}px`,
              })
            })
          }
        })
        dom.addEventListener('mouseleave', () => {
          d3.select(this.selector ?? 'body').selectAll('#roku-tooltip').transition().duration(100).style('opacity', 0).remove()
        })
      })
      return e
    }, (update) => {
      update.transition().attr('transform', d => {
        return `translate(${weekScale(d.week) ?? 0}, ${dayScale(d.day) ?? 0})`
      })
      update.selectAll<SVGRectElement, CalData>('rect').data(update.data(), d => d.date).attr('rx', this.theme.borderRadius)
        .attr('width', weekScale.bandwidth())
        .attr('height', dayScale.bandwidth())
        .transition().duration(100)
        .attr('fill', (d: CalData) => {
          return d.value ? colorScale(d.value) : this.theme.nanFillColor
        })
        .attr('style', `outline: 1px solid ${this.theme.outlineColor}; border-radius: ${this.theme.borderRadius}px; outline-offset: ${this.theme.outlineOffset}px;`)
      return update
    }, (exit) => {
      return exit.remove()
    })
  }

  private fillResults (dataMap: Map<number, any>, dateRange: Date[]) {
    const result: CalData[] = []
    for (const date of dateRange) {
      const latest = this.data.length === 0 ? new Date() : new Date(this.data[this.data.length - 1].date)
      if (!dataMap.has(date.getTime())) {
        result.push({
          date: date.toISOString().slice(0, 10),
          value: undefined,
          day: this.getDayFromDate(date),
          week: String(this.weeksAgo(date, latest)),
        })
      } else {
        result.push({
          date: date.toISOString().slice(0, 10),
          value: dataMap.get(date.getTime()),
          day: this.getDayFromDate(date),
          week: String(this.weeksAgo(date, latest)),
        })
      }
    }
    this.data = result
  }

  private getDateRange (startDate: Date, endDate: Date) {
    const dateRange = []
    for (let date = new Date(startDate.getTime()); date.getTime() <= endDate.getTime(); date.setDate(date.getDate() + 1)) {
      dateRange.push(new Date(date))
    }
    return dateRange
  }
}
