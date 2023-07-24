import React, { FunctionComponent } from 'react'
import {
  Loading,
  MissingConfigPlaceholder,
  useCheckboxField,
  useColorField,
  useFontField,
  useIsMetricFieldConfigured,
  useItemSize,
  useNumberField,
  useSelectField
} from '@modbros/dashboard-sdk'
import { Axis, Curve, Group, Shape } from '@visx/visx'
import {
  TimedMetricValue,
  useMetricFieldHistory
} from '../../utils/useMetricFieldHistory'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import { isNil } from 'lodash-es'

function getCurve(curve: string) {
  switch (curve) {
    default:
    case 'linear':
      return Curve.curveLinear

    case 'monotone':
      return Curve.curveMonotoneX

    case 'natural':
      return Curve.curveNatural
  }
}

const LineChart: FunctionComponent = () => {
  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })
  const { width, height } = useItemSize()
  const historyCount = useNumberField({
    field: 'history_count',
    defaultValue: 15
  })
  const { values, unit } = useMetricFieldHistory({
    field: 'metric',
    limit: historyCount
  })
  const lineColor = useColorField({
    field: 'line_color',
    defaultColor: '#000000'
  })
  const lineCurve = useSelectField({
    field: 'line_curve',
    defaultValue: 'linear'
  })
  const maxValue = useNumberField({ field: 'max' })
  const minValue = useNumberField({ field: 'min' })
  const lineWidth = useNumberField({ field: 'line_width', defaultValue: 3 })
  const hideYAxis = useCheckboxField({ field: 'hide_yaxis' })
  const yaxisLabelFontSize = useNumberField({
    field: 'yaxis_label_font_size',
    defaultValue: 12
  })
  const yaxisLabelFont = useFontField({ field: 'yaxis_label_font' })
  const yaxisLabelSpace = useNumberField({
    field: 'yaxis_label_space',
    defaultValue: yaxisLabelFontSize * 4
  })
  const yaxisLabelColor = useColorField({
    field: 'yaxis_label_color',
    defaultColor: '#000000'
  })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!values.length) {
    return <Loading />
  }

  const getTimestamp = (d: TimedMetricValue) => d.timestamp
  const getValue = (d: TimedMetricValue) =>
    parseFloat(d.metricValue.value.toString())

  const domain = extent(values, getValue)

  if (!isNil(minValue)) {
    domain[0] = parseFloat(minValue.toString())
  }

  if (!isNil(maxValue)) {
    domain[1] = parseFloat(maxValue.toString())
  }

  domain[0] = Math.floor(domain[0])
  domain[1] = Math.ceil(domain[1])

  const timeScale = scaleLinear()
    .range([0, width])
    .domain(extent(values, getTimestamp))
  const valueScale = scaleLinear()
    .range([hideYAxis ? height : height - yaxisLabelFontSize * 2, 0])
    .domain(domain)

  return (
    <svg width={width} height={height}>
      <Group.Group
        left={hideYAxis ? 0 : yaxisLabelSpace}
        top={hideYAxis ? 0 : yaxisLabelFontSize}
        height={hideYAxis ? height : height - yaxisLabelFontSize * 2}
      >
        <Shape.Area
          stroke={lineColor.toRgbaCss()}
          curve={getCurve(lineCurve)}
          strokeWidth={lineWidth}
          data={values}
          x={(d) => timeScale(getTimestamp(d)) ?? 0}
          y={(d) => valueScale(getValue(d)) ?? 0}
        />
        {!hideYAxis && (
          <Axis.AxisLeft
            tickStroke='transparent'
            tickComponent={({ formattedValue, ...props }) => (
              <text
                {...props}
                fill={yaxisLabelColor.toRgbaCss()}
                fontSize={yaxisLabelFontSize}
                fontFamily={yaxisLabelFont}
              >
                {formattedValue}
              </text>
            )}
            hideAxisLine={true}
            tickValues={domain}
            tickFormat={(value) => `${value} ${unit?.abbreviation}`}
            scale={valueScale}
          />
        )}
      </Group.Group>
    </svg>
  )
}

export default LineChart
