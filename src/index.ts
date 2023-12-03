import http from 'http'
import express from 'express'
import SocketIO from '@Socket'
import { RedisClient } from '@Redis/client'

const app = express()
const server = http.createServer(app)
const redis = new RedisClient()
const socket = new SocketIO(Number(process.env.SOCKET_PORT), server, redis)
socket.init()
