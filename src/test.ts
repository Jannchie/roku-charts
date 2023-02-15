import { RokuCal } from './RokuCalendar'
import { type Datum } from './interfaces'
import { RokuBar } from './RokuBar'

RokuBar.New('#test-1').setConfig({
  dataKey: (d: Datum) => d.id,
}).setData([{ id: '3', value: 4 }, { id: 'bbb', value: 1 }, { id: 'ccc', value: 3 }, { id: 'ddd', value: 5 }]).draw({})
RokuBar.New('#test-2').setData([{ id: new Date(1000), value: 4 }, { id: new Date(4000), value: 5 }, { id: new Date(10000), value: 3 }, { id: new Date(20000), value: 8 }]).draw({})
RokuBar.New('#test-3').setData([{ id: new Date(1000), value: 4 }, { id: new Date(4000), value: 5 }, { id: new Date(10000), value: 3 }, { id: new Date(20000), value: 8 }]).draw({})
// RokuChart.New('#test-1').setData([{ id:  1, value: 4 }, { id:  2, value: 1 }, { id:  3, value: 3 }]).draw({})

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
  { date: '2022-01-31', value: 56 },
  // continue with data for the rest of the year...
]
RokuCal.New('#test-4').setData(data).setTheme({}).draw({ durationDays: 365 })
