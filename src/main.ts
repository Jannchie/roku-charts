import { ChartOptions } from './interfaces/ChartOptions'
import { draw } from './draw'

const o1: ChartOptions<number> = {
  width: 500,
  height: 300,
  margin: {
    top: 20,
    right: 50,
    bottom: 30,
    left: 50
  },
  yAxis: {
    type: 'linear',
    value: (d) => d,
    position: 'right'
  },
  xAxis: {
    type: 'category',
    value: (d) => d.toFixed()
  },
  data: [1, 5, 2, 3, 4],
  series: {
    type: 'bar'
  },
  animate: {}
}

const o2: ChartOptions<number> = {
  width: 500,
  height: 300,
  margin: {
    top: 20,
    right: 50,
    bottom: 30,
    left: 50
  },
  xAxis: {
    type: 'linear',
    value: (d) => d
  },
  yAxis: {
    type: 'category',
    value: (d) => d.toFixed()
  },
  data: [1, 5, 2, 3, 4],
  series: {
    type: 'bar'
  },
  animate: {}
}

const o3: ChartOptions<{name: string, value: number}> = {
  width: 500,
  height: 300,
  margin: {
    top: 20,
    right: 50,
    bottom: 30,
    left: 50
  },
  xAxis: {
    type: 'category',
    value: (d) => d.name
  },
  yAxis: {
    type: 'linear',
    value: (d) => d.value
  },
  data: [{ name: '甘', value: 1 }, { name: '文', value: 5 }, { name: '崔', value: 3 }],
  series: [
    {
      type: 'bar'
    }
  ],
  animate: {}
}

draw('#app', o1)
draw('#app', o2)
draw('#app', o3)
