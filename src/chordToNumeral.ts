type baseNotes = "C" | "G"
type baseNoteOctave = `${baseNotes}${octave}`
type numerals = 'I' | 'I6' | 'I64' | 'V' | 'V6' | 'V64'
type octave = 2 | 3 | 4 | 5
type bassAndChord = `${baseNoteOctave}${numerals}`

type NumeralsDictConstraint<T> = {
  [K in keyof T as K extends numerals ? K : never] : T[K] extends bassAndChord ? T[K] : never
}

type NumeralsDict = NumeralsDictConstraint<{
  "I" : `C${octave}${'I' | 'I6' | 'I64'}`
  "V" : `G${octave}${'V' | 'V6' | 'V64'}`
}>

type NumeralKey<Bass extends string, Chord extends string>  = {
  [Key in keyof NumeralsDict]: `${Bass}${Chord}` extends NumeralsDict[Key] ? Key : never
}[keyof NumeralsDict]


interface IObj {
  chords : readonly numerals[],
  bass : readonly baseNoteOctave[],
  numeral : readonly numerals[]
}

const objCorrect = {
  chords : ["I", "V6"],
  bass : ["C3", "G3"],
  numeral : [ "I", "V"]
} as const satisfies IObj

const objIncorrect = {
    chords : ["I", "V6"],
    bass : ["C3", "G3"],
    numeral : [ "V", "V"]
  } as const satisfies IObj
  
type VerifyNumerals<T extends object, Chords extends readonly any[], Basses extends readonly any[], Numerals extends readonly any[]> = 
  Chords extends readonly [infer FirstChord extends string, ...infer ChordsRest extends any[]] 
    ? Basses extends readonly [infer FirstBass extends string, ...infer BassesRest extends any[]]
      ? Numerals extends readonly [infer FirstNumeral, ...infer NumeralsRest extends any[]]  
        ? FirstNumeral extends NumeralKey<FirstBass, FirstChord>
          ? VerifyNumerals<T, ChordsRest, BassesRest, NumeralsRest>
          : never
      : never
    : never 
  : T


const numeralsVerified : VerifyNumerals<typeof objCorrect, typeof objCorrect['chords'], typeof objCorrect['bass'], typeof objCorrect['numeral']> = objCorrect

// compile error
const numeralsIncorrect : VerifyNumerals<typeof objIncorrect, typeof objIncorrect['chords'], typeof objIncorrect['bass'], typeof objIncorrect['numeral']> = objIncorrect
