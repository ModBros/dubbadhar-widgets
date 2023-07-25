import React, { FunctionComponent } from 'react'
import { AnimatedPieChart } from '../../components/AnimatedPieChart'
import { Shape } from '@visx/visx'
import { useDefaultPieFields } from '../../utils/useDefaultPieFields'
import {
  Loading,
  MissingConfigPlaceholder,
  useIsMetricFieldConfigured
} from '@modbros/dashboard-sdk'
import { useThresholds } from '../../utils/metricUtils'
import { defaultGaugeFrontColor } from '../../utils/constants'
import { PieChartValue } from '../../components/PieChartValue'

const GaugeChart: FunctionComponent = () => {
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
  } = useDefaultPieFields(defaultGaugeFrontColor)
  const { getColor, warningValue, criticalValue, warningColor, criticalColor } =
    useThresholds(color, max, true)
  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!channelValue?.value) {
    return <Loading />
  }

  const thickness = Math.round(Math.min(width, height) / 10)
  const angleFactor = 1.5
  const endAngle = Math.PI / angleFactor
  const startAngle = -endAngle
  const thresholdThickness = thickness / 3

  return (
    <AnimatedPieChart
      thickness={thickness}
      channelValue={channelValue}
      color={getColor(value)}
      backColor={backColor}
      max={max}
      radius={radius}
      outerRadius={radius - thresholdThickness - 5}
      width={width}
      height={height}
      value={value}
      startAngle={startAngle}
      endAngle={endAngle}
    >
      <Shape.Pie
        outerRadius={radius}
        innerRadius={radius - thresholdThickness}
        data={[
          warningValue,
          max - warningValue - (max - criticalValue),
          max - criticalValue
        ]}
        startAngle={startAngle}
        endAngle={endAngle}
        pieSort={null}
        pieSortValues={null}
      >
        {(pie) =>
          pie.arcs.map((arc) => (
            <path
              key={arc.index}
              d={pie.path(arc)}
              fill={
                [
                  color.toRgbaCss(),
                  warningColor.toRgbaCss(),
                  criticalColor.toRgbaCss()
                ][arc.index]
              }
            />
          ))
        }
      </Shape.Pie>

      <PieChartValue
        width={width}
        height={height}
        channelValue={channelValue}
        valueColor={getColor(value)}
        fontColor={fontColor}
        fontFamily={fontFamily}
        max={max}
        label={label}
        value={value}
        hideLabel={hideLabel}
        hideUnit={hideUnit}
      />
    </AnimatedPieChart>
  )
}

export default GaugeChart
