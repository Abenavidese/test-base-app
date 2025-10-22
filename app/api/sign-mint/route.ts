import { NextRequest, NextResponse } from 'next/server';
import { keccak256, toUtf8Bytes, Wallet, solidityPackedKeccak256, concat, getBytes } from 'ethers';

// Mock private key para el backend issuer (EN PRODUCCIÓN usar variable de entorno segura)
const BACKEND_ISSUER_PRIVATE_KEY = process.env.BACKEND_ISSUER_PRIVATE_KEY || 
  '0x1234567890123456789012345678901234567890123456789012345678901234';

// Mock database de códigos ya usados
const USED_CODES = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { to, eventId, tokenURI, code } = await request.json();
    
    if (!to || !eventId || !tokenURI || !code) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verificar formato de dirección
    if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    // Marcar código como usado (en producción, verificar en DB primero)
    const codeUpper = code.toUpperCase();
    if (USED_CODES.has(codeUpper)) {
      return NextResponse.json(
        { error: 'Code already used' },
        { status: 400 }
      );
    }
    
    USED_CODES.add(codeUpper);

    // Crear wallet del backend issuer
    const issuerWallet = new Wallet(BACKEND_ISSUER_PRIVATE_KEY);
    
    // Generar el hash exactamente como el contrato espera
    // BasicMerch._verifySignature hace: keccak256(abi.encodePacked(_to, _eventId, _tokenURI))
    const messageHash = solidityPackedKeccak256(
      ['address', 'uint256', 'string'],
      [to, eventId, tokenURI]
    );

    // El contrato luego hace: keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash))
    // Replicamos exactamente esto usando concat para concatenar bytes:
    const prefix = toUtf8Bytes('\x19Ethereum Signed Message:\n32');
    const ethSignedMessageHash = keccak256(concat([prefix, getBytes(messageHash)]));

    // Firmamos el hash final usando signDigest (sin agregar prefijo adicional)
    const signature = await issuerWallet.signingKey.sign(ethSignedMessageHash)
    
    console.log('Signing parameters:', {
      to,
      eventId,
      tokenURI,
      messageHash,
      ethSignedMessageHash,
      signer: issuerWallet.address,
      signatureR: signature.r,
      signatureS: signature.s,
      signatureV: signature.v
    });

    // Serializar la firma en formato que espera el contrato (r + s + v)
    const serializedSignature = signature.serialized;

    return NextResponse.json({
      signature: serializedSignature,
      eventId: Number(eventId),
      tokenURI,
      issuer: issuerWallet.address,
      messageHash,
      ethSignedMessageHash
    });

  } catch (error) {
    console.error('Error signing mint:', error);
    return NextResponse.json(
      { error: 'Failed to sign mint' },
      { status: 500 }
    );
  }
}