import type { Equal, Expect } from '@type-challenges/utils'

type baseNotes = "C" | "G"
type baseNoteOctave = `${baseNotes}${octave}`
type numerals = 'I' | 'I6' | 'I64' | 'V' | 'V6' | 'V64'
type octave = 2 | 3 | 4 | 5
type bassAndChord = `${baseNoteOctave}${numerals}`

// Constrain the NumeralsDict type entries.
type NumeralsDictConstraint<T> = {
    [K in keyof T as K extends numerals ? K : never]: T[K] extends bassAndChord ? T[K] : never
}

type NumeralsDict = {
    "I": `C${octave}${'I' | 'I6' | 'I64'}`
    "V": `G${octave}${'V' | 'V6' | 'V64'}`
}

type cases = [
    Expect<Equal<NumeralsDict, NumeralsDictConstraint<NumeralsDict>>>
]

interface IObj {
    chords: readonly numerals[],
    bass: readonly baseNoteOctave[],
    numeral: readonly numerals[]
}

// Type to ensure that the supplied numeral matches the chord and bass
type GetCorrectNumeral<Bass extends string, Chord extends string> = {
    [Key in keyof NumeralsDict]: `${Bass}${Chord}` extends NumeralsDict[Key] ? Key : never
}[keyof NumeralsDict]

// Recurse over all elements in property arrays
type VerifyNumerals<T extends object, Chords extends readonly any[], Basses extends readonly any[], Numerals extends readonly any[]> =
    Chords extends readonly [infer FirstChord extends string, ...infer ChordsRest extends any[]]
        ? Basses extends readonly [infer FirstBass extends string, ...infer BassesRest extends any[]]
            ? Numerals extends readonly [infer FirstNumeral extends string, ...infer NumeralsRest extends any[]]
                ? FirstNumeral extends GetCorrectNumeral<FirstBass, FirstChord>
                    ? VerifyNumerals<T, ChordsRest, BassesRest, NumeralsRest>
                    : `Numeral ${FirstNumeral} should have been ${GetCorrectNumeral<FirstBass, FirstChord>} in: ` & T
            : never
        : never
    : T

    
/*********************************************************************** */
// Examples : 
/*********************************************************************** */

/*********************************************************************** */
// WORKING examples:
/*********************************************************************** */
const objCorrect = {
    chords: ["I", "V6"],
    bass: ["C3", "G3"],
    numeral: ["I", "V"]
} as const satisfies IObj
// Works
const numeralsVerified: VerifyNumerals<typeof objCorrect, typeof objCorrect['chords'], typeof objCorrect['bass'], typeof objCorrect['numeral']> = objCorrect

/*********************************************************************** */
// COMPILE ERROR examples:
/*********************************************************************** */

const objIncorrect = { ...objCorrect, numeral: ["V", "V"] } as const satisfies IObj
// "Numeral V should have been I in: " & {
//     readonly numeral: readonly ["V", "V"];
//     readonly chords: readonly ["I", "V6"];
//     readonly bass: readonly ["C3", "G3"];
// }
const numeralsIncorrect: VerifyNumerals<typeof objIncorrect, typeof objIncorrect['chords'], typeof objIncorrect['bass'], typeof objIncorrect['numeral']> = objIncorrect


// Example with array of objects 
const arrayCorrect =  [{
    chords: ["I", "V6"],
    bass: ["C3", "G3"],
    numeral: ["I", "V"]
},{
    chords: ["I", "V6"],
    bass: ["C3", "G3"],
    numeral: ["V", "V"] // V should have been I
},{
    chords: ["I", "V6"],
    bass: ["C3", "G3"],
    numeral: ["I", "V"]
}] as const satisfies readonly IObj[]

// Recurse over all elements in array ( could be made generic )
type VerifyNumeralsArray<T extends readonly any[], TCopy = T> = T extends readonly [infer First extends IObj, ...infer Rest] 
    ? First extends VerifyNumerals<First, First['chords'], First['bass'], First['numeral']> 
        ? VerifyNumeralsArray<Rest, TCopy>
        : VerifyNumerals<First, First['chords'], First['bass'], First['numeral']>
    : TCopy

// "Numeral V should have been I in: " & {
//     readonly chords: readonly ["I", "V6"];
//     readonly bass: readonly ["C3", "G3"];
//     readonly numeral: readonly ["V", "V"];
// }
const arrayNumeralsVerified: VerifyNumeralsArray<typeof arrayCorrect> = arrayCorrect