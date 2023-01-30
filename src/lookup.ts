
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

type propValues = string | number | boolean | undefined // TODO : propValues hardcoded, find better solotion

type GetKey<T> = T extends any ? keyof T : never
type GetValues<T, Key extends PropertyKey> = T extends any ? ExcludeEmpty<{
    [key in keyof T as key extends Key ? key : never]: T[key]
}> : never

// https://stackoverflow.com/questions/61410242/is-it-possible-to-exclude-an-empty-object-from-a-union
type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
type ExcludeEmpty<T> = T extends AtLeastOne<T> ? T : never; 

 
function filterByType<Value extends GetValues<TObj,Key>[keyof GetValues<TObj,Key>] & TObj[Key], TObj extends { [key: PropertyKey] : propValues }, Key extends GetKey<TObj>>(key : Key, value: Value,  arr: readonly TObj[]) {
    return arr.filter((obj): obj is LookUp<TObj,Key, Value> => obj[key] === value)
}

const foxes = filterByType("someFoxProp", "?" , animals) // Narrowed to array of a single type

// const foxes: {
//     readonly type: "fox";
//     readonly age: 13;
//     readonly isCute: true;
//     readonly someFoxProp: "?";
// }[]
