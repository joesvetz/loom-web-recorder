import { SignJWT, importPKCS8 } from 'jose';
import { NextResponse } from 'next/server';

const PRIVATE_KEY = process.env.LOOM_PRIVATE_KEY;
const PUBLIC_APP_ID = process.env.LOOM_APP_ID;

export async function GET() {
  try {
    const privateKey = await importPKCS8(PRIVATE_KEY, "RS256");
    
    const jwt = await new SignJWT({})
      .setProtectedHeader({ alg: "RS256" })
      .setIssuedAt()
      .setIssuer(PUBLIC_APP_ID)
      .setExpirationTime("2m")
      .sign(privateKey);

    return NextResponse.json({ jwt });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth token' },
      { status: 500 }
    );
  }
}