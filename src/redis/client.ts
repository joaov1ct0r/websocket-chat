import Redis from 'ioredis'

export interface RedisClientImp {
  get getRedis(): Redis
}

export class RedisClient implements RedisClientImp {
  private readonly _redis: Redis

  constructor() {
    this._redis = new Redis({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
    })
  }

  get getRedis(): Redis {
    return this._redis
  }
}
