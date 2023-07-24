import React, { FunctionComponent } from 'react'
import { AnimatedPieChart } from '../../components/AnimatedPieChart'
import { Shape } from '@visx/visx'
import { useDefaultPieFields } from '../../utils/useDefaultPieFields'
import {
  Loading,
  MissingConfigPlaceholder,
  useCheckboxField,
  useIsMetricFieldConfigured
} from '@modbros/dashboard-sdk'
import { useThresholds } from '../../utils/metricUtils'

const GaugeChart: FunctionComponent = () => {
  const {
    width,
    height,
    thickness,
    cornerRadius,
    channelValue,
    color,
    backColor,
    max,
    radius,
    value
  } = useDefaultPieFields('#00ff1e')

  const hideThresholds = useCheckboxField({ field: 'hide_thresholds' })
  const { warningValue, warningColor, criticalValue, criticalColor, getColor } =
    useThresholds(color, max, true)

  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!channelValue?.value) {
    return <Loading />
  }

  const angleFactor = 1.5
  const endAngle = Math.PI / angleFactor
  const startAngle = -endAngle
  const thresholdThickness = !hideThresholds ? thickness / 3 : 0

  return (
    <AnimatedPieChart
      thickness={thickness}
      channelValue={channelValue}
      color={getColor(value)}
      backColor={backColor}
      cornerRadius={cornerRadius}
      max={max}
      radius={radius}
      outerRadius={radius - thresholdThickness - 5}
      width={width}
      height={height}
      value={value}
      startAngle={startAngle}
      endAngle={endAngle}
    >
      {!hideThresholds && (
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
      )}
    </AnimatedPieChart>
  )
}

export default GaugeChart
