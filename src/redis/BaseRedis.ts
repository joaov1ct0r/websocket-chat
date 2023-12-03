import Redis from 'ioredis'

export abstract class BaseRedis {
  protected readonly _redis: Redis

  constructor(redis: Redis) {
    this._redis = redis
  }
}
