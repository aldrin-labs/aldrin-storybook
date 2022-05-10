import { Graph } from '@core/utils/graph/Graph'

type Node = string | number

type Edge = [Node, Node]

const MAX_PATH_LENGTH = 4

const knownNodes = [
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'So11111111111111111111111111111111111111112', // SOL
]

export const getShortestPaths = ({
  edges,
  startNode,
  endNode,
  maxPathLength = MAX_PATH_LENGTH,
}: {
  edges: Edge[]
  startNode: Node
  endNode: Node
  maxPathLength?: number
}) => {
  const knownNodesToSearch = [...new Set([...knownNodes, startNode, endNode])]
  // try to find path using known mints or right from start to end
  const knownEdgesGraph = new Graph()
  const knownEdges = edges.filter((edge) =>
    edge.every((node) => knownNodesToSearch.includes(node))
  )

  knownEdges.forEach(([nodeA, nodeB]) => {
    knownEdgesGraph.addEdge(nodeA, nodeB)
  })

  const knownPaths = knownEdgesGraph.getAllPaths(
    startNode,
    endNode,
    maxPathLength
  )

  console.log('knownPaths', {
    knownPaths,
  })

  if (knownPaths.length > 0) {
    return knownPaths
  }

  const graph = new Graph()

  edges.forEach(([nodeA, nodeB]) => {
    graph.addEdge(nodeA, nodeB)
  })

  // add cycle from 2 to maxLength
  const allPaths = graph.getAllPaths(startNode, endNode, maxPathLength)

  return allPaths
}
