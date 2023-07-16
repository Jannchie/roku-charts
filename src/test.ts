import { RokuPie } from './RokuPie'
import { RokuCal } from './RokuCalendar'
import { type Datum } from './interfaces'
import { RokuBar } from './RokuBar'
import * as d3 from 'd3'
import { CalData } from './configs'
window.d3 = d3
const data = [
  { date: '2022-01-01', value: 34 },
  { date: '2022-01-02', value: 8 },
  { date: '2022-01-04', value: 15 },
  { date: '2022-01-05', value: 20 },
  { date: '2022-01-07', value: 18 },
  { date: '2022-01-08', value: 10 },
  { date: '2022-01-10', value: 15 },
  { date: '2022-01-12', value: 28 },
  { date: '2022-01-13', value: 30 },
  { date: '2022-01-17', value: 10 },
  { date: '2022-01-18', value: 12 },
  { date: '2022-01-19', value: 18 },
  { date: '2022-01-20', value: 25 },
  { date: '2022-01-21', value: 30 },
  { date: '2022-01-23', value: 28 },
  { date: '2022-01-25', value: 15 },
  { date: '2022-01-27', value: 10 },
  { date: '2022-01-29', value: 22 },
  { date: '2022-01-30', value: 28 },
  { date: '2022-01-31', value: 52 },
  // continue with data for the rest of the year...
] as CalData[]
RokuBar.new('#test-1').setConfig({ idKey: (d: Datum) => d.id }).setData([{ id: '3', value: 4 }, { id: 'bbb', value: 1 }, { id: 'ccc', value: 3 }, { id: 'ddd', value: 5 }]).draw()
const a = RokuBar.new('#test-3').setData(data).setConfig({
  idKey: (d) => d3.timeParse('%Y-%m-%d')(d.date)!, onHover: () => { },
}).draw()

setTimeout(() => {
  a.setConfig({
    itemCount: 20
  }).draw()
}, 1000)


// RokuChart.New('#test-1').setData([{ id:  1, value: 4 }, { id:  2, value: 1 }, { id:  3, value: 3 }]).draw({})


const c = RokuCal.New('#test-4').setTheme({ visualMap: d3.schemePuBu[5] as string[] }).setData(data).setTheme({ nanFillColor: 'var(--r-color-2)' })
c.draw({ durationDays: 365 })
setTimeout(() => {
  const data = [
    { date: '2022-01-01', value: 34 },
    { date: '2022-01-30', value: 28 },
  ] as CalData[]
  c.setData(data).draw({ durationDays: 365 })
}, 3000)

const cal = RokuCal.New('#test-5').setTheme('dark').setData(data).setTheme({})
cal.draw({ durationDays: 365 })

// setInterval(() => {
//   cal.setConfig({ sideLength: cal.config.sideLength + 1 }).draw()
// }, 1000)

const pieData = [
  { key: '2022-01-01', value: 1 },
  { key: '2022-01-03', value: 1 },
  { key: '2022-01-04', value: 1 },
  { key: '2022-01-05', value: 3 },
  { key: '2022-01-06', value: 1 },
]

const pie = RokuPie.new('#test-6').setConfig({ padding: 50 }).setTheme({}).setData(pieData)
pie.draw()
