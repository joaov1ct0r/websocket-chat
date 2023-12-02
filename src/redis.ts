import Redis from 'ioredis'
import { IUserData } from '@Socket'

export interface IIORedis {
  set(channel: string, data: IUserData[]): Promise<void>
  get(channel: string): Promise<string>
  publish(channel: string, user: string, message: string): Promise<void>
  subscribe(
    subscribedChannel: string,
    callback: (message: string) => void,
  ): Promise<void>
}

export default class IORedis implements IIORedis {
  private _redis: Redis

  constructor(host: string, port: number) {
    this._redis = new Redis({ host, port })
  }

  public async set(channel: string, data: IUserData[]): Promise<void> {
    await this._redis.set(channel, JSON.stringify(data), (error) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }
    })
  }

  public async get(channel: string): Promise<string> {
    const messages = await this._redis.get(channel, (error, result) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }

      if (result === null || result === undefined) {
        return JSON.stringify([])
      }

      return result
    })

    return messages as string
  }

  public async publish(
    channel: string,
    user: string,
    message: string,
  ): Promise<void> {
    await this._redis.publish(
      channel,
      JSON.stringify({
        user,
        message,
      }),
      (error) => {
        if (error) {
          throw new Error(`Erro no redis - ${error}`)
        }
      },
    )
  }

  public async subscribe(
    subscribedChannel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    await this._redis.subscribe(subscribedChannel, (error, result) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }

      const message = result as string

      callback(message)
    })
  }
}
