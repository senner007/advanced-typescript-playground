// Type that uses type recursion to match what is returned from the javascript recursion. 
type Recurse<TPropName extends string, TTimes extends number, Cache extends number[] = []> = {
  [propName in TPropName]: Cache['length'] extends TTimes ? 0 : Recurse<TPropName, TTimes, [42, ...Cache]>; // any number used here to make the array longer (42)
}

function recursionWrapper<TPropName extends string, TTimes extends number>(prop : TPropName, nTimes : TTimes) {
  return objectRecursion(prop, nTimes) as Recurse<TPropName, TTimes>; // here the return type of 'number | object' is overriden 
}

// Javascript recursion
function objectRecursion<TTimes extends number>(prop: string, nTimes: TTimes): number | object {
  if (nTimes === 0) return nTimes;
  return {
      [prop]: objectRecursion(prop, nTimes - 1)
  }
}


const fooObject : { // Works
  "foo": {
      "foo": 0  
  }
} = recursionWrapper("foo", 1)

const barObject : { // Works
  "bar": {
      "bar": {
          "bar": 0  
      }
  }
} = recursionWrapper("bar", 2)

 // @ts-expect-error
const bazObject : { // Compile error! should have been recursionWrapper("baz", 3) 
  "baz": {
      "baz": {
          "baz": {
              "baz": 0
          }
      }
  }
} = recursionWrapper("baz", 2) 
