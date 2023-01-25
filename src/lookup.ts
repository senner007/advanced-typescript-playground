
type Cat = {
    type: 'cat',
    age: number,
    isCute : boolean,
    someCatProp : "meow"
}

type Dog = {
    type: 'dog',
    age: number
    isCute : boolean,
    someDogProp : "bark"
}

type Fox = {
    type: 'fox',
    age: number
    isCute : boolean,
    someFoxProp : "?"
}

type Animal = Cat | Dog | Fox

const animals = [
    {
        type: 'cat',
        age: 23,
        isCute: false,
        someCatProp : "meow"
    },
    {
        type: 'dog',
        age: 33,
        isCute: false,
        someDogProp : "bark"
    },
    {
        type: 'fox',
        age: 13,
        isCute: true,
        someFoxProp : "?"
    }
] as const satisfies readonly Animal[]

type LookUp<TObj, TValue> = TObj extends { [Key in keyof TObj]: TObj[Key] extends TValue ? never : TObj[Key] }
    ? never
    : TObj;

type propValues = string | number | boolean // TODO : propValues hardcoded, find better solotion

function filterByType<TValue extends TObj[C], TObj extends { [key in C] : propValues }, C extends PropertyKey>(criteria : C, value: TValue,  arr: readonly TObj[]) {
    return arr.filter((obj): obj is LookUp<TObj, TValue> => obj[criteria] === value)
}

const foxes = filterByType("type", "fox", animals) // Narrowed to array of a single type

// const foxes: {
//     readonly type: "fox";
//     readonly age: 13;
//     readonly isCute: true;
//     readonly someFoxProp: "?";
// }[]
