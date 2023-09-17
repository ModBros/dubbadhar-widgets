import React, {
  CSSProperties,
  forwardRef,
  FunctionComponent,
  ReactNode,
  useRef
} from 'react'
import {
  Color,
  Loading,
  MissingConfigPlaceholder,
  useCheckboxField,
  useColorField,
  useFontField,
  useFormattedMetricValue,
  useIsMetricFieldConfigured,
  useItemSize,
  useNumberField,
  useSelectField,
  useStringField
} from '@modbros/dashboard-sdk'
import { Axis, Curve, Group, Shape } from '@visx/visx'
import {
  TimedMetricValue,
  useMetricFieldHistory
} from '../../utils/useMetricFieldHistory'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import { isNil } from 'lodash-es'
import { defaultFontColor, defaultLineColor } from '../../utils/constants'
import styled from 'styled-components'
import { ChannelValue } from '@modbros/dashboard-core'

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

interface HeaderProps {
  channelValue: ChannelValue
  label?: string
  fontColor?: Color
  fontSize?: number
  fontFamily?: string
}

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
`

const Header = forwardRef((props: HeaderProps, ref) => {
  const { channelValue, label, fontColor, fontSize, fontFamily } = props

  const value = useFormattedMetricValue(channelValue, {
    valueBasedPrecision: true,
    precision: 2
  })

  const style: CSSProperties = {
    color: fontColor.toRgbaCss(),
    fontSize: fontSize ? `${fontSize}px` : undefined,
    fontFamily: fontFamily
  }

  return (
    <StyledHeader ref={ref}>
      <span style={style}>
        {label ? label : channelValue.metric.label} - {value.unit}
      </span>

      <span style={style}>{value.value}</span>
    </StyledHeader>
  )
})

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const LineChart = () => {
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
    defaultColor: defaultLineColor
  })
  const lineCurve = useSelectField({
    field: 'line_curve',
    defaultValue: 'linear'
  })
  const label = useStringField({ field: 'label' })
  const fontSize = useNumberField({ field: 'font_size', defaultValue: 24 })
  const fontColor = useColorField({
    field: 'font_color',
    defaultColor: defaultFontColor
  })
  const fontFamily = useFontField({ field: 'font_family' })
  const maxValue = useNumberField({ field: 'max' })
  const minValue = useNumberField({ field: 'min' })
  const lineWidth = useNumberField({ field: 'line_width', defaultValue: 3 })
  const hideYAxis = useCheckboxField({ field: 'hide_yaxis' })
  const yaxisLabelFontSize = useNumberField({
    field: 'yaxis_label_font_size',
    defaultValue: 12
  })
  const yaxisLabelSpace = useNumberField({
    field: 'yaxis_label_space',
    defaultValue: yaxisLabelFontSize * 4
  })
  const headerRef = useRef<HTMLDivElement | null>(null)

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!values.length) {
    return <Loading />
  }

  const timedValue = values[values.length - 1]

  const getTimestamp = (d: TimedMetricValue) => d.timestamp
  const getValue = (d: TimedMetricValue) =>
    parseFloat(d.channelValue.value.value.toString())

  const domain = extent(values, getValue)

  if (!isNil(minValue)) {
    domain[0] = parseFloat(minValue.toString())
  }

  if (!isNil(maxValue)) {
    domain[1] = parseFloat(maxValue.toString())
  }

  domain[0] = Math.floor(domain[0])
  domain[1] = Math.ceil(domain[1])

  const chartHeight = headerRef.current
    ? height - headerRef.current.clientHeight
    : height

  const timeScale = scaleLinear()
    .range([0, hideYAxis ? width : width - yaxisLabelSpace])
    .domain(extent(values, getTimestamp))
  const valueScale = scaleLinear()
    .range([hideYAxis ? chartHeight : chartHeight - yaxisLabelFontSize * 2, 0])
    .domain(domain)

  return (
    <StyledContainer>
      <Header
        ref={headerRef}
        label={label}
        channelValue={timedValue.channelValue}
        fontSize={fontSize}
        fontColor={fontColor}
        fontFamily={fontFamily}
      />
      <svg width={'100%'} height={'100%'}>
        <Group.Group
          left={hideYAxis ? 0 : yaxisLabelSpace}
          top={hideYAxis ? 0 : yaxisLabelFontSize}
          height={
            hideYAxis ? chartHeight : chartHeight - yaxisLabelFontSize * 2
          }
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
                  fill={fontColor.toRgbaCss()}
                  fontSize={yaxisLabelFontSize}
                  fontFamily={fontFamily}
                >
                  {formattedValue}
                </text>
              )}
              hideAxisLine={true}
              tickValues={domain}
              tickFormat={(value) => value.toString()}
              scale={valueScale}
            />
          )}
        </Group.Group>
      </svg>
    </StyledContainer>
  )
}

export default LineChart
