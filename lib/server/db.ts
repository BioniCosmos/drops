import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

let prisma: PrismaClient

if (process.env.DATABASE_ENV === 'prod') {
  const connectionString = `${process.env.DATABASE_URL}`
  const adapter = new PrismaNeon({ connectionString })
  prisma = new PrismaClient({ adapter })
} else {
  prisma = new PrismaClient()
}

export default prisma
