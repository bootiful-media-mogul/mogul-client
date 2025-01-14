import { Client } from '@urql/core'

export default class Mogul {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async user(): Promise<User> {
    const query = `
            query { 
             me { id,   name, email, givenName, familyName  } 
            } 
    `
    const result = await this.client.query(query, {})
    const me = result.data['me']
    return new User(me.id as number, me.name, me.email, me.givenName, me.familyName)
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

export class User {
  name: string
  email: string
  givenName: string
  familyName: string
  id: number

  // materialized view
  readonly displayName: string

  constructor(id: number, name: string, email: string, givenName: string, familyName: string) {
    this.name = name
    this.id = id
    this.email = email
    this.givenName = givenName
    this.familyName = familyName
    this.displayName = this.givenName + ' ' + this.familyName + ' (' + this.email + ')'
  }
}
