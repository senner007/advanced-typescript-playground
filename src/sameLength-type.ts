// Type to recusively ensure that arrays on object properties are of same length
type SameLength<TArray extends readonly ChordProgression[], TCopy = TArray> = TArray extends readonly [
  infer First extends TArray[0],
  ...infer Rest extends ChordProgression[]
]
  ? First["chords"]["length"] extends First["bass"]["length"]
    ? SameLength<Rest, TCopy>
    : {
      Error: { chords: TArray[0]["chords"]; bass: TArray[0]["bass"] };
      Message: "Number of chords not equal to number of bass notes";
    }
  : TCopy;

// Examples
type ChordProgression = { chords: readonly string[]; bass: readonly string[] };
const arrSame = [
  { chords: ["I", "V"], bass: ["C3", "G2"] },
  { chords: ["I"], bass: ["C3"] },
] as const;

const arrNotSame = [
  ...arrSame, 
  { chords: ["I", "V", "I"], bass: ["C3", "G3"] },
] as const;

// Works
const arrSameTyped: SameLength<typeof arrSame> = arrSame;

// Compile error!
// Here I get a type error as an object with the error and an error message:
// { Error : { chords : [...], bass :  [...] } , Message : 'Number of chords not equal to number of bass notes' }
const arrNotSameTyped: SameLength<typeof arrNotSame> = arrNotSame;


/************************************************************************************************************** */
// Generic version :
/************************************************************************************************************** */

// Type to recusively ensure that arrays on object properties are of same length
type SameLengthGeneric<
  TArray extends readonly { [key in (PropName1 | PropName2)]: readonly string[] }[],
  PropName1 extends string,
  PropName2 extends string,
  TCopy = TArray
> = TArray extends readonly [infer First extends TArray[0], ...infer Rest extends any[]]
  ? First[PropName1]["length"] extends First[PropName2]["length"]
    ? SameLengthGeneric<Rest, PropName1, PropName2, TCopy>
    : {
      Error: [TArray[0][PropName1], TArray[0][PropName2]];
      Message: `Length of ${PropName1} not equal to length of ${PropName2}`;
    }
  : TCopy;


// Examples

type CatsAndDogs = { cats: readonly string[]; dogs: readonly string[] };

const catsAndDogs = [
  { dogs: ["Scooby", "Fido"], cats: ["Whiskers", "Garfield"] },
  { dogs: ["Fido"], cats: ["Whiskers"] },
] as const satisfies Readonly<CatsAndDogs[]>;

const catsAndDogsNotSameLength = [
  ...catsAndDogs, 
  { dogs: ["Scooby", "Fido"], cats: ["Garfield"] }
] as const satisfies Readonly<CatsAndDogs[]>;

// Works
const sameCatsAndDogs: SameLengthGeneric<typeof catsAndDogs, "dogs", "cats"> = catsAndDogs;

// Compile error!
const catsAndDogsNotSame: SameLengthGeneric<typeof catsAndDogsNotSameLength, "dogs", "cats"> =
  catsAndDogsNotSameLength;
