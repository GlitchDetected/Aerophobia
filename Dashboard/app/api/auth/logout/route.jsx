import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request) {
  try {
    // Clear cookies by setting them with an expired date
    const cookies = [
      serialize('code', '', { maxAge: -1, path: '/' }),
      serialize('access_token', '', { maxAge: -1, path: '/' }),
      serialize('refresh_token', '', { maxAge: -1, path: '/' }),
    ];

    // Extract the origin URL from the request
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`; // Get origin URL (e.g., https://example.com)

    // Create a new response object with dynamic redirection
    const response = NextResponse.redirect(origin); // Redirect to the origin URL

    // Set cookies to expire them
    response.headers.set('Set-Cookie', cookies.join(', '));

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    // Return a 500 status code with a meaningful error message
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function OPTIONS() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return new NextResponse(null, { headers });
}