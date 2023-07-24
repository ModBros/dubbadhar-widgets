import { BaseFieldHookProps, useMetricField } from '@modbros/dashboard-sdk'
import { useRef } from 'react'
import { ChannelValue, MetricValue } from '@modbros/dashboard-core'
import { MetricUnit } from '@modbros/dashboard-core/types/service'

interface UseMetricFieldHistoryProps extends BaseFieldHookProps {
  limit: number
}

export interface TimedMetricValue {
  metricValue: MetricValue
  timestamp: Date
}

export function useMetricFieldHistory(props: UseMetricFieldHistoryProps): {
  values: TimedMetricValue[]
  unit?: MetricUnit
} {
  const historyRef = useRef<TimedMetricValue[]>([])
  const lastValueRef = useRef<ChannelValue>(null)
  const channelValue = useMetricField(props)

  if (channelValue?.value && lastValueRef.current !== channelValue) {
    lastValueRef.current = channelValue
    historyRef.current.push({
      metricValue: channelValue.value,
      timestamp: new Date()
    })

    if (historyRef.current.length > props.limit) {
      historyRef.current.shift()
    }
  }

  return {
    values: historyRef.current,
    unit: channelValue?.unit
  }
}
