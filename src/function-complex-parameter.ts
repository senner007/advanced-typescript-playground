// type to ensure first element of first array extends last element of second array
type FirstAndLast<TArr_A extends readonly any[], TArr_B extends readonly any[]> = TArr_A extends readonly [infer First, ...infer Rest]
    ? TArr_B extends readonly [...infer Start, infer Last]
    ? First extends Last
    ? [TArr_A, TArr_B]
    : First | Last | 'Error : First element does not extend last'
    : never
    : never

type t = FirstAndLast<readonly [1, 2, 3], readonly [1, 2, 1]>

function func<
    TArr_A extends readonly any[],
    TArr_B extends readonly any[],
>(...args: FirstAndLast<TArr_A, TArr_B>) {
    return args
}

// Works
// first element: 1 equals last element : 1
const works = func([1, 2, 3] as const, [1, 1, 1] as const)

// Compile error
// "Error : First element does not extend last" | 1 | 2
const error = func([1, 2, 3] as const, [1, 1, 2] as const)
