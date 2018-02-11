const { graphql } = require('graphql')
const schema = require('../schema')

describe('hello query', () => {
  it('should hello properly', async () => {
    const query = '{ hello }'
    const response = await graphql(schema, query)
    expect(response.data).toMatchObject({
      hello: "Hello GraphQL!"
    })
  })
})

describe('post', () => {
  it('get correct post when id is provided', async () => {
    const query = `
      query getPost {
        post(id: 20) {
          id
        }
      }
    `

    const response = await graphql(schema, query)
    const { post } = response.data
    // ID type always return as string
    expect(post.id).toEqual('20')
  })
})
