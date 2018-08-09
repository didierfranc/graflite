/* eslint-disable import/no-extraneous-dependencies */
const Graflite = require('graflite')
const { number, string, bool } = require('graflite/types')
const checkPropTypes = require('graflite/db/helpers/types/checkPropTypes')

const uri = 'redis://127.0.0.1:6379'

const character = {
  name: string.isRequired,
  age: number,
  dark: bool,
}

const object = {
  name: 'Han Solo',
  age: 63,
  dark: true,
}

test('check types', () => {
  const testObject = {
    ...object,
    human: 'not typed',
  }
  const errors = checkPropTypes(character, testObject, 'character')
  expect(errors.length).toBe(1)
})

test('db set', async () => {
  const db = new Graflite(uri)
  db.type('character', character)

  const ids = await db.set('character', [object])

  expect(ids).toBeDefined()
})

test('the test', async () => {
  const db = new Graflite(uri)
  db.type('character', character)

  const [anakin, luke] = await db.set('character', [
    { name: 'Anakin', age: 46, dark: true },
    { name: 'Luke', age: 19, dark: false },
  ])

  await db.link(anakin, 'fatherOf', luke)

  const fatherOfLuke = await db.get('fatherOf', luke)
  const young = await db.find('character', 'name=Luke')
  const old = await db.find('character', 'age>40')

  expect(fatherOfLuke.name).toBeDefined()
  expect(young[0]).toBeDefined()
  expect(old[0]).toBeDefined()
})
