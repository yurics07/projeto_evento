"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Link as LinkIcon, Home, PlusCircle, LogIn, UserPlus, Menu, X, Users, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EventosPage() {
  const [eventos, setEventos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const MOCK_EVENTOS = [
    {
      id: 1,
      nome: "Feira de Tecnologia",
      descricao: "Uma feira com palestras e workshops sobre desenvolvimento.",
      tipo: "CONFERENCIA",
      local: "Criciúma - Centro de Convenções",
      dataInicio: "01/12/2025 09:00",
      dataFinal: "01/12/2025 18:00",
      linkEvento: "https://example.com/evento/1",
      linkImagem: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
    },
    {
      id: 2,
      nome: "Workshop React Avançado",
      descricao: "Hands-on para elevar seu conhecimento em React e Next.js.",
      tipo: "WORKSHOP",
      local: "Auditório B",
      dataInicio: "05/12/2025 14:00",
      dataFinal: "05/12/2025 17:00",
      linkEvento: null,
      linkImagem: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=60",
    },
    {
      id: 3,
      nome: "Encontro de Comunidade",
      descricao: "Networking, lightning talks e café.",
      tipo: "MEETUP",
      local: "Espaço Comunitário",
      dataInicio: "10/12/2025 19:00",
      dataFinal: "10/12/2025 21:00",
      linkEvento: "https://example.com/evento/3",
      linkImagem: null,
    },
  ];

  // Verificar se o usuário está logado
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");
      const userRole = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");

      if (token && userName && userRole) {
        setUser({
          name: userName,
          role: userRole,
          id: userId
        });
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Verificar periodicamente (a cada 5 segundos) para capturar mudanças na mesma janela
    const interval = setInterval(checkUser, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchEventos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obter token se existir
        const token = localStorage.getItem("token");
        
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get("http://localhost:8080/api/v1/evento", {
          timeout: 3000,
          headers
        });

        if (!mounted) return;

        const data = Array.isArray(response.data) ? response.data : response.data?.content || [];
        setEventos(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        if (mounted) {
          setError(err.message || "Erro ao buscar eventos");
          setEventos(MOCK_EVENTOS);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEventos();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    // Limpar dados do usuário
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    
    // Atualizar estado
    setUser(null);
    
    // Fechar menu mobile se estiver aberto
    setMobileMenuOpen(false);
    
    // Redirecionar para página inicial
    router.push("/");
  };

  const formatDate = (raw) => {
    if (!raw) return "Data não informada";
    const isoLike = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw);
    if (isoLike) {
      try {
        const d = new Date(raw);
        return d.toLocaleString();
      } catch (e) {
        return raw;
      }
    }
    return raw;
  };

  // Função para redirecionar baseado no perfil
  const redirectByRole = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "organizador":
        router.push("/organizador/eventos");
        break;
      case "participante":
        router.push("/participante/eventos");
        break;
      default:
        router.push("/dashboard");
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 p-6">
        <div className="max-w-4xl w-full animate-pulse">
          <div className="h-64 bg-white/20 rounded-2xl shadow-lg mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-white/20 rounded-xl shadow" />
            <div className="h-40 bg-white/20 rounded-xl shadow hidden md:block" />
            <div className="h-40 bg-white/20 rounded-xl shadow hidden md:block" />
          </div>
        </div>
      </div>
    );
  }

  const lista = Array.isArray(eventos) ? eventos : [];

  if (lista.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 p-6 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-6">Eventos</h1>
        <p className="text-center text-cyan-100">Nenhum evento encontrado.</p>
      </div>
    );
  }

  const destaque = lista[0] || {};
  const miniaturas = lista.slice(1);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 p-6 flex flex-col items-center">
      
      {/* TopBar Atualizada */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        {/* Fundo com efeito de vidro */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            scrolled
              ? "backdrop-blur-xl bg-gradient-to-r from-cyan-700/90 via-cyan-600/90 to-teal-600/90 shadow-xl"
              : "backdrop-blur-md bg-gradient-to-r from-cyan-600/80 via-cyan-500/80 to-teal-500/80"
          }`}
        />

        {/* Linha decorativa superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  EventFlow
                </h1>
                <p className="text-xs text-cyan-200 opacity-80">Sistema de Gestão de Eventos</p>
              </div>
            </Link>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <Home size={18} />
                <span className="font-medium">Início</span>
              </Link>
              
              <Link
                href="/evento/create"
                className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <Calendar size={18} />
                <span className="font-medium">Eventos</span>
              </Link>
              

              <div className="h-6 w-px bg-cyan-400/40"></div>

              {user ? (
                <>
                  {/* Botão Criar Evento para organizadores/admin */}
                  {(user.role === "ORGANIZADOR" || user.role === "ADMIN") && (
                    <Link
                      href="/criar-evento"
                      className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      <PlusCircle size={18} />
                      <span className="font-semibold">Criar Evento</span>
                    </Link>
                  )}

                  {/* Menu do usuário logado */}
                  <div className="relative group">
                    <button 
                      className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                      onClick={() => redirectByRole(user.role)}
                    >
                      <User size={18} />
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs bg-cyan-500/30 px-2 py-1 rounded-full">
                        {user.role}
                      </span>
                    </button>
                    
                    {/* Dropdown do usuário */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-b from-cyan-700/95 to-teal-700/95 backdrop-blur-xl rounded-xl shadow-2xl border border-cyan-400/30 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="p-3">
                        <div className="px-3 py-2 border-b border-cyan-400/30">
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-cyan-200 text-xs">{user.role}</p>
                        </div>
                        
                        {/* Opção para criar evento no dropdown também */}
                        {(user.role === "ORGANIZADOR" || user.role === "ADMIN") && (
                          <Link
                            href="/criar-evento"
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-white p-2 rounded-lg transition-colors"
                          >
                            <PlusCircle size={16} />
                            Criar Evento
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-100 hover:text-white p-2 rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          Sair
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Botões para usuário não logado */}
                  <Link
                    href="/usuario/login"
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <LogIn size={18} />
                    <span className="font-semibold">Entrar</span>
                  </Link>

                  <Link
                    href="/cadastro"
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <UserPlus size={18} />
                    <span className="font-semibold">Cadastrar</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Botão Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Menu Mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-cyan-700/95 to-teal-700/95 backdrop-blur-xl rounded-b-2xl shadow-2xl border-t border-cyan-400/30 overflow-hidden animate-slideDown">
              <div className="py-6 px-4 space-y-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors"
                >
                  <Home size={20} />
                  <span className="font-medium">Início</span>
                </Link>

                <Link
                  href="/eventos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors"
                >
                  <Calendar size={20} />
                  <span className="font-medium">Eventos</span>
                </Link>

                <div className="h-px bg-cyan-400/30 my-2"></div>

                {user ? (
                  <>
                    {/* Usuário logado no mobile */}
                    <div className="p-3 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-cyan-200">{user.role}</p>
                        </div>
                      </div>
                      
                      {/* Botão Criar Evento no mobile para organizadores/admin */}
                      {(user.role === "ORGANIZADOR" || user.role === "ADMIN") && (
                        <Link
                          href="/criar-evento"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg font-semibold mb-2"
                        >
                          <PlusCircle size={20} />
                          <span>Criar Evento</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          redirectByRole(user.role);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-3 rounded-xl shadow-lg font-semibold mb-2"
                      >
                        <Home size={20} />
                        <span>Meu Painel</span>
                      </button>

                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-100 hover:text-white p-3 rounded-xl font-semibold"
                      >
                        <LogOut size={20} />
                        <span>Sair</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Usuário não logado no mobile */}
                    <Link
                      href="/usuario/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-3 rounded-xl shadow-lg font-semibold"
                    >
                      <LogIn size={20} />
                      <span>Entrar</span>
                    </Link>

                    <Link
                      href="/cadastro"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg font-semibold"
                    >
                      <UserPlus size={20} />
                      <span>Cadastrar</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Decoração inferior */}
              <div className="h-2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
        `}</style>
      </header>

      <div className="mt-28 w-full max-w-7xl">
        {/* Evento em destaque */}
        <article
          className="w-full bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 mb-10 relative overflow-hidden border border-white/20"
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-cyan-400/30 to-transparent rounded-full pointer-events-none blur-3xl" />

          <img
            src={destaque.linkImagem || "https://via.placeholder.com/1200x600?text=Sem+imagem"}
            alt={destaque.nome || "Evento sem nome"}
            className="w-full h-80 object-cover rounded-xl shadow-lg"
          />

          <h2 className="text-3xl font-bold text-white mt-6">{destaque.nome}</h2>
          <p className="text-cyan-100 mt-3 text-lg">{destaque.descricao}</p>

          <div className="flex flex-col gap-3 mt-6 text-cyan-100">
            <span className="flex items-center gap-3 text-lg">
              <MapPin size={20} /> {destaque.local || "Local não informado"}
            </span>

            <span className="flex items-center gap-3 text-lg">
              <Calendar size={20} /> Início: {formatDate(destaque.dataInicio)}
            </span>

            <span className="flex items-center gap-3 text-lg">
              <Calendar size={20} /> Final: {formatDate(destaque.dataFinal)}
            </span>

            {destaque.linkEvento && (
              <a
                href={destaque.linkEvento}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-200 hover:text-white hover:underline mt-3 text-lg"
              >
                <LinkIcon size={20} /> Link do Evento
              </a>
            )}
          </div>
        </article>

        {/* Miniaturas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {miniaturas.map((evento) => (
            <article
              key={evento.id}
              className="bg-white/10 backdrop-blur-xl shadow-xl rounded-2xl p-6 hover:scale-105 transition-transform relative overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-teal-400/20 pointer-events-none" />

              <img
                src={evento.linkImagem || "https://via.placeholder.com/400x240?text=Sem+imagem"}
                alt={evento.nome}
                className="w-full h-48 object-cover rounded-lg shadow"
              />

              <h3 className="font-bold text-xl text-white mt-4">{evento.nome}</h3>
              <p className="text-cyan-100 mt-2 line-clamp-3">{evento.descricao}</p>

              <div className="flex items-center gap-2 mt-4 text-cyan-100">
                <Calendar size={18} /> {formatDate(evento.dataInicio)}
              </div>
            </article>
          ))}
        </section>

        {error && (
          <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20 text-cyan-100 text-center">
            Atenção: houve um problema ao consultar a API — usando dados em cache/mock para exibição.
          </div>
        )}
      </div>
    </div>
  );
}