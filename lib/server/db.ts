import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter })

export default prisma
