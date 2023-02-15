import { type Datum } from './interfaces'
import { type Config } from './main'

export abstract class RokuChart {
  abstract setData: (data: Datum[]) => this
  abstract setConfig: (config: Config) => this
  static New: (selector: string) => RokuChart
}
