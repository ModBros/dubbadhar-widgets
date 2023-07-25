import React, { FunctionComponent } from 'react'
import { AnimatedPieChart } from '../../components/AnimatedPieChart'
import { useDefaultPieFields } from '../../utils/useDefaultPieFields'
import {
  Loading,
  MissingConfigPlaceholder,
  useIsMetricFieldConfigured
} from '@modbros/dashboard-sdk'
import { useThresholds } from '../../utils/metricUtils'
import { defaultFrontColor } from '../../utils/constants'
import { PieChartValue } from '../../components/PieChartValue'

const DonutChart: FunctionComponent = () => {
  const {
    width,
    height,
    channelValue,
    color,
    backColor,
    max,
    radius,
    value,
    fontColor,
    fontFamily,
    label,
    hideLabel,
    hideUnit
  } = useDefaultPieFields(defaultFrontColor)
  const { getColor } = useThresholds(color, max)
  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!channelValue?.value) {
    return <Loading />
  }

  return (
    <AnimatedPieChart
      channelValue={channelValue}
      color={getColor(value)}
      backColor={backColor}
      max={max}
      radius={radius}
      width={width}
      height={height}
      value={value}
      thickness={Math.round(Math.min(width, height) / 9)}
    >
      <PieChartValue
        width={width}
        height={height}
        channelValue={channelValue}
        valueColor={getColor(value)}
        fontColor={fontColor}
        fontFamily={fontFamily}
        label={label}
        max={max}
        value={value}
        hideLabel={hideLabel}
        hideUnit={hideUnit}
      />
    </AnimatedPieChart>
  )
}

export default DonutChart
