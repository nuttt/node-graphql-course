const resolvers = require('../schema/resolvers')
const schema = require('../schema')

describe('Query', () => {
  it('can resolve hello field', async () => {
    const result = await resolvers.Query.hello()
    expect(result).toEqual("Hello GraphQL!")
  })
})


// cannot test auto resolve field
