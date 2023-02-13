
// source : https://mindcomponents.com/advanced-typescript-patterns-part-1/

// This type takes 2 object types and creates an exclusive union type.
// a key from the other object with a value of never is added to each object type
type ExclusiveUnion<T, U> = (T & Neverify<Omit<U, keyof T>>) | (U & Neverify<Omit<T, keyof U>>)

// This gets an interface and make all its properties optional and never
type Neverify<T> = Partial<Record<keyof T, never>>

interface Common {
    className: string
}
interface Url extends Common {
    url: string
}
interface To extends Common {
    to: string
}

// unions are not exclusive in themselves.
// Here we see that the union can hold either or both :

const nonExclusive1: To | Url = {
    className: "32",
    url: "ds",
}

const nonExclusive2: To | Url = {
    className: "32",
    to: "ds",
}

// both allowed:
const nonExclusive3: To | Url = {
    className: "32",
    url: "ds",
    to: "dsd",
}

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

// Here only one or the other is allowed:
const exclusive: ExclusiveUnion<Url, To> = {
    className: "32",
    url: "ds"
}

// compile error! 
const exclusive2: ExclusiveUnion<Url, To> = {
    className: "32",
    url: "ds",
    to : "ds"
}

