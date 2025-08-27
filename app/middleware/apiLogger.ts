import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/libs/prismadb'

export async function apiLogger(
  request: NextRequest,
  response: NextResponse,
  userId?: string
) {
  const start = Date.now();
  let requestBody: string | undefined;
  let responseBody: string | undefined;

  try {
    // Clone request to read body if it exists
    if (request.body) {
      const clonedReq = request.clone();
      requestBody = await clonedReq.text();
    }

    // Clone response to read body
    if (response.body) {
      const clonedRes = response.clone();
      responseBody = await clonedRes.text();
    }

    const duration = Date.now() - start;

    // Create API log entry
    await prisma.apiLog.create({
      data: {
        method: request.method,
        url: request.url,
        status: response.status,
        userId: userId ? userId : undefined,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        requestBody: requestBody,
        responseBody: responseBody,
        duration: duration,
      }
    });

    return response;
  } catch (error) {
    console.error('Failed to log API request:', error);
    // Don't block the request if logging fails
    return response;
  }
}
