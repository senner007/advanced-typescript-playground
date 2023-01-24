
// Type to verify that the number assigned to property c is the combined length of a[] and b[]
type IsCorrectCount<TObj extends { [key in (Array1 | Array2)]: readonly number[] }, Array1 extends keyof TObj & string, Array2 extends keyof TObj, NumberProp extends keyof TObj & string> =
    [...TObj[Array1], ...TObj[Array2]]['length'] extends TObj[NumberProp]
    ? TObj
    : `Property of ${NumberProp} contains incorrect value. Value is ${TObj[NumberProp] extends number ? TObj[NumberProp] : never} and should have been ${[...TObj[Array1], ...TObj[Array2]]['length'] extends number ? [...TObj[Array1], ...TObj[Array2]]['length'] : never}`

const arrCorrect = [
    {
        a: [1, 2, 3],
        b: [1, 2],
        c: 5
    },
    {
        a: [1, 2, 3],
        b: [1, 2, 3],
        c: 6
    }] as const

const arrIncorrect = [...arrCorrect,
{
    a: [1, 2, 3],
    b: [1, 2, 3],
    c: 7  // should have been 6 here
}] as const


type IsCorrectCountArray<T extends readonly any[], TCopy = T> = T extends readonly [infer First extends { readonly a: readonly number[], readonly b: readonly number[], readonly c: number }, ...infer Rest]
    ? First extends IsCorrectCount<First, "a", "b", "c">
    ? IsCorrectCountArray<Rest, TCopy>
    : IsCorrectCount<First, "a", "b", "c">
    : TCopy


/*********************************************************************** */
// Examples : 
/*********************************************************************** */

// Works
const correct: IsCorrectCountArray<typeof arrCorrect> = arrCorrect

// Compile error:
// "Property of c contains incorrect value. Value is 7 and should have been 6"
const incorrect: IsCorrectCountArray<typeof arrIncorrect> = arrIncorrect