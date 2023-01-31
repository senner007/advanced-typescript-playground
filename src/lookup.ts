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

type LookUp<TObj, Key extends PropertyKey, Value> = Extract<TObj, { [key in Key]: Value }>;

type GetAllKeys<T> = T extends any ? keyof T : never;
type GetAllValues<T> = T extends any ? T[keyof T] : never;

type GetValueByKey<T, Key extends PropertyKey> = T extends any
  ? ExcludeEmpty<{
      [key in keyof T as key extends Key ? key : never]: T[key];
    }>
  : never;

// https://stackoverflow.com/questions/61410242/is-it-possible-to-exclude-an-empty-object-from-a-union
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
type ExcludeEmpty<T> = T extends AtLeastOne<T> ? T : never;

function filterByType<
  const Key extends GetAllKeys<TArr[number]>,
  const Value extends GetValueByKey<TArr[number], Key>[keyof GetValueByKey<TArr[number], Key>],
  TArr extends readonly any[]
>(key: Key, value: Value, arr: TArr) {
  return arr.filter((obj): obj is LookUp<TArr[number], Key, Value> => obj[key] === value);
}

const fox = filterByType("type", "fox", animals); // Narrowed to array of a single type

// const foxes: {
//     readonly type: "fox";
//     readonly age: 13;
//     readonly isDomestic: true;
//     readonly someFoxProp: "?";
// }[]
