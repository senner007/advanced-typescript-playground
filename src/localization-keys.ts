import jsonData from "../localization-data.json"

/*********************************************************************** */
// Case :
// Here we want to compile time validate our json containing localization data.
// The json is an array of objects that each represent a language.
// There are common translations for each word under 'common' and department specific translations
/*********************************************************************** *
// Criteria: 
// Each word can exist only in the common object without a department specific translation
// Each word can have additional department specific translations.
// Words that are translated differently in every single department are not included in the common object. 
// The values of the keys are unimportant
/*********************************************************************** */ 

type JsonData = typeof jsonData[number];
type JsonDataDepartments = JsonData['departments'];

/*********************************************************************** */
// Part 1: Type validate that objects are equal
// If any keys exist in one object and not the other, it will appear as optional (?)
// Solution is to recurse through the object and collect any keys that are optional
/*********************************************************************** */

// Type will return a union of optional keys
type OptionalPropertyOf<T extends object> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>

type OptionalPropertiesFoundRecursively<Obj extends object, K extends keyof Obj> = K extends any 
  ? Obj[K] extends Record<any, any> 
    ? OptionalPropertiesFoundRecursively<Obj[K], keyof Obj[K]>
    : OptionalPropertyOf<Obj> extends infer STRING extends string 
      ? `Error : the following key(s) is/are missing in one of the translations: ${STRING}`
      : never 
  : never

type optionalPropertiesFound = OptionalPropertiesFoundRecursively<JsonData, keyof JsonData>

type objectsAreIdentical<T extends JsonData> = optionalPropertiesFound extends never ? T : optionalPropertiesFound

/*********************************************************************** */
// Part 2: Type validate that non-common words exist only in departments and in all departments  
//
// Solution is to first get all keys in departments.
// Next we get get the keys that only exist in some departments but not all.
// By excluding those from all department keys we can get the keys that exist in all departments.
// Now we can check that these non-common keys (existing in all departments) do not exist under common. 
/*********************************************************************** */

type DepartmentAllKeys<T extends keyof JsonDataDepartments> = T extends any 
  ? keyof JsonDataDepartments[T] 
  : never

type departmentAllKeys = DepartmentAllKeys<keyof JsonDataDepartments>

type PartialDepartmentKeys<T extends keyof JsonDataDepartments, Keys = departmentAllKeys> = Keys extends keyof JsonDataDepartments[T] 
      ? never 
      : Keys
  
type departmentKeys = PartialDepartmentKeys<keyof JsonDataDepartments>;

type DepartMentKeysInCommon<T extends JsonData, Keys extends departmentKeys = departmentKeys> = Keys extends keyof JsonData['common'] 
  ? T 
  : `Error: The folloing department key(s) are/is missing from common:  ${Keys}`

type nonCommonKeys = Exclude<departmentAllKeys, departmentKeys>;

type NonCommonKeysInCommon<T> = T extends keyof JsonData['common'] ? `Error: the key: '${T}' exists in all departments and under common` : JsonData

/*********************************************************************** */
// Lastly we have a type to validate the json
/*********************************************************************** */

const jsonValidated : objectsAreIdentical<DepartMentKeysInCommon<NonCommonKeysInCommon<nonCommonKeys>>>[] = jsonData


