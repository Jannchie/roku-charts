import type * as d3 from 'd3'
import { type AxisConfig, type Datum } from './interfaces'
import { RokuBar } from './RokuBar'

export interface Config {
  dataKey?: d3.ValueFn<SVGGElement | d3.BaseType, Datum, KeyType>
  catalogAxis?: AxisConfig
  valueAxis?: AxisConfig
}

const chart = RokuBar.New('#test-1').setConfig({
  dataKey: (d: Datum) => d.id,
}).setData([{ id: '3', value: 4 }, { id: 'bbb', value: 1 }, { id: 'ccc', value: 3 }, { id: 'ddd', value: 5 }]).draw({})
RokuBar.New('#test-2').setData([{ id: new Date(1000), value: 4 }, { id: new Date(4000), value: 5 }, { id: new Date(10000), value: 3 }, { id: new Date(20000), value: 8 }]).draw({})
RokuBar.New('#test-3').setData([{ id: new Date(1000), value: 4 }, { id: new Date(4000), value: 5 }, { id: new Date(10000), value: 3 }, { id: new Date(20000), value: 8 }]).draw({})

// RokuChart.New('#test-1').setData([{ id:  1, value: 4 }, { id:  2, value: 1 }, { id:  3, value: 3 }]).draw({})

console.log(chart)

export * from './RokuChart'
export * from './RokuBar'
