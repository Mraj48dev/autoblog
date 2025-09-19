import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

const updateSiteSchema = z.object({
  name: z.string().min(1, 'Site name is required').optional(),
  url: z.string().url('Please enter a valid URL').optional(),
  type: z.enum(['WORDPRESS', 'GENERIC']).optional(),
  status: z.string().optional(),
  wpConfig: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    apiUrl: z.string().optional(),
  }).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const site = await prisma.site.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            articles: true,
            automations: true,
            sources: true,
          },
        },
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Get site error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.message : String(error)
          : undefined,
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateSiteSchema.parse(body)

    // Check if site exists and belongs to user
    const existingSite = await prisma.site.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    })

    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    // If URL is being changed, check for duplicates
    if (validatedData.url && validatedData.url !== existingSite.url) {
      const urlExists = await prisma.site.findFirst({
        where: {
          userId: user.id,
          url: validatedData.url,
          NOT: {
            id: id,
          },
        },
      })

      if (urlExists) {
        return NextResponse.json(
          { error: 'You already have a site with this URL' },
          { status: 400 }
        )
      }
    }

    const site = await prisma.site.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData,
        wpConfig: validatedData.wpConfig && (validatedData.type === 'WORDPRESS' || existingSite.type === 'WORDPRESS')
          ? validatedData.wpConfig as any
          : validatedData.type === 'GENERIC'
            ? null
            : existingSite.wpConfig,
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
      message: 'Site updated successfully',
      site,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Update site error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.message : String(error)
          : undefined,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if site exists and belongs to user
    const site = await prisma.site.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      )
    }

    await prisma.site.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({
      message: 'Site deleted successfully',
    })
  } catch (error) {
    console.error('Delete site error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.message : String(error)
          : undefined,
      },
      { status: 500 }
    )
  }
}