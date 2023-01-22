// Simply returns the input but uses generic T type.
// Using generic T the correct literal return type is inferred
function returnInput<T extends string | number>(stringOrNumber: T): T  { // return type T can be inferred and so is optional here
    return stringOrNumber;
}

// Same as above but without generic T
// Here the exact return type is not inferred
function returnInputWeak(stringOrNumber: string | number)  {
  return stringOrNumber;
}

// A conditional return type using function overloads
// Here the return type is narrowed to either string or number
function returnConditional(stringOrNumber: number):  number
function returnConditional(stringOrNumber: string): string
function returnConditional(stringOrNumber: string | number): string | number {
  return typeof stringOrNumber === 'string' ? 'foo' : 42
}

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

let x : string | number = 42
let y : string | number = "foo"
const X = 42;
const Y = "foo"

const xReturn = returnInput(x); // number
const yReturn = returnInput(y); // string

const XReturn = returnInput(X); // 42
const YReturn = returnInput(Y); // "foo"

/***************************************************************/

const xReturnWeak = returnInputWeak(x); // string | number
const yReturnWeak = returnInputWeak(y); // string | number

const XReturnWeak = returnInputWeak(X); // string | number
const YReturnWeak = returnInputWeak(Y); // string | number

/***************************************************************/

const xReturnConditional = returnConditional(x); // number
const yReturnConditional = returnConditional(y); // string

const XReturnConditional = returnConditional(X); // number
const YReturnConditional = returnConditional(Y); // string