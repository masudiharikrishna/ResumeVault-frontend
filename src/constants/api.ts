export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://resume-vault-backend-git-dev-ec64eb-masudiharikrishnas-projects.vercel.app";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
  },
  DOCUMENTS: {
    UPLOAD: `${API_BASE_URL}/documents/upload`,
    BASE: `${API_BASE_URL}/documents`,
    PREVIEW: (id: string) => `${API_BASE_URL}/documents/${id}/preview`,
    DOWNLOAD: (id: string) => `${API_BASE_URL}/documents/${id}/download`,
    DELETE: (id: string) => `${API_BASE_URL}/documents/${id}`,
  },
};
