// Test for uniqueness
// Taken from :
// https://ja.nsommer.dk/articles/type-checked-unique-arrays.html

type InArray<T, X> =
    // See if X is the first element in array T
    T extends readonly [X, ...infer _Rest]
    ? true
    : // If not, is X the only element in T?
    T extends readonly [X]
    ? true
    : // No match, check if there's any elements left in T and loop recursive
    T extends readonly [infer _, ...infer Rest]
    ? InArray<Rest, X>
    : // There's nothing left in the array and we found no match
    false;

export type UniqueArray<T> = T extends readonly [infer X, ...infer Rest]
    ? // We've just extracted X from T, having Rest be the remaining values.
    // Let's see if X is in Rest, and if it is, we know we have a duplicate
    InArray<Rest, X> extends true
    ? ["Encountered value with duplicates:", X]
    : // X is not duplicated, move on to check the next value, and see
    // if that's also unique.
    readonly [X, ...UniqueArray<Rest>]
    : // T did not extend [X, ...Rest], so there's nothing to do - just return T
    T;

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

const arr = [
    {
        Chords: ["I", "V6"],
        Bass: ["C3", "G3"],
    },
    {
        Chords: ["I", "V"],
        Bass: ["C3", "G3"],
    },
] as const;

// Works
const areUnique: UniqueArray<typeof arr> = arr;

const arr2 = [ // Objects are the same
    {
        Chords: ["I", "V"],
        Bass: ["C3", "G3"],
    },
    {
        Chords: ["I", "V"],
        Bass: ["C3", "G3"],
    },
] as const;

// Compile Error: 
// ["Encountered value with duplicates:", {

//     readonly Chords: readonly ["I", "V"];
//     readonly Bass: readonly ["C3", "G3"];
// }]  
const arrNotUniqueElements: UniqueArray<typeof arr2> = arr2;
