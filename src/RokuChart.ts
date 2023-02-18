import { defaultTheme, getTheme, type Theme } from './themes/index'
import * as d3 from 'd3'

export abstract class RokuChart<Datum, Config> {
  abstract draw (config?: Config): void
  config!: Config
  data: Datum[] = []
  theme: Theme = defaultTheme
  wrapperDom?: HTMLDivElement
  shape?: DOMRect
  svg?: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
  public init (selector: string) {
    this.initSVG(selector)
    this.initResizeObserver()
  }

  setData (data: Datum[]): this {
    this.data = data
    return this
  }

  setTheme (theme: Partial<Theme> | string) {
    if (typeof theme === 'string') {
      this.theme = getTheme(theme)
      return this
    }
    this.theme = { ...this.theme, ...theme }
    return this
  }

  setConfig (config: Partial<Config>): this {
    this.config = { ...this.config, ...config }
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
      this.draw()
    })
    resizeObserver.observe(this.wrapperDom)
  }
}
