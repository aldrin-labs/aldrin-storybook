import { Commitment, Connection } from '@solana/web3.js'
import { Metrics } from '@core/utils/metrics'
import { getProviderNameFromUrl } from './connection'

type RateLimitedEndpoint = {
  url: string
  RPS: number
}

type EndpointRequestsCounter = {
  connection: Connection
  endpoint: RateLimitedEndpoint
  numberOfRequestsSent: number
}

// TODO
class MultiEndpointsConnection implements Connection {
  private endpointsRequestsCounter: EndpointRequestsCounter[]

  constructor(endpoints: RateLimitedEndpoint[], commitment?: Commitment) {
    this.commitment = commitment
    this.endpointsRequestsCounter = endpoints.map(
      (endpoint: RateLimitedEndpoint) => ({
        endpoint,
        connection: new Connection(endpoint.url, { commitment }),
        numberOfRequestsSent: 0,
      })
    )

    // go through all methods of connection
    for (const functionName of Object.getOwnPropertyNames(
      Connection.prototype
    )) {
      // skip non-function
      if (typeof Connection.prototype[functionName] !== 'function') {
        // const connection = this.getConnection();
        // this[functionName] = connection[functionName];
        continue
      }

      this[functionName] = (...args: any) => {
        // select connection, depending on RPS and load of connection, execute method of this connection
        const connection = this.getConnection()
        return this.processCall(connection[functionName](...args), connection)
      }
    }

    // setInterval(() => {
    //   this.endpointsRequestsCounter.forEach((endpointCounter) => {
    //     endpointCounter.numberOfRequestsSent = 0
    //   })
    // }, 1500)
  }

  get connections(): Connection[] {
    return this.endpointsRequestsCounter.map((_) => _.connection)
  }

  private processCall(call: Promise<any>, connection: Connection) {
    call.then(
      (d) => d,
      (err: Error) => {
        const rpcProvider = getProviderNameFromUrl({
          rawConnection: connection,
        })
        const t = `${err}`.substr(0, 40).replace(/[: ]/g, '_').toLowerCase()
        Metrics.sendMetrics({ metricName: `error.rpc.${rpcProvider}.${t}` })
        console.error(err)
      }
    )
    return call
  }

  getConnection(): Connection {
    // const availableConnection = this.endpointsRequestsCounter.reduce(
    //   (prev, current) =>
    //     prev.numberOfRequestsSent < current.numberOfRequestsSent ? prev : current
    // );

    const len = this.endpointsRequestsCounter.length
    const idx = Math.floor(Math.random() * len)
    const availableConnection = this.endpointsRequestsCounter[idx]
    // objects pass by ref
    availableConnection.numberOfRequestsSent++

    return availableConnection.connection
  }

  // initializing in constructor, but some libraries use connection._rpcRequest
  async _rpcRequest(...args) {
    const connection = this.getConnection()
    return await this.processCall(connection._rpcRequest(...args), connection)
  }
}

export default MultiEndpointsConnection
