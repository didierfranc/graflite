# graflite

### What the fuck graflite is ?

Graflite is a basic semantic database.

### When is it useful ?

It perfectly fits for simple graph like project, GraphQL backend ...

### Examples

#### Instancy a database

```js
// you'll get something similar to ReactJS prop-types to type your data
const { string, number, bool } = require('graflite/types')
const Graflite = require('graflite')

// graflite needs a database engine, for example redis
const redis = 'redis://127.0.0.1:6379/0'

// let's create an instance
const db = new Graflite(redis)

// add a node type definition to the database
db.type('character', {
  name: string.isRequired,
  age: number,
  dark: bool,
})
```

#### Use it

```js
// create some characters
const [anakin, luke] = await db.set('character', [
  { name: 'Anakin', age: 46, dark: true },
  { name: 'Luke', age: 19, dark: true },
])

// create a relation
await db.link(anakin, 'fatherOf', luke)

// get by relation
const fatherOfLuke = await db.get('fatherOf', luke) // [{ name: 'Anakin', ...}]

// find by properties
const young = await db.find('character', 'name=Luke') // [{ name: 'Luke', ... }]
const old = await db.find('character', 'age>40') // [{ name: 'Anakin', ...}]
```

#### Seed the database

Just do some `db.set()`

### Todo

- Implement \* in find
- Write proper test
- Externalize method
- Think about bidirectional
- CheckPropTypes throw

### For serious people

This repository is just the result of having some fun with redis basics, if you're looking for straghtforward redis modules  
👉 https://redis.io/modules
