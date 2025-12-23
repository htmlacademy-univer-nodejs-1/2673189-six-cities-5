import { SignJWT, jwtVerify } from 'jose';
import { createSecretKey } from 'node:crypto';
import { TokenPayload } from './token-payload.type.js';

export class JwtService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  public async sign(payload: TokenPayload): Promise<string> {
    const key = createSecretKey(new TextEncoder().encode(this.secret));

    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(this.expiresIn)
      .sign(key);
  }

  public async verify(token: string): Promise<TokenPayload> {
    const key = createSecretKey(new TextEncoder().encode(this.secret));
    const { payload } = await jwtVerify(token, key);

    return payload as unknown as TokenPayload;
  }
}
