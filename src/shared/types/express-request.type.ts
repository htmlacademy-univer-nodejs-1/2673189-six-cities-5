import { AuthUser } from '../libs/rest/auth/auth-user.type.js';

export type RequestWithUser = Express.Request & {
  user?: AuthUser;
};
