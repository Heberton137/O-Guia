import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Check, Copy, AlertTriangle, ShieldCheck, Loader2, Sparkles, LogOut, CheckCircle2, GitFork, BookMarked, Code2 } from 'lucide-react';
import { StudyGuide } from '../types/guide';
import { fetchGitHubAuthUrl, exportGuideToGist, GitHubUser, GitHubAuthUrlResponse } from '../services/githubService';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuide: StudyGuide | null;
  githubUser: GitHubUser | null;
  githubToken: string | null;
  onAuthSuccess: (token: string, user: GitHubUser) => void;
  onDisconnect: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  currentGuide,
  githubUser,
  githubToken,
  onAuthSuccess,
  onDisconnect,
}) => {
  const [authConfig, setAuthConfig] = useState<GitHubAuthUrlResponse | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isPublicGist, setIsPublicGist] = useState<boolean>(true);
  const [gistSuccessUrl, setGistSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fallback direto via Token Pessoal (PAT)
  const [manualToken, setManualToken] = useState<string>('');
  const [isVerifyingManual, setIsVerifyingManual] = useState<boolean>(false);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsLoadingConfig(true);
    setErrorMessage(null);
    setGistSuccessUrl(null);

    fetchGitHubAuthUrl()
      .then((cfg) => {
        if (mounted) {
          setAuthConfig(cfg);
          setIsLoadingConfig(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error(err);
          setIsLoadingConfig(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Escuta mensagem da janela popup do OAuth (postMessage)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        const { token, user } = event.data;
        onAuthSuccess(token, user);
        setErrorMessage(null);
      } else if (event.data?.type === 'GITHUB_AUTH_ERROR') {
        setErrorMessage(event.data.error || 'Erro na autorização do GitHub.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAuthSuccess]);

  if (!isOpen) return null;

  const handleStartOAuth = () => {
    if (!authConfig?.url) return;

    setErrorMessage(null);

    // Conforme a skill OAuth: abrir diretamente a URL do provedor em popup (nunca rota do container)
    const popup = window.open(
      authConfig.url,
      'github_oauth_popup',
      'width=600,height=750,menubar=no,toolbar=no,status=no'
    );

    if (!popup) {
      setErrorMessage('O popup foi bloqueado pelo navegador. Por favor, permita popups para este site.');
    }
  };

  const handleManualTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;

    setIsVerifyingManual(true);
    setErrorMessage(null);

    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${manualToken.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        throw new Error('Token inválido ou sem permissão para ler perfil.');
      }

      const user: GitHubUser = await res.json();
      onAuthSuccess(manualToken.trim(), user);
      setManualToken('');
      setShowManualInput(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao validar o token pessoal.');
    } finally {
      setIsVerifyingManual(false);
    }
  };

  const handleExportGist = async () => {
    if (!githubToken || !currentGuide) return;

    setIsExporting(true);
    setErrorMessage(null);
    setGistSuccessUrl(null);

    try {
      const result = await exportGuideToGist(githubToken, currentGuide, isPublicGist);
      setGistSuccessUrl(result.gistUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao criar o Gist no GitHub.');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const devCallback = 'https://ais-dev-j7b7arcohzsd6drbot2ify-332958152110.us-east1.run.app/auth/github/callback';
  const sharedCallback = 'https://ais-pre-j7b7arcohzsd6drbot2ify-332958152110.us-east1.run.app/auth/github/callback';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">Integração com o GitHub</h3>
              <p className="text-xs text-stone-500">Exporte planos de estudo, sincronize anotações e salve em Gists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ESTADO 1: Usuário Conectado */}
          {githubUser ? (
            <div className="space-y-6">
              {/* Card de Perfil do Usuário */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={githubUser.avatar_url}
                    alt={githubUser.login}
                    className="w-12 h-12 rounded-full border border-stone-300 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-950 font-serif">
                        {githubUser.name || githubUser.login}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        Conectado
                      </span>
                    </div>
                    <a
                      href={githubUser.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-mono"
                    >
                      <span>@{githubUser.login}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onDisconnect}
                  title="Desconectar conta do GitHub"
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desconectar</span>
                </button>
              </div>

              {/* Ação: Exportar Guia Atual como Gist */}
              <div className="border border-stone-200 rounded-2xl p-5 space-y-4 bg-white shadow-2xs">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-amber-700" />
                  <h4 className="text-sm font-bold text-stone-950 font-serif">
                    Exportar Caderno de Estudos para GitHub Gist
                  </h4>
                </div>

                {currentGuide ? (
                  <div className="space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Gera um documento Markdown completo com todas as fórmulas em LaTeX, definições conceituais e exercícios comentados, salvo diretamente na sua conta do GitHub.
                    </p>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                      <span className="font-semibold text-stone-800 truncate max-w-xs">
                        {currentGuide.title}
                      </span>
                      <span className="text-stone-500 font-mono text-[11px]">
                        {(currentGuide.modules || []).length} tópicos · {(currentGuide.practiceExercises || []).length} questões
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gistVisibility"
                          checked={isPublicGist}
                          onChange={() => setIsPublicGist(true)}
                          className="accent-stone-900"
                        />
                        <span>Gist Público (acessível por link)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gistVisibility"
                          checked={!isPublicGist}
                          onChange={() => setIsPublicGist(false)}
                          className="accent-stone-900"
                        />
                        <span>Gist Secreto (privado)</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      disabled={isExporting}
                      onClick={handleExportGist}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:shadow"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Publicando Gist no GitHub...</span>
                        </>
                      ) : (
                        <>
                          <Code2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Salvar no Meu GitHub</span>
                        </>
                      )}
                    </button>

                    {gistSuccessUrl && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-fadeIn text-xs">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Gist publicado com sucesso no seu GitHub!</span>
                        </div>
                        <a
                          href={gistSuccessUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-900 underline font-mono flex items-center gap-1.5 hover:text-emerald-900 break-all"
                        >
                          <span>{gistSuccessUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-stone-500 py-3">
                    Nenhum guia de estudos ativo no momento. Carregue uma versão de teste ou insira um material para exportar para o GitHub.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ESTADO 2: Usuário Não Conectado */
            <div className="space-y-6">
              {isLoadingConfig ? (
                <div className="py-10 text-center space-y-2 text-stone-500 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-stone-700" />
                  <p>Verificando credenciais do GitHub...</p>
                </div>
              ) : authConfig?.configured ? (
                /* OAuth Configurado no Servidor */
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-md">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>

                  <div className="space-y-1 max-w-sm mx-auto">
                    <h4 className="text-base font-bold text-stone-950 font-serif">
                      Conecte sua Conta do GitHub
                    </h4>
                    <p className="text-xs text-stone-600">
                      Autorize a aplicação para sincronizar e salvar seus materiais de estudo como Gists e arquivos Markdown.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartOAuth}
                    className="w-full py-3 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:shadow"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>Fazer Login com GitHub</span>
                  </button>
                </div>
              ) : (
                /* OAuth ainda não configurado no AI Studio Secrets */
                <div className="space-y-5">
                  <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Configuração do Aplicativo OAuth no GitHub</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      Para habilitar o login seguro com o GitHub via OAuth, crie um OAuth App no seu GitHub e registre as variáveis de ambiente no painel de segredos.
                    </p>
                  </div>

                  {/* Passo a Passo Exato conforme a Skill */}
                  <div className="space-y-3 text-xs text-stone-800">
                    <div className="font-bold text-stone-900">
                      Passo 1: Acesse as Configurações de Desenvolvedor do GitHub
                    </div>
                    <a
                      href="https://github.com/settings/developers"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800"
                    >
                      <span>Abrir GitHub Developer Settings</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="font-bold text-stone-900 pt-2">
                      Passo 2: Configure os URLs de Redirecionamento (Callback URLs)
                    </div>

                    {/* Development Callback */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500 font-medium">Ambiente de Desenvolvimento:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={devCallback}
                          className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono text-[11px] text-stone-800 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(devCallback, 'dev')}
                          className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">{copiedField === 'dev' ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Shared/Deployed Callback */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500 font-medium">Ambiente de Produção / Compartilhado:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={sharedCallback}
                          className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono text-[11px] text-stone-800 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(sharedCallback, 'shared')}
                          className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'shared' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">{copiedField === 'shared' ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="font-bold text-stone-900 pt-2">
                      Passo 3: Adicione as Chaves no AI Studio (.env)
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-stone-600">
                      <li><code className="bg-stone-100 px-1 py-0.5 rounded font-mono">GITHUB_CLIENT_ID</code></li>
                      <li><code className="bg-stone-100 px-1 py-0.5 rounded font-mono">GITHUB_CLIENT_SECRET</code></li>
                    </ul>
                  </div>

                  {/* Alternativa Imediata: Conectar via Token Pessoal (PAT) */}
                  <div className="pt-3 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setShowManualInput(!showManualInput)}
                      className="text-xs text-amber-900 font-semibold underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{showManualInput ? 'Ocultar conexão direta por Token' : 'Ou conecte agora mesmo usando um Token Pessoal do GitHub (PAT)'}</span>
                    </button>

                    {showManualInput && (
                      <form onSubmit={handleManualTokenSubmit} className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 animate-fadeIn">
                        <label className="block text-xs font-semibold text-stone-800">
                          Personal Access Token (com escopo <code className="bg-stone-200 px-1 rounded">gist</code>):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={manualToken}
                            onChange={(e) => setManualToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            className="flex-1 p-2 bg-white border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                          <button
                            type="submit"
                            disabled={isVerifyingManual || !manualToken.trim()}
                            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            {isVerifyingManual ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Conectar'}
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Gere em: <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="underline text-stone-700">github.com/settings/tokens</a> (marque "gist" e "read:user").
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 sm:p-5 border-t border-stone-100 flex items-center justify-end bg-stone-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
