import { PrismaInstrumentation } from '@prisma/instrumentation'
import { registerOTel } from '@vercel/otel'

export async function register() {
  registerOTel({ instrumentations: [new PrismaInstrumentation()] })
}
