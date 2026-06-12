//  ENVIRONMENTS :  LOCAL, DEVELOPMENT, PRODUCTION
const ENV: string = "DEVELOPMENT";

let baseUrl: string;

switch (ENV) {
  case "LOCAL":
    baseUrl = "http://localhost:4000";
    break;
  case "DEVELOPMENT":
    baseUrl = "https://resume-vault-backend.vercel.app";
    break;
  case "PRODUCTION":
    baseUrl = "https://resume-vault-backend.vercel.app";
    break;
  default:
    baseUrl = "https://resume-vault-backend.vercel.app";
}

// AUTH APIS
export const AUTH_SIGNUP = `${baseUrl}/auth/signup`;
export const AUTH_LOGIN = `${baseUrl}/auth/login`;

// USER APIS
export const USER_PROFILE = `${baseUrl}/users/profile`;

// DOCUMENT APIS
export const DOCUMENT_UPLOAD = `${baseUrl}/documents/upload`;
export const DOCUMENTS_BASE = `${baseUrl}/documents`;
export const DOCUMENT_PREVIEW = (id: string) => `${baseUrl}/documents/${id}/preview`;
export const DOCUMENT_DOWNLOAD = (id: string) => `${baseUrl}/documents/${id}/download`;
export const DOCUMENT_DELETE = (id: string) => `${baseUrl}/documents/${id}`;
