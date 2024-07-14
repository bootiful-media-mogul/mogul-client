import { Client } from '@urql/core'

export default class Mogul {

  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async me(): Promise<string> {
    const query = `
            query { 
             me { name } 
            } 
    `
    const result = await this.client.query(query, {})
    return this.indexIntoQueryField(result, 'me')['name'] as string
  }

  private indexIntoQueryField(result: any, resultKey: string): any {
    return result.data[resultKey]
  }

}
