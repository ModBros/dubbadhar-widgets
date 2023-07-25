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
  label: string
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
    label,
    value,
    channelValue,
    hideLabel,
    hideUnit
  } = props

  const fontSize = height / 5
  const labelsFontSize = fontSize / 2.5

  const l = !hideLabel && (
    <Text.Text
      textAnchor={'middle'}
      verticalAnchor={'middle'}
      fill={fontColor.toRgbaCss()}
      y={-fontSize}
      fontSize={labelsFontSize}
      fontFamily={fontFamily}
    >
      {label}
    </Text.Text>
  )

  const u = !hideUnit && (
    <Text.Text
      textAnchor={'middle'}
      verticalAnchor={'middle'}
      fill={fontColor.toRgbaCss()}
      y={fontSize}
      fontSize={labelsFontSize}
      fontFamily={fontFamily}
    >
      {channelValue.unit.abbreviation}
    </Text.Text>
  )

  return (
    <>
      {l}

      {u}

      <Text.Text
        textAnchor={'middle'}
        verticalAnchor={'middle'}
        fill={valueColor.toRgbaCss()}
        fontSize={fontSize}
        fontFamily={fontFamily}
      >
        {value.toString()}
      </Text.Text>
    </>
  )
}
