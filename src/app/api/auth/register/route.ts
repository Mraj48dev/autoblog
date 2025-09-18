import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== Registration API Called ===')

    const body = await request.json()
    console.log('Request body:', { ...body, password: '[HIDDEN]' })

    const { name, email, password } = registerSchema.parse(body)
    console.log('Validation passed for:', { name, email })

    // Check if user already exists
    console.log('Checking for existing user...')
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    console.log(
      'Existing user check result:',
      existingUser ? 'Found' : 'Not found'
    )

    if (existingUser) {
      console.log('User already exists, returning error')
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed successfully')

    // Create user
    console.log('Creating user in database...')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tokensBalance: 100, // Welcome bonus
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tokensBalance: true,
        createdAt: true,
      },
    })
    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
    })

    return NextResponse.json({
      message: 'User created successfully',
      user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues)
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Registration error details:', {
      message: error instanceof Error ? error.message : String(error),
      code:
        error && typeof error === 'object' && 'code' in error
          ? (error as { code: unknown }).code
          : undefined,
      meta:
        error && typeof error === 'object' && 'meta' in error
          ? (error as { meta: unknown }).meta
          : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    )
  }
}
