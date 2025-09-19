import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

const createSiteSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  url: z.string().url('Please enter a valid URL'),
  type: z.enum(['WORDPRESS', 'GENERIC']),
  wpConfig: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    apiUrl: z.string().optional(),
  }).optional(),
})

export async function GET(request: NextRequest) {
  try {
    console.log('Environment check:', {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    })

    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sites = await prisma.site.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        url: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            automations: true,
          },
        },
      },
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error('Get sites error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, url, type, wpConfig } = createSiteSchema.parse(body)

    // Check if user already has a site with this URL
    const existingSite = await prisma.site.findFirst({
      where: {
        userId: user.id,
        url: url,
      },
    })

    if (existingSite) {
      return NextResponse.json(
        { error: 'You already have a site with this URL' },
        { status: 400 }
      )
    }

    const site = await prisma.site.create({
      data: {
        name,
        url,
        type,
        userId: user.id,
        wpConfig: wpConfig && type === 'WORDPRESS' ? wpConfig as any : null,
      },
      select: {
        id: true,
        name: true,
        url: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: 'Site created successfully',
      site,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create site error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}