import React, { FunctionComponent } from 'react'
import { Group, Shape } from '@visx/visx'
import { Color, useItemSize } from '@modbros/dashboard-sdk'
import { ProvidedProps } from '@visx/shape/lib/shapes/Pie'
import { animated, to, useTransition } from 'react-spring'
import { ChannelValue } from '@modbros/dashboard-core'

export interface PieData {
  index: number
  value: number
  color: string
}

interface AnimatedArcProps {
  pie: ProvidedProps<PieData>
}

const AnimatedArc: FunctionComponent<AnimatedArcProps> = (props) => {
  const { pie } = props

  const transitions = useTransition(pie.arcs, {
    update: ({ startAngle, endAngle }) => ({
      startAngle,
      endAngle
    }),
    keys: (item) => `index-${item.index}`
  })

  return transitions((props, arc, { key }) => {
    return (
      <g key={key}>
        <animated.path
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) => {
            return pie.path({
              ...arc,
              startAngle: startAngle ?? arc.startAngle,
              endAngle: endAngle ?? arc.endAngle
            })
          })}
          fill={arc.data.color}
        />
      </g>
    )
  })
}

interface AnimatedPieChartProps {
  radius: number
  width: number
  height: number
  channelValue: ChannelValue
  color: Color
  backColor: Color
  max: number
  startAngle?: number
  endAngle?: number
  value: number
  outerRadius?: number
  thickness: number
}

export const AnimatedPieChart: FunctionComponent<AnimatedPieChartProps> = (
  props
) => {
  const {
    width,
    height,
    color,
    backColor,
    radius,
    startAngle,
    endAngle,
    value,
    max,
    outerRadius,
    thickness,
    children
  } = props

  const outerRad = outerRadius ?? radius

  return (
    <svg width={'100%'} height={'100%'}>
      <Group.Group top={height / 2} left={width / 2}>
        {children}

        <Shape.Pie
          outerRadius={outerRad}
          innerRadius={outerRad - thickness}
          data={[1]}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          {(pie) =>
            pie.arcs.map((arc) => (
              <path
                key={arc.index}
                d={pie.path(arc)}
                fill={
                  backColor.toRgbaCss()
                }
              />
            ))
          }
        </Shape.Pie>


        <Shape.Pie
          outerRadius={outerRad}
          innerRadius={outerRad - thickness}
          startAngle={startAngle}
          endAngle={endAngle}
          data={[
            { index: 0, value, color: color.toRgbaCss() },
            { index: 1, value: max - value, color: 'transparent' }
          ]}
          pieValue={(item) => item.value}
          pieSort={null}
          pieSortValues={null}
        >
          {(pie) => <AnimatedArc pie={pie} />}
        </Shape.Pie>
      </Group.Group>
    </svg>
  )
}
