import { API_URL, MASTER_BUILD } from '@core/utils/config'

export const Metrics = {
  sendMetrics: async (
    {
      metricName = 'test.frontend.metric',
      metricScope = 'Frontend.DEX',
      metricTimingData = 0,
    }: {
      metricName: string
      metricScope?: string
      metricTimingData?: number
    } = {
      metricName: 'test.frontend.metric',
      metricScope: 'Frontend.DEX',
      metricTimingData: 0,
    }
  ) => {
    try {
      const result = await fetch(`https://${API_URL}/addMetricData`, {
        method: 'POST',
        body: JSON.stringify({
          input: {
            metricName,
            metricScope,
            metricTimingData,
          },
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log('sendMetrics success: ', res)
        })
        .catch((e) => {
          console.log('sendMetrics catch error', e)
        })
    } catch (e) {
      console.log('sendMetrics error', e)
    }
  },
}

if (!MASTER_BUILD) {
  window.Metrics = Metrics
}
