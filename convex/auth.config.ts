// WorkOS AuthKit registered as a custom JWT provider.
//
// Two providers cover both `iss` shapes WorkOS may emit (depends on flow /
// SDK version). The shared-issuer form requires `aud` matching `applicationID`;
// the JWT template at WorkOS (Authentication → Sessions → JWT template) is
// configured to inject `{"aud": "<WORKOS_CLIENT_ID>"}` so this works without
// further manual setup.
//
// Ref: https://docs.convex.dev/auth/authkit/

declare const process: { env: { WORKOS_CLIENT_ID?: string } };

const clientId = process.env.WORKOS_CLIENT_ID;

export default {
  providers: [
    {
      type: "customJwt",
      issuer: "https://api.workos.com/",
      algorithm: "RS256",
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
      applicationID: clientId,
    },
    {
      type: "customJwt",
      issuer: `https://api.workos.com/user_management/${clientId}`,
      algorithm: "RS256",
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
    },
  ],
};
