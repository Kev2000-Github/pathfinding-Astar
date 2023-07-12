import pathList from '../data/paths.ts';
import cityList from '../data/cities.ts';
import { CityNode } from '../models/node.ts';

type Paths = {
    [key: string]: {
        to: string,
        distance: number
    }[];
}

export const getPaths = () => {
    const paths: Paths = {}
    for(const path of pathList) {
        if(paths[path.from] && paths[path.to]){
            paths[path.from].push({to: path.to, distance: path.distance})
            paths[path.to].push({to: path.from, distance: path.distance})
        }
        else if(paths[path.from]){
            const toPath = {to: path.to, distance: path.distance}
            paths[path.from].push(toPath)
            paths[path.to] = [{to: path.from, distance: path.distance}]
        }
        else if(paths[path.to]){
            paths[path.to].push({to: path.from, distance: path.distance})
            paths[path.from] = [{to: path.to, distance: path.distance}]
        }
        else{
            paths[path.from] = [{to: path.to, distance: path.distance}]
            paths[path.to] = [{to: path.from, distance: path.distance}]
        }
    }
    return paths;
}

type Cities = {
    [key: string]: {
        x: number,
        y: number,
        heuristic: number
    };
}

export const getCities = () => {
    const cities: Cities = {}
    for(const city of cityList){
        cities[city.name] = {
            x: city.x,
            y: city.y,
            heuristic: city.heuristic
        }
    }
    return cities;
}

type CostSoFar = {
    [key: string]: number
}

type CameFrom = {
    [key: string]: CityNode | null
}

export class CityPathFinder {
    start: string
    goal: string
    cities: Cities
    cityPaths: Paths
    path: CameFrom

    constructor(_start: string, _goal: string) {
        this.cities = getCities()
        this.cityPaths = getPaths()
        this.path = {}
        this.start = _start
        this.goal = _goal
    }

    findPath() {
        const priorityQueue = new CityPriorityQueue()
        const costSoFar: CostSoFar = {[this.start]: 0}
        this.path = {[this.start]: null}
        priorityQueue.add(new CityNode(this.start, 0))
    
        while(priorityQueue.isNotEmpty){
            const current: CityNode = priorityQueue.get() as CityNode
    
            if(current.name == this.goal) break
            for(const next of this.cityPaths[current.name]){
                const newCost = costSoFar[current.name] + next.distance
                if(costSoFar[next.to] == null || newCost < costSoFar[next.to]){
                    costSoFar[next.to] = newCost
                    const priority = newCost + this.cities[next.to].heuristic
                    priorityQueue.add(new CityNode(next.to, priority))
                    this.path[next.to] = current
                }
            }
        }
        return this.getPath()
    }

    getPath() {
        let current: string | null = this.goal
        const optimalPath = []
        while(current !== null){
            optimalPath.push(current)
            current = this.path[current]?.name ?? null
        }
        return optimalPath.reverse()
    }
}

class CityPriorityQueue{
    items: CityNode[]

    constructor(){
        this.items = [];
    }

    add(element: CityNode) {
        let contain = false
        for(let i = 0; i < this.items.length; i++){
            if(this.items[i].priority < element.priority){
                this.items.splice(i, 0, element)
                contain = true
                break
            }
        }
        if(!contain){
            this.items.push(element)
        }
    }

    get() {
        return this.items.pop() ?? null
    }

    isNotEmpty() {
        return this.items.length > 0
    }
}