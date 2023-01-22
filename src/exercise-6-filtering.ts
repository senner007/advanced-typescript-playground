// from https://typescript-exercises.github.io/#exercise=6&file=%2Findex.ts
/*

Intro:

    Filtering requirements have grown. We need to be
    able to filter any kind of Persons.

Exercise:

    Fix typing for the filterPersons so that it can filter users
    and return User[] when personType='user' and return Admin[]
    when personType='admin'. Also filterPersons should accept
    partial User/Admin type according to the personType.
    `criteria` argument should behave according to the
    `personType` argument value. `type` field is not allowed in
    the `criteria` field.

Higher difficulty bonus exercise:

    Implement a function `getObjectKeys()` which returns more
    convenient result for any argument given, so that you don't
    need to cast it.

    let criteriaKeys = Object.keys(criteria) as (keyof User)[];
    -->
    let criteriaKeys = getObjectKeys(criteria);

*/

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

type Person = User | Admin;

const persons: Person[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' },
    { type: 'user', name: 'Wilson', age: 23, occupation: 'Ball' },
    { type: 'admin', name: 'Agent Smith', age: 23, role: 'Anti-virus engineer' }
];

function logPerson(person: Person) {
    console.log(
        ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
    );
}

function getObjectKeys<T extends object>(criteria: T) {
    return Object.keys(criteria) as (keyof T)[];
}

type UserOrAdmin<T> = T extends 'user' ? User : Admin


function filterPersons<TString extends 'user' | 'admin'>(persons: Person[], personType: TString, criteria: Partial<UserOrAdmin<TString>>) {
    return (persons.filter((person) => person.type === personType) as UserOrAdmin<TString>[])
        .filter((person) => {
            let criteriaKeys = getObjectKeys(criteria);
            return criteriaKeys.every((fieldName) => {
                return person[fieldName] === criteria[fieldName];
            });
        })
}

// Alternative soultion with function overloads
function filterPersonsAlternate(persons: Person[], personType: 'user', criteria: Partial<Omit<User, 'type'>>): User[];
function filterPersonsAlternate(persons: Person[], personType: 'admin', criteria: Partial<Omit<Admin, 'type'>>): Admin[];
function filterPersonsAlternate(persons: Person[], personType: string, criteria: Partial<Person>): Person[] {
    return persons
        .filter((person) => person.type === personType)
        .filter((person) => {
            let criteriaKeys = getObjectKeys(criteria);
            return criteriaKeys.every((fieldName) => {
                return person[fieldName] === criteria[fieldName];
            });
        });
}

/*********************************************************************** */
// Examples : 
/*********************************************************************** */

const usersOfAge23 = filterPersons(persons, 'user', { age: 23 }); // User[]
const adminsOfAge23 = filterPersons(persons, 'admin', { age: 23 }); // Admin[]

console.log('Users of age 23:');
usersOfAge23.forEach(logPerson);

console.log('Admins of age 23:');
adminsOfAge23.forEach(logPerson);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
