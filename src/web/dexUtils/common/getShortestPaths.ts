import { Graph } from '@core/utils/graph/Graph'

type Node = string | number

type Edge = [Node, Node]

const MAX_PATH_LENGTH = 4

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
  const graph = new Graph()

  edges.forEach(([nodeA, nodeB]) => {
    graph.addEdge(nodeA, nodeB)
  })

  const allPaths = graph.getAllPaths(startNode, endNode, maxPathLength)

  console.log('allPaths', allPaths)

  return allPaths
}
