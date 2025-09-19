import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  console.log('=== DB Debug Endpoint Called ===')

  try {
    console.log('Environment check:')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log(
      'DATABASE_URL starts with:',
      process.env.DATABASE_URL?.substring(0, 20) + '...'
    )

    console.log('Creating Prisma client...')
    const prisma = new PrismaClient()

    console.log('Testing database connection...')

    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Test users table exists
    const userCount = await prisma.user.count()
    console.log('✅ Users table accessible, count:', userCount)

    // Test creating a simple query
    const testQuery = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Raw query successful:', testQuery)

    await prisma.$disconnect()

    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      details: {
        userCount,
        environment: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
      },
    })
  } catch (error) {
    console.error('❌ Database connection failed:', {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === 'object' && 'code' in error
          ? (error as { code: unknown }).code
          : undefined,
      meta:
        error && typeof error === 'object' && 'meta' in error
          ? (error as { meta: unknown }).meta
          : undefined,
    })

    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error),
        details: {
          environment: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20),
        },
      },
      { status: 500 }
    )
  }
}
