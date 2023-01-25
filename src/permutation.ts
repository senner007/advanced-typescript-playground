import type { Equal, Expect } from '@type-challenges/utils'

// type to get a union of arrays with all permutations of the members of a string union
type Permutation<T, C= T> = [T] extends [never]
  ? []
  : C extends T
    ? [C, ...Permutation<Exclude<T, C>>]
    : [];


type permutation = Permutation<"A" | "B" | "C">  // ["A", "B", "C"] | ["A", "C", "B"] | ["B", "A", "C"] | ["B", "C", "A"] | ["C", "A", "B"] | ["C", "B", "A"]

// Explanation:
// The condition "C extends T..." is in fact looping over all union members so that the conditional is first called with "'A' extends T..." then "'B' extends T" and so on.
// Therefore it returns 3 arrays each with a nested union of arrays :
type permutationEquivalence  = 
| ["A", ...(["B" , "C"] | ["C" , "B"]) ] 
| ["B", ...(["A" , "C"] |  ["C" , "A"])  ] 
| ["C", ...(["A" , "B"] | ["B" , "A"])]
// this is equal to all permutations: 
type cases = [
    Expect<Equal<permutation, permutationEquivalence>>,
]


