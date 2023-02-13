// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<['foo', 'bar', 'baz']>

type Combination<T extends string[], U = T[number], U1 = U> =
  U extends string
  ? U | `${U} ${Combination<[], Exclude<U1, U>>}`
  : never

// the condition in type Combination is distributed over the union type that is returned from the T[number] operation 
// So for the string 'a' the iteration will proceed as follows
type a = 'a' | `${'a'} ${Combination<[], 'b' | 'c'>}`
// which equals : 
type a1 = 'a' | `${'a'} ${'b' | `${'b'} ${Combination<[], 'c'>}` | 'c' | `${'c'} ${Combination<[], 'b'>}`}`
// which equals 
type a_comb = 'a' | `${'a'} ${'b' | `${'b'} ${'c' | `${'c'} ${never}`}` | 'c' | `${'c'} ${'b' | `${'b'} ${never}`}`}` // "a" | "a b" | "a c" | "a b c" | "a c b"

// for the remaining members of the union 'a' | 'b' | 'c', the recursion will run as follows
type b_comb = 'b' | `${'b'} ${('a' | `${'a'} ${'c' | 'c'}`) | ('c' | `${'c'} ${'a' | 'a'}`)}` // "b c" | "b" | "b a" | "b a c" | "b c a"

type c_comb = 'c' | `${'c'} ${('a' | `${'a'} ${'b' | 'b'}`) | ('b' | `${'b'} ${'a' | 'a'}`)}` // "c" | "c b" | "c a" | "c a b" | "c b a"


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Combination<['foo', 'bar', 'baz']>,
    'foo' | 'bar' | 'baz' | 'foo bar' | 'foo bar baz' | 'foo baz' | 'foo baz bar' | 'bar foo' | 'bar foo baz' | 'bar baz' | 'bar baz foo' | 'baz foo' | 'baz foo bar' | 'baz bar' | 'baz bar foo'>>,
  Expect<Equal<Combination<['a', 'b', 'c']>, a_comb | b_comb | c_comb>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/8767/answer
  > View solutions: https://tsch.js.org/8767/solutions
  > More Challenges: https://tsch.js.org
*/