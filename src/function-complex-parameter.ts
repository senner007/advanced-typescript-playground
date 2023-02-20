// type to ensure first element of first array extends last element of second array
type FirstAndLast<TArr_A extends readonly any[], TArr_B extends readonly any[]> = TArr_A extends readonly [infer First, ...any]
    ? TArr_B extends readonly [...any, infer Last]
    ? First extends Last
    ? [TArr_A, TArr_B]
    : First | Last | 'Error : First element in first array does not extend last element in last array'
    : never
    : never

type t = FirstAndLast<readonly [1, 2, 3], readonly [1, 2, 1]>

function func<
    TArr_A extends readonly any[],
    TArr_B extends readonly any[],
>(...args: FirstAndLast<TArr_A, TArr_B>) {
    return args
}

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

// Works
// first element in first array equals last element in last array
func([1, 2, 3] as const, [1, 1, 1] as const)
func([{a : "3"}, 2, 3] as const, [1, 1, {a : "3"}] as const)
func([[1,2,3,4], 2, 3] as const, [1, 1, [1,2,3,4]] as const)

// Compile error
// "Error : First element does not extend last" | 1 | 2
func([1, 2, 3] as const, [1, 1, 2] as const)
func([{a : "4"}, 2, 3] as const, [1, 1, {a : "3"}] as const)
func([[1,2,3], 2, 3] as const, [1, 1, [1,2,3,4]] as const)
