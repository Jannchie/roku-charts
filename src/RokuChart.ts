import { defaultTheme, getTheme, type Theme } from './themes/index'
import * as d3 from 'd3'
import { type Datum } from './interfaces'

export abstract class RokuChart {
  abstract setData (data: Datum[]): this
  abstract setConfig (config: any): this
  abstract draw (options?: { animate: boolean }): void
  theme: Theme = defaultTheme
  wrapperDom?: HTMLDivElement
  shape?: DOMRect
  svg?: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  public init (selector: string) {
    this.initSVG(selector)
    this.initResizeObserver()
  }

  setTheme (theme: Partial<Theme> | string) {
    if (typeof theme === 'string') {
      this.theme = getTheme(theme)
      return this
    }
    this.theme = { ...this.theme, ...theme }
    return this
  }

  private initSVG (selector: string) {
    const wrapper = d3.select<HTMLDivElement, unknown>(selector)
    const wrapperDom = wrapper.node()
    if (wrapperDom === null) {
      throw new Error('wrapper is not exists')
    }
    this.wrapperDom = wrapperDom
    this.shape = wrapperDom.getBoundingClientRect()
    this.svg = wrapper.append('svg').attr('width', '100%').attr('height', '100%')
  }

  private initResizeObserver () {
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
}
