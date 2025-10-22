import { NextRequest, NextResponse } from 'next/server';

// Mock database de códigos válidos para testing
const VALID_CODES = new Set([
  'EVENT2025',
  'DEMO123',
  'TEST456',
  'BLOCKCHAIN789',
  'BASE2025',
  'MERCH001'
]);

// Mock database de códigos ya usados
const USED_CODES = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }

    // Verificar si el código es válido
    if (!VALID_CODES.has(code.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid code', status: 'CLAIM_INVALID' },
        { status: 400 }
      );
    }

    // Verificar si el código ya fue usado
    if (USED_CODES.has(code.toUpperCase())) {
      return NextResponse.json(
        { error: 'Code already used', status: 'CLAIM_USED' },
        { status: 400 }
      );
    }

    // Mock eventId generation (en producción sería del DB)
    const eventId = Math.floor(Math.random() * 1000000) + 1;
    const tokenURI = `ipfs://QmMockHash${eventId}`;
    
    return NextResponse.json({
      valid: true,
      status: 'CLAIM_VALID',
      eventId,
      tokenURI,
      message: 'Code is valid and ready for minting'
    });

  } catch (error) {
    console.error('Error validating code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}