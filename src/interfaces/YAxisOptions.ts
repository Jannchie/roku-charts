import { BaseAxisOptions } from './BaseAxisOptions'

export type YAxisOptions<D> = BaseAxisOptions<D> & { position?: 'left' | 'right' }
