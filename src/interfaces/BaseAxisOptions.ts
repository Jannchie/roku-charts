import { CategoryOptions } from './CategoryOptions'
import { LinearOptions } from './LinearOptions'

export type BaseAxisOptions<D> = LinearOptions<D> | CategoryOptions<D>
