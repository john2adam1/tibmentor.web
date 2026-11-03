import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        let finalUrl = url;
        if (!url.startsWith('http')) {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://dev.imedteam.uz').replace(/\/$/, '');
            finalUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        }

        const response = await fetch(finalUrl);

        if (!response.ok) {
            return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
        }

        const blob = await response.blob();
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', 'inline; filename="document.pdf"');

        return new NextResponse(blob, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error fetching PDF:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
