"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Users, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  Shield,
  LogOut
} from "lucide-react";

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Verificar se usuário está logado
    checkAuthStatus();
    
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserName(name || "");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserRole("");
    setUserName("");
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  const isAdmin = userRole?.toLowerCase() === "admin";

  return (
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
          <nav className="hidden md:flex items-center gap-4">
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

            {/* Botão de Gerenciar Usuários (apenas para admin) */}
            {isLoggedIn && isAdmin && (
              <Link
                href="/usuarios"
                className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <Shield size={18} />
                <span className="font-medium">Gerenciar Usuários</span>
              </Link>
            )}

            <div className="h-6 w-px bg-cyan-400/40"></div>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* Perfil do usuário */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{userName || "Usuário"}</p>
                    <p className="text-cyan-200 text-xs capitalize">{userRole}</p>
                  </div>
                </div>

                {/* Botão de Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <LogOut size={18} />
                  <span className="font-semibold">Sair</span>
                </button>
              </div>
            ) : (
              <>
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
              {isLoggedIn && (
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{userName || "Usuário"}</p>
                    <p className="text-cyan-200 text-sm capitalize">{userRole}</p>
                  </div>
                </div>
              )}

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors"
              >
                <Home size={20} />
                <span className="font-medium">Início</span>
              </Link>
              
              <Link
                href="/evento/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors"
              >
                <Calendar size={20} />
                <span className="font-medium">Eventos</span>
              </Link>

              {/* Botão de Gerenciar Usuários no mobile (apenas para admin) */}
              {isLoggedIn && isAdmin && (
                <Link
                  href="/usuarios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors"
                >
                  <Shield size={20} />
                  <span className="font-medium">Gerenciar Usuários</span>
                </Link>
              )}

              <div className="h-px bg-cyan-400/30 my-2"></div>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-xl shadow-lg font-semibold w-full"
                >
                  <LogOut size={20} />
                  <span>Sair da Conta</span>
                </button>
              ) : (
                <>
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
                  <Link
    href="/usuarios"
    className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
  >
    <Shield size={18} />
    <span className="font-medium">Gerenciar Usuários</span>
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
  );
}