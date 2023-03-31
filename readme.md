# Roku Charts

[![CodeTime badge](https://img.shields.io/endpoint?style=social&url=https%3A%2F%2Fapi.codetime.dev%2Fshield%3Fid%3D2%26project%3Droku-charts%26in%3D0)](https://codetime.dev)

Roku Charts is a lightweight chart library that provides a simple and flexible way to create charts in your web applications. It is built using D3.js and leverages the power of SVG to create high-quality, interactive charts.

With Roku Charts, you can create a wide variety of chart types, including bar charts, calendar charts, and more (in the future). The library provides a simple and intuitive API for configuring and customizing your charts, making it easy to create charts that meet your exact requirements.

It is designed to be lightweight. This means that it should not slow down the loading speed of the page and can provide a smooth and responsive user experience.

Roku Charts also supports scaling with the window, which means that it can automatically adjust the size and layout of the chart to fit the available space. This can be particularly useful for creating responsive and adaptive user interfaces.

In addition, Roku Charts provides support for smooth animations, which can be used to enhance the visual appeal and interactivity of your charts. Animations can be used to highlight data points, provide context for changes over time, and create a more engaging and dynamic user experience.

## Installation

You can use any package manager to install this package.

Please note that you should also install `d3`, as it is a peer dependency.

```bash
pnpm install roku-charts d3

# or
npm install roku-charts d3

# or
yarn add roku-charts d3
```

Alternatively, if you want to use the UMD build, you can use Unpkg:

```html
<script src="https://unpkg.com/d3"></script>
<script src="https://unpkg.com/roku-charts"></script>
```

Or, you can use Jsdelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/d3"></script>
<script src="https://cdn.jsdelivr.net/npm/roku-charts"></script>
```

## Usage

``` ts
import { type Datum } from './interfaces'
import { RokuBar } from './RokuBar'

RokuBar
  .New('#test-1')
  .setData([{ id: '3', value: 4 }, { id: 'bbb', value: 1 }, { id: 'ccc', value: 3 }, { id: 'ddd', value: 5 }])
  .draw()
```

## Contributing

We welcome contributions to Roku Charts! If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/Jannchie/roku-ui).

## License

Roku Charts is open source software released under the [MIT License](./LICENSE).
