import { AxisCategoryUtils } from './AxisCategoryUtils'
import { AxisLinearUtils } from './AxisLinearUtils'

export type AxisUtils<Datum> = AxisCategoryUtils<Datum> | AxisLinearUtils<Datum>
