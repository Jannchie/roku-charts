import { RokuCal } from './RokuCalendar'
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

const data = [
  { date: '2022-01-01', value: 5 },
  { date: '2022-01-02', value: 8 },
  { date: '2022-01-03', value: 12 },
  { date: '2022-01-04', value: 15 },
  { date: '2022-01-05', value: 20 },
  { date: '2022-01-06', value: 25 },
  { date: '2022-01-07', value: 18 },
  { date: '2022-01-08', value: 10 },
  { date: '2022-01-09', value: 8 },
  { date: '2022-01-10', value: 15 },
  { date: '2022-01-11', value: 20 },
  { date: '2022-01-12', value: 28 },
  { date: '2022-01-13', value: 30 },
  { date: '2022-01-14', value: 22 },
  { date: '2022-01-15', value: 18 },
  { date: '2022-01-16', value: 15 },
  { date: '2022-01-17', value: 10 },
  { date: '2022-01-18', value: 12 },
  { date: '2022-01-19', value: 18 },
  { date: '2022-01-20', value: 25 },
  { date: '2022-01-21', value: 30 },
  { date: '2022-01-22', value: 35 },
  { date: '2022-01-23', value: 28 },
  { date: '2022-01-24', value: 20 },
  { date: '2022-01-25', value: 15 },
  { date: '2022-01-26', value: 12 },
  { date: '2022-01-27', value: 10 },
  { date: '2022-01-28', value: 18 },
  { date: '2022-01-29', value: 22 },
  { date: '2022-01-30', value: 28 },
  { date: '2022-01-31', value: 35 },
  // continue with data for the rest of the year...
]
console.log(data)
RokuCal.New('#test-4').setData(data).setConfig({
}).draw()

export * from './RokuChart'
export * from './RokuBar'
