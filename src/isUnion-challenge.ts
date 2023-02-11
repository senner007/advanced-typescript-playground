
// type to verify that the generic parameter is a union
type IsUnion<T, U = T> = T extends any ? [U] extends [T] ? false : true : false


/*********************************************************************** */
// Explanation : 
/*********************************************************************** */

import type { Equal, Expect } from '@type-challenges/utils'
// First we need to understand distributive conditional types:
// https://stackoverflow.com/questions/55382306/typescript-distributive-conditional-types

// The distributive conditionals is a generic type alias where the 'naked' generic T is on the left side of a conditional

// Lets look at 3 examples :
/*********************************************************************** */
// Example 1 - single conditional : 
/*********************************************************************** */

type SingleDistributive<T> = T extends any ? false : true

// Lets rewrite the examples of distributive conditionals to see what happens when a union is passed:
// The above with a generic parameter of union '"a" | "b"' can be written as the following:

type SingleDistributiveEquals = ("a" extends any ? false : true) | ("b" extends any ? false : true)

type cases1 = [
    Expect<Equal<SingleDistributive<"a" | "b">, SingleDistributiveEquals>>
]

type singleDistributive = SingleDistributive<"a" | "b"> // false


/*********************************************************************** */
// Example 2 - multiple  conditional : 
/*********************************************************************** */
// Here we have multiple conditionals

type MultipleDistributive<T, U = T> = T extends any ? U extends T ? false : true : false

type MultipleDistributiveEquals = ("a" extends any ? "a" extends "a" ? false : true : false)
    | ("a" extends any ? "b" extends "a" ? false : true : false)
    | ("b" extends any ? "a" extends "b" ? false : true : false)
    | ("b" extends any ? "b" extends "b" ? false : true : false)

type cases2 = [
    Expect<Equal<MultipleDistributive<"a" | "b">, MultipleDistributiveEquals>>
]

type multipleDistributive = MultipleDistributive<"a" | "b"> // boolean

/*********************************************************************** */
// Example 3 - isUnion : 
/*********************************************************************** */
// Finally we do the same for the correct isUnion type 

// Here we can see that we do not distribute over U since it is wrapped in '[]' and is thus not 'naked'
// Again we can rewrite it into the following

type IsUnionEquals = ("a" extends any ? ["a" | "b"] extends ["a"] ? false : true : false)
    | ("b" extends any ? ["a" | "b"] extends ["b"] ? false : true : false)


type cases3 = [
    Expect<Equal<IsUnion<"a" | "b">, IsUnionEquals>>
]

type isUnion = IsUnion<"a" | "b"> // true
type isNotUnion = IsUnion<"a"> // false