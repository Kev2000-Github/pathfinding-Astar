import pathList from '../data/paths'
import cityList from '../data/cities'
import { CityNode } from "./node";
import { CityPriorityQueue } from './priorityQueue';

export class CityPathFinder {
    start: string
    goal: string
    private _cities: Cities
    private _cityPaths: Paths
    private _path: CameFrom

    constructor(_start: string, _goal: string) {
        this._cities = this.formatCities()
        this._cityPaths = this.formatPaths()
        this._path = {}
        this.start = _start
        this.goal = _goal
    }

    findPath() {
        const priorityQueue = new CityPriorityQueue()
        const costSoFar: CostSoFar = {[this.start]: 0}
        this._path = {[this.start]: null}
        priorityQueue.add(new CityNode(this.start, 0))
    
        while(priorityQueue.isNotEmpty){
            const current: CityNode = priorityQueue.get() as CityNode
    
            if(current.name == this.goal) break
            for(const next of this._cityPaths[current.name]){
                const newCost = costSoFar[current.name] + next.distance
                if(costSoFar[next.to] == null || newCost < costSoFar[next.to]){
                    costSoFar[next.to] = newCost
                    const priority = newCost + this._cities[next.to].heuristic
                    priorityQueue.add(new CityNode(next.to, priority))
                    this._path[next.to] = current
                }
            }
        }
        return this.getPath()
    }

    private getPath() {
        let current: string | null = this.goal
        const optimalPath = []
        while(current !== null){
            optimalPath.push(current)
            current = this._path[current]?.name ?? null
        }
        return optimalPath.reverse()
    }

    getTotalDistance() {
        const path = this.getPath()
        let distance = 0
        for(let i = 0; i < path.length - 1; i++){
            const pathDistance = this._cityPaths[path[i]].find(val => val.to === path[i+1])
            distance += pathDistance?.distance ?? 0
        }
        return distance
    }

    private formatPaths = () => {
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

    private formatCities = () => {
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
}

type Paths = {
    [key: string]: {
        to: string,
        distance: number
    }[];
}

type Cities = {
    [key: string]: {
        x: number,
        y: number,
        heuristic: number
    };
}

type CostSoFar = {
    [key: string]: number
}

type CameFrom = {
    [key: string]: CityNode | null
}



