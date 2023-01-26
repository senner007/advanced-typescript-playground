// type to ensure first element of first array extends last element of second array
type FirstAndLast<TArr_A extends readonly any[], TArr_B extends readonly any[]> = TArr_A extends readonly [infer First, ...infer Rest]
    ? TArr_B extends readonly [...infer Start, infer Last]
    ? First extends Last
    ? { a: TArr_A, b: TArr_B }
    : First | Last | 'Error : First element does not extend last'
    : never
    : never

type t = FirstAndLast<readonly [1, 2, 3], readonly [1, 2, 1]>

function func<
    TArr_A extends readonly any[],
    TArr_B extends readonly any[],
>(a: FirstAndLast<TArr_A, TArr_B>) {
    return a
}

// Works
// first element: 1 equals last element :1
const works = func({ a: [1, 2, 3], b: [1, 1, 1]} as const)

// Compile error
// "Error : First element does not extend last" | 1 | 2
const error = func({ a: [1, 2, 3], b: [1, 1, 2]} as const)
