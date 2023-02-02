// https://github.com/type-challenges/type-challenges/issues/22183

type returnTypes = string | number | boolean; // This is needed to infer exact return type. Find better solution 

declare function Currying<T extends (...args: any[]) => R, R extends returnTypes>(func: T)
   : Parameters<T>['length'] extends 0 ? T : Curry<Parameters<T>, ReturnType<T>>

type Curry<T extends any[], R> = T extends [infer First, ...infer Rest]
   ? (args: First) => Curry<[...Rest], R>
   : R

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

const add = (a: number, b: number, c: number) => true
const three = add(4, 2, 4)

// (args: number) => (args: number) => (args: number) => boolean
const curriedAdd = Currying(add)

// (args: number) => (args: number) => (args: number) => true
const curriedAddLiteralReturn = Currying((a: number, b: number, c: number) => true)
const five = curriedAdd(2)(3)(5)