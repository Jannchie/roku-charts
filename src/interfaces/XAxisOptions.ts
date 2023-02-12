import { BaseAxisOptions } from './BaseAxisOptions'

export type XAxisOptions<D> = BaseAxisOptions<D> & { position?: 'top' | 'bottom' }
