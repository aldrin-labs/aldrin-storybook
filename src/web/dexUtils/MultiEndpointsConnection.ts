import { Commitment, Connection } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from './tokens';

type RateLimitedEndpoint = {
  endpoint: string
  RPS: number
}

type EndpointRequestsCounter = {
  connection: Connection
  endpoint: RateLimitedEndpoint
  numberOfRequestsSent: number
}

class MultiEndpointsConnection implements Connection {
  private endpointsRequestsCounter: EndpointRequestsCounter[]

  constructor(endpoints: RateLimitedEndpoint[], commitment?: Commitment) {
    this.commitment = commitment;

    this.endpointsRequestsCounter = endpoints.map(
      (endpoint: RateLimitedEndpoint) => ({
        endpoint,
        connection: new Connection(endpoint.endpoint, commitment),
        numberOfRequestsSent: 0,
      })
    )

    // go through all methods of connection
    for (let functionName of Object.getOwnPropertyNames(Connection.prototype)) {
      // skip non-function
      if (typeof Connection.prototype[functionName] !== 'function' || typeof Connection.prototype[functionName] === '_rpcRequest') continue
      this[functionName] = (...args: any) => {
        // select connection, depending on RPS and load of connection, execute method of this connection
        const connection = this.getConnection();
        return connection[functionName](...args)
      }
    }

    setInterval(() => {
      this.endpointsRequestsCounter.forEach((endpointCounter) => {
        endpointCounter.numberOfRequestsSent = 0
      })
    }, 1000)
  }

  //
  getConnection(): Connection {
    let selectedRequestCounter

    const availableConnection = this.endpointsRequestsCounter.find(
      (endpointCounter) => {
        return (
          endpointCounter.numberOfRequestsSent < endpointCounter.endpoint.RPS
        )
      }
    )

    if (availableConnection) {
      selectedRequestCounter = availableConnection
    } else {
      // no available connections, use one with the best RPS
      selectedRequestCounter = this.endpointsRequestsCounter.reduce(
        (prev, current) =>
          prev.endpoint.RPS > current.endpoint.RPS ? prev : current
      )
    }

    // objects pass by ref
    selectedRequestCounter.numberOfRequestsSent++

    return selectedRequestCounter.connection
  }

  async _rpcRequest(...args) {
    return await this.getConnection()._rpcRequest(...args);
  }
}

export default MultiEndpointsConnection
