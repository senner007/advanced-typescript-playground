
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

type LookUp<TObj,Key extends PropertyKey, Value> = Extract<TObj, { [key in Key] : Value}>

type propValues = string | number | boolean // TODO : propValues hardcoded, find better solotion

function filterByType<Value extends TObj[Key], TObj extends { [key: PropertyKey] : propValues }, Key extends PropertyKey>(key : Key, value: Value,  arr: readonly TObj[]) {
    return arr.filter((obj): obj is LookUp<TObj,Key, Value> => obj[key] === value)
}

const foxes = filterByType("age", 13, animals) // Narrowed to array of a single type

// const foxes: {
//     readonly type: "fox";
//     readonly age: 13;
//     readonly isCute: true;
//     readonly someFoxProp: "?";
// }[]
