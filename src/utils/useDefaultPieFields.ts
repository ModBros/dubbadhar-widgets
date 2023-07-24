import {
  useColorField,
  useItemSize,
  useMemoizedMetricField,
  useNumberField
} from '@modbros/dashboard-sdk'
import { getMetricMaxValue } from './metricUtils'
import { useCallback } from 'react'
import { ChannelValue } from '@modbros/dashboard-core'
import { defaultBackColor, defaultFontColor } from './constants'

export function useDefaultPieFields(defaultColor) {
  const { width, height } = useItemSize()

  const color = useColorField({ field: 'color', defaultColor })
  const backColor = useColorField({
    field: 'back_color',
    defaultColor: defaultBackColor
  })
  const maxValue = useNumberField({ field: 'max' })

  const memo = useCallback((channelValue: ChannelValue) => {
    return Math.round(parseFloat(channelValue.value?.value?.toString()))
  }, [])

  const { value, channelValue } = useMemoizedMetricField({
    field: 'metric',
    memo
  })
  const diameter = Math.min(width, height)
  const radius = diameter / 2
  const max = getMetricMaxValue(channelValue, maxValue)

  return {
    width,
    height,
    channelValue,
    color,
    backColor,
    max,
    radius,
    value
  }
}
