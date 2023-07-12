import { CityNode } from "./node";


export class CityPriorityQueue{
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