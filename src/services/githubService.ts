import { StudyGuide } from '../types/guide';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  bio?: string;
  public_gists?: number;
}

export interface GitHubAuthUrlResponse {
  configured: boolean;
  url?: string;
  clientId?: string | null;
  redirectUri?: string;
  devCallbackUrl?: string;
  sharedCallbackUrl?: string;
  message?: string;
}

export interface ExportGistResult {
  success: boolean;
  gistUrl: string;
  gistId: string;
  fileName: string;
}

export async function fetchGitHubAuthUrl(): Promise<GitHubAuthUrlResponse> {
  const redirectUri = `${window.location.origin}/auth/github/callback`;
  const res = await fetch(`/api/auth/github/url?redirectUri=${encodeURIComponent(redirectUri)}`);
  if (!res.ok) {
    throw new Error('Falha ao consultar configuração do GitHub.');
  }
  return res.json();
}

export async function exportGuideToGist(
  token: string,
  guide: StudyGuide,
  isPublic: boolean = true
): Promise<ExportGistResult> {
  const res = await fetch('/api/github/export-gist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      guide,
      isPublic,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Falha ao exportar para o GitHub Gist.');
  }

  return data;
}
