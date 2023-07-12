import { useEffect, useState } from 'react'
import './App.css'
import { CityPathFinder } from '../models/pathFinder'
import Graph from "react-graph-vis";
import cities from '../data/cities';
import paths from '../data/paths';

const COLOR = {
  goal: "#77dd77",
  start: "#ff6961",
  default: "#84b6f4",
  gray: "#E2E2E2"
}

function App() {
  const [path, setPath] = useState<string[]>([])
  const [cityPathFinder, setCityPathFinder] = useState<CityPathFinder>(new CityPathFinder(cities[0].name, cities[1].name))
  const [nodes, setNodes] = useState(cities.map(city => ({ id: city.name, label: city.name, color: city.name === cityPathFinder.goal ? COLOR.goal : COLOR.default})))
  const [edges, setEdges] = useState(paths.map(path => ({ from: path.from, to: path.to, color: COLOR.gray, label: path.distance.toString() })))
  const [selectedNode, setSelectedNode] = useState(cities[0].name)
  const options = {
    layout: {
      randomSeed: 123,
      hierarchical: false
    },
    edges: {
      width: 3,
      color: "#000000",
      arrows: {
        to: {enabled: false},
        from: {enabled: false}
      },
      chosen: false,
    },
    nodes: {
      shape: "dot",
      size: 10,
      chosen: false,
      fixed: {
        x: true,
        y: true
      },
      font: {
        size: 20
      }
    },
    height: "700px"
  };

  useEffect(() => {
    const updatedNodes = nodes.map(node => {
      if(node.id === selectedNode && node.color !== COLOR.goal){
        return {...node, color: COLOR.start}
      }
      else if(node.color === COLOR.start){
        return {...node, color: COLOR.default}
      }
      else{
        return node
      }
    })
    setNodes(updatedNodes)
  },[selectedNode])

  useEffect(() => {
    const optimalPath = cityPathFinder.findPath()
    setPath(optimalPath)
  }, [cityPathFinder])


  useEffect(() => {
    const updatedNodes = nodes.map(node => {
      if(node.id === selectedNode){
        return {...node, color: COLOR.start}
      }
      if(path.includes(node.id)){
        return {...node, color: COLOR.goal}
      }
      else{
        return {...node, color: COLOR.default}
      }
    })
    setNodes(updatedNodes)

    const updatedEdges = edges.map(edge => {
      if(path.includes(edge.from) && path.includes(edge.to)){
        return {...edge, color: COLOR.goal}
      }
      else{
        return {...edge, color: COLOR.gray}
      }
    })
    setEdges(updatedEdges)
  }, [path])

  const events = {
    select: function(event: {nodes: string[]}) {
      const selectedNodeId = event.nodes[0]
      if(!selectedNodeId) return
      setCityPathFinder(new CityPathFinder(selectedNodeId, cities[1].name))
      setSelectedNode(selectedNodeId)
    }
  };

  return (
    <>
      <h1>Pathfinding A*</h1>
      <div className="card">
        <div className='author'>
          <h4>Author: Kevin Cheng</h4>
          <h5>CI: 27.317.962</h5>
        </div>
        <div className='row'>
          <div className='legend'>
            <div className='color' style={{backgroundColor: COLOR.start}}></div>
            <h4>Start City</h4>
          </div>
          <div className='legend'>
            <div className='color' style={{backgroundColor: COLOR.goal}}></div>
            <h4>Goal City</h4>
          </div>
        </div>
        <h4>
          Distance: {cityPathFinder.getTotalDistance()}
        </h4>
        <Graph
          graph={{nodes: nodes, edges: edges}}
          options={options}
          events={events}
        />
      </div>
    </>
  )
}

export default App
