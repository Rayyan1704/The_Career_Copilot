import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromDocxFlow } from '@/lib/flows/extract-text-from-docx';

export async function POST(request: NextRequest) {
  try {
    const { dataUri } = await request.json();
    
    if (!dataUri) {
      return NextResponse.json(
        { error: 'Data URI is required' },
        { status: 400 }
      );
    }

    const result = await extractTextFromDocxFlow({ dataUri });
    
    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from DOCX file' },
      { status: 500 }
    );
  }
}