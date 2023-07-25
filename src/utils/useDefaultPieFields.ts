import {
  useCheckboxField,
  useColorField,
  useFontField,
  useFormatMetricValue,
  useItemSize,
  useMemoizedMetricField,
  useNumberField,
  useStringField
} from '@modbros/dashboard-sdk'
import { getMetricMaxValue } from './metricUtils'
import { useCallback } from 'react'
import { ChannelValue } from '@modbros/dashboard-core'
import { defaultBackColor, defaultFontColor } from './constants'
import { isString } from 'lodash-es'

export function useDefaultPieFields(defaultColor) {
  const { width, height } = useItemSize()

  const format = useFormatMetricValue()

  const precision = useNumberField({ field: 'precision', defaultValue: 2 })

  const fontColor = useColorField({
    field: 'font_color',
    defaultColor: defaultFontColor
  })
  const fontFamily = useFontField({ field: 'font_family' })

  const label = useStringField({ field: 'label' })
  const hideLabel = useCheckboxField({ field: 'hide_label' })
  const hideUnit = useCheckboxField({ field: 'hide_unit' })

  const color = useColorField({ field: 'color', defaultColor })
  const backColor = useColorField({
    field: 'back_color',
    defaultColor: defaultBackColor
  })
  const maxValue = useNumberField({ field: 'max' })

  const memo = useCallback((channelValue: ChannelValue) => {
    const formattedValue = format(channelValue, {
      precision: Math.max(precision, 0),
      valueBasedPrecision: true
    })

    if (!isString(formattedValue.value)) {
      return null
    }

    return parseFloat(formattedValue.value.toString());
  }, [precision])

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
    fontColor,
    label: label || channelValue?.metric?.label,
    hideLabel,
    hideUnit,
    fontFamily,
    max,
    radius,
    value
  }
}
