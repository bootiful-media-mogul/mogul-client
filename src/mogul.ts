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

  async todayStatus(): Promise<MogulStatus> {
    const query = `
            query { 
             mogulStatusToday { id, mogulId, date } 
            } 
    `
    const result = await this.client.query(query, {})
    const status = result.data['mogulStatusToday']
    return new MogulStatus(status.id as number, status.mogulId as number, status.date)
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

/**
 * a single day in the life of a mogul. this -- and not the mogul -- is what
 * publications attach to, so that they stay bounded to a day instead of piling up
 * against an identity that never ends.
 */
export class MogulStatus {
  readonly id: number
  readonly mogulId: number
  readonly date: string

  constructor(id: number, mogulId: number, date: string) {
    this.id = id
    this.mogulId = mogulId
    this.date = date
  }
}
