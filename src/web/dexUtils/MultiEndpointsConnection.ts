import { Commitment, Connection } from '@solana/web3.js'
import { Metrics } from '@core/utils/metrics'
import { getProviderNameFromUrl } from './connection'

type RateLimitedEndpoint = {
  url: string
  weight: number
}

type EndpointRequestsCounter = {
  connection: Connection
  endpoint: RateLimitedEndpoint
  numberOfRequestsSent: number
  weight: number
}

const processCall = (call: Promise<any>, connection: Connection) => {
  const rpcProvider = getProviderNameFromUrl({
    rawConnection: connection,
  })
  const t = setTimeout(() => {
    Metrics.sendMetrics({ metricName: `error.rpc.${rpcProvider}.timeout` })
  }, 30 * 1000)

  return call.then(
    (d) => {
      clearTimeout(t)
      return d
    },
    (err: Error) => {
      clearTimeout(t)
      const text = `${err}`.substr(0, 40).replace(/[: ]/g, '_').toLowerCase()
      Metrics.sendMetrics({ metricName: `error.rpc.${rpcProvider}.${text}` })
      console.error(err)
    }
  )
}

class MultiEndpointsConnection implements Connection {
  private endpointsRequestsCounter: EndpointRequestsCounter[]

  private totalWeight: number = 0

  constructor(endpoints: RateLimitedEndpoint[], commitment?: Commitment) {
    this.commitment = commitment
    this.totalWeight = endpoints.reduce((acc, ep) => acc + ep.weight, 0)
    this.endpointsRequestsCounter = endpoints.map(
      (endpoint: RateLimitedEndpoint) => ({
        endpoint,
        connection: new Connection(endpoint.url, { commitment }),
        numberOfRequestsSent: 0,
        weight: endpoint.weight,
      })
    )

    // go through all methods of connection
    for (const functionName of Object.getOwnPropertyNames(
      Connection.prototype
    )) {
      // skip non-function
      if (typeof Connection.prototype[functionName] === 'function') {
        this[functionName] = (...args: any) => {
          // select connection, depending on RPS and load of connection, execute method of this connection
          const connection = this.getConnection()
          return processCall(connection[functionName](...args), connection)
        }
      }
    }
  }

  get connections(): Connection[] {
    return this.endpointsRequestsCounter.map((_) => _.connection)
  }

  getConnection(): Connection {
    const rnd = Math.floor(Math.random() * this.totalWeight)
    let threshold = 0
    const connection = this.endpointsRequestsCounter.find((ep) => {
      threshold += ep.weight
      return threshold <= rnd
    })

    return (
      connection ||
      this.endpointsRequestsCounter[this.endpointsRequestsCounter.length - 1]
    ).connection

    // const len = this.endpointsRequestsCounter.length
    // const idx = Math.floor(Math.random() * len)
    // const availableConnection = this.endpointsRequestsCounter[idx]
    // // objects pass by ref
    // availableConnection.numberOfRequestsSent++

    // return availableConnection.connection
  }

  // initializing in constructor, but some libraries use connection._rpcRequest
  async _rpcRequest(...args) {
    const connection = this.getConnection()
    return await processCall(connection._rpcRequest(...args), connection)
  }
}

export default MultiEndpointsConnection
