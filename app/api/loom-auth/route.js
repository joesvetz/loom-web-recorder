import { SignJWT, importPKCS8 } from 'jose';
import { NextResponse } from 'next/server';

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCdwK/jGh6K0lvE
a98ggylbl9tJ2p/r7cnqihl8Ipy70Nnnw8/NItb9K/xbqXbVE9E6zrjZNZct0JSG
IR6G9dcTPuTZEpZEv/XseWiqugSsG0JAJpHubwCx1ZO3nOqaIEYuitvAcuse6yo5
yFKveSf1vKhbCgReb35YYCu8nNKLCCdQZltedykIx2ytVOqwLT8K0vou2y53N7JI
jnZ7wxZ71Gzn392UMEwe57V6egEQwnfa+47ywglbVgcR7gtZzOHEDAxZNtxW/qzw
a2WokGvZQsVPQ0fivT8l+qGOJauVjn3SN1VXZTUg+l4fow5E8sRQWQBQoYp3adFZ
c/3TR4yHAgMBAAECggEAA/9nqNzdYuDR0oVC5Xmgoq5gFqijq0CFAJySglxq/GRE
7jELVkRIjnUYgBPBuMSeMlwd8xZlYZPXlhtgwREza7MJIAPu97vYz5VQ20+ISGEO
3L4dewPB6llibof1EGxtwUaWxKaLSGbm1KM7wf0GaWo05szqL22qSTMNG+QdfpU8
HmYvxEwFt16XQHLRmYsdLSDK+x/KBjZPRTBv0gxW8Ycci1P0ohPCMWuYf63mJgxA
LEnogWsXIZOq6Exo2HiHPWXQYV8yx9cWR3fCvtwP1f/TzGk1e57lluRdSgzWdz8l
A7P1yngy2zdttzhcGv2m4AdR4NqOv9E6G6DDQmFTgQKBgQDRtSR69o6T5b0Woin2
eK1Apu9ARpL/mSCEsEzhmzL6G65Cv5QvxevG/48YKWOjKqwTWT6JRC/zjRUsyEVy
SFBEw5Z86QmqOv659waXkbpFB+u9+OPQtbO4DHc5Mt7Ffl1GVpeFO4sPl81oppFZ
rRSgTGKj6hOqFkEE2ETzEUzAuwKBgQDAk4DNhqVvnq1SvSkokcd3coHMSz8BDmDQ
keOVewz/mijtmqduO3aqzFOh/bo3T0ZEHYh9xTMMdEvAxFaKgT6B8h2cJEevTEwz
Uf0gbdVdvqXrTvEtbfcXOYU6umToa6kpO5jsd2oYrZIt6ZTkanbDM5fa5OJI1JXC
I0TqtHK8pQKBgHrdM2NroztZpcBmAEnsiC1R4Oj6sFNaZuf21wRzRpmssBthXTPk
NPCheDgCv+KwNKMdbXtE3QdHyHk1WSLM5WJ0aW4Dpur6p5VS+qTA965MJr1l3ivA
2WviudNkT4rML1/vidTAfwgCu5EtzgkJVAVa24wHr7++TBfHkhYLM7nTAoGAE7zK
fcYoHJmZ0BodJtBSLlbpIMQxj+0mVRouxjpXabcmLLwmHvEvR3ArvjWgKV0RqZeR
Trqwcb1Vqks1R3rZqj3jdQZu5nOed8AWfoVjUflhTg3IQEy9/35gvlUuVHf8XYKD
OPFASYk4q0X+ga67v2QBU2kUHDzVoJE21gtqmxUCgYBgv/Xfl7sb8KfIaz1QTVq/
UdxOwqvfqdBNBgXs1YiiToakN/FYvybFMPDN06vR7InDxj4R7BCxx3UQnZxEUygx
QDtbk8QOHhfdBM4eRab0+tKUup/4jXu3j8+HUF/RqOleoUYVY4MBPX9XnND/uVcs
Se0oxgCqj2dtEvEIbgFv6A==
-----END PRIVATE KEY-----`;

const PUBLIC_APP_ID = "b92ee6b8-70b5-4340-aac8-5f95bd66cd99";

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