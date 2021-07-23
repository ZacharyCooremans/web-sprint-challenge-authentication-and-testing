const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

describe('[GET] /api/jokes', () => {
  it('should return 401', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
  })

  it('should return json', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.type).toBe('application/json')
  })
})

const testData = { username: 'Tim', password: '1234' }

describe('[POST]/api/auth/register', () => {
  it('Valid request returning status 201', async () => {
    await db('users').truncate()
    const res = await request(server).post('/api/auth/register').send(testData)
    expect(res.status).toBe(201)
  })

  it('invalid request returning status: 500', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        username: "t",
        password: ""
      })

    expect(res.status).toBe(422)
  })
})

describe('[POST]/api/auth/login', () => {
  it('returns status 500 when credentials are provided', async () => {
    const res = await request(server).post('/api/auth/login').send(testData)
    expect(res.status).toBe(500)
  })

  it('responds with correct error if credentials are invalid', async () => {
    const res = await request(server).post('/api/auth/login')
      .send({
        username: 't',
        password: 'nothing'
      })
    expect(res.status).toBe(500)
  })
})
