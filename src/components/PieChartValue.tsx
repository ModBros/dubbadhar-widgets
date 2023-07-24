import React from 'react'
import { ChannelValue, formatNumericMetricValue } from '@modbros/dashboard-core'
import { Color } from '@modbros/dashboard-sdk'
import { Text } from '@visx/visx'

export interface PieChartValueProps {
  width: number
  height: number
  channelValue: ChannelValue
  valueColor: Color
  fontColor: Color
  fontFamily?: string
  max: number
  value: number
  hideLabel: boolean
  hideUnit: boolean
}

export const PieChartValue = (props: PieChartValueProps) => {
  const {
    width,
    height,
    valueColor,
    fontColor,
    fontFamily,
    value,
    channelValue,
    hideLabel,
    hideUnit
  } = props

  const label = !hideLabel && (
    <Text.Text
      textAnchor={'middle'}
      verticalAnchor={'middle'}
      fill={fontColor.toRgbaCss()}
      fontSize={30}
    >
      {channelValue.metric.label}
    </Text.Text>
  )

  const unit = !hideUnit && (
    <Text.Text
      textAnchor={'middle'}
      verticalAnchor={'middle'}
      fill={fontColor.toRgbaCss()}
      fontSize={30}
    >
      {channelValue.unit.abbreviation}
    </Text.Text>
  )

  return (
    <>
      {label}
      <Text.Text
        textAnchor={'middle'}
        verticalAnchor={'middle'}
        fill={valueColor.toRgbaCss()}
        fontSize={30}
      >
        {value}
      </Text.Text>

      {label}
    </>
  )
}
