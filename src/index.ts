import http from 'http'
import express from 'express'
import { SocketFactory, SocketFactoryImp } from '@Factory/socket'
import { RedisClient } from '@Redis/client'

const app = express()
const server = http.createServer(app)
const redis = new RedisClient().redis
const socketFactory: SocketFactoryImp = new SocketFactory(server, redis)
const socket = socketFactory.create()
socket.init()
