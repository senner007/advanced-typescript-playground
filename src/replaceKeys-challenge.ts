// type to replace keys in union of objects
type ReplaceKeys<T, U extends AllKeys<T>, O extends Record<any, any>> = {
    [key in keyof T]: key extends U ? key extends keyof O ? O[key] : never : T[key]
}

type AllKeys<T> = T extends any ? keyof T : never

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type NodeA = {
    type: 'A'
    name: string
    flag: number
}

type NodeB = {
    type: 'B'
    id: number
    flag: number
}

type NodeC = {
    type: 'C'
    name: string
    flag: number
}

type ReplacedNodeA = {
    type: 'A'
    name: number
    flag: string
}

type ReplacedNodeB = {
    type: 'B'
    id: number
    flag: string
}

type ReplacedNodeC = {
    type: 'C'
    name: number
    flag: string
}

type NoNameNodeA = {
    type: 'A'
    flag: number
    name: never
}

type NoNameNodeC = {
    type: 'C'
    flag: number
    name: never
}

type Nodes = NodeA | NodeB | NodeC
type ReplacedNodes = ReplacedNodeA | ReplacedNodeB | ReplacedNodeC
type NodesNoName = NoNameNodeA | NoNameNodeC | NodeB

type cases = [
    Expect<Equal<ReplaceKeys<Nodes, 'name' | 'flag', { name: number; flag: string }>, ReplacedNodes>>,
    Expect<Equal<ReplaceKeys<Nodes, 'name', { aa: number }>, NodesNoName>>,
]

/*********************************************************************** */
// Improved version : 
/*********************************************************************** */
// same type but without the second parameter as the information of what keys to replace is contained within the generic O type
type ReplaceKeysImproved<T, O extends any> = T extends any ? {
    [key in keyof T]: key extends keyof O ? O[key] : T[key]
} : never

type t = ReplaceKeysImproved<Nodes, { id: string; flag: string }>

type N1 = { id: 42, flag : number}
type N2 = { id: 42, name : string}

type N1Replaced = { id: string, flag : string}
type N2Replaced = { id: string, name : string}

type cases2 = [
    Expect<Equal<ReplaceKeysImproved<Nodes, { name: number; flag: string }>, ReplacedNodes>>,
    Expect<Equal<ReplaceKeysImproved<N1 | N2, { id: string; flag: string }>, N1Replaced | N2Replaced>>,
]
