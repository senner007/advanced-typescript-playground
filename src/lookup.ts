type Cat = {
  type: "cat";
  age: number;
  isDomestic: boolean;
  someCatProp: "meow";
};

type Dog = {
  type: "dog";
  age: number;
  isDomestic: boolean;
  someDogProp: "bark";
};

type Fox = {
  type: "fox";
  age: number;
  isDomestic: boolean;
  someFoxProp: "?";
};

type Animal = Cat | Dog | Fox;

const animals = [
  {
    type: "cat",
    age: 23,
    isDomestic: true,
    someCatProp: "meow",
  },
  {
    type: "dog",
    age: 33,
    isDomestic: true,
    someDogProp: "bark",
  },
  {
    type: "fox",
    age: 13,
    isDomestic: false,
    someFoxProp: "?",
  },
] as const satisfies readonly Animal[];

type LookUp<T, TRecord> = Extract<T, TRecord>;

// https://stackoverflow.com/questions/61685168/is-it-possible-to-get-the-keys-from-a-union-of-objects
type GetAllKeys<T> = T extends any ? keyof T : never;

// https://stackoverflow.com/questions/61410242/is-it-possible-to-exclude-an-empty-object-from-a-union
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
type ExcludeEmpty<T> = T extends AtLeastOne<T> ? T : never;

type FilterByKey<T, Key extends PropertyKey> = ExcludeEmpty<{
      [key in keyof T as key extends Key ? key : never]: T[key];
    }>

function filterByKeyValue<
  const Key extends GetAllKeys<TArr[number]>,
  const Value extends TFilterByKey[keyof TFilterByKey],
  TArr extends readonly any[],
  TFilterByKey = FilterByKey<TArr[number], Key>
>(key: Key, value: Value, arr: TArr) {
  return arr.filter((obj): obj is LookUp<TArr[number], Record<Key, Value>> => obj[key] === value);
}

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

const fox = filterByKeyValue("someFoxProp", "?", animals); // Narrowed to array of a single type
const fox2 = filterByKeyValue("isDomestic", false, animals); // Narrowed to array of a single type
const cat = filterByKeyValue("type", "cat", animals); // Narrowed to array of a single type
const dog = filterByKeyValue("age", 33, animals); // Narrowed to array of a single type
const catAndDog = filterByKeyValue("isDomestic", true, animals); // Narrowed to array of a single type

// const foxes: {
//     readonly type: "fox";
//     readonly age: 13;
//     readonly isDomestic: true;
//     readonly someFoxProp: "?";
// }[]

// Compile error
filterByKeyValue("foo", "?", animals); // '"foo"' is not assignable to parameter of type '"someFoxProp" | "someCatProp" | "someDogProp" | "type" | "age" | "isDomestic"'
filterByKeyValue("type", "?", animals); // '"?"' is not assignable to parameter of type '"cat" | "dog" | "fox"'