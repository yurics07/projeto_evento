"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, LogIn } from "lucide-react";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        senha: "",
    });

    const [mensagem, setMensagem] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const API_URL = "http://localhost:8080/api/v1/auth";

    // Verificar se já existe um token (usuário já logado)
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");
        
        if (token && userRole) {
            redirecionarPorPerfil(userRole);
        }
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const redirecionarPorPerfil = (perfil) => {
        switch (perfil.toLowerCase()) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");
        setIsLoading(true);

        if (!form.email || !form.senha) {
            setMensagem("Por favor, preencha todos os campos.");
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setMensagem("Por favor, insira um email válido.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(API_URL, form);
            console.log("Resposta da API:", response.data);

            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                
                if (response.data.perfil) {
                    localStorage.setItem("userRole", response.data.perfil);
                    localStorage.setItem("userName", response.data.nome || "");
                    localStorage.setItem("userId", response.data.id || "");
                } else if (response.data.role) {
                    localStorage.setItem("userRole", response.data.role);
                    localStorage.setItem("userName", response.data.name || "");
                    localStorage.setItem("userId", response.data.id || "");
                }

                setMensagem("Login realizado com sucesso! Redirecionando...");

                const userRole = localStorage.getItem("userRole");
                if (userRole) {
                    setTimeout(() => {
                        redirecionarPorPerfil(userRole);
                    }, 1500);
                } else {
                    router.push("/dashboard");
                }
            } else {
                setMensagem("Resposta da API inválida. Entre em contato com o suporte.");
            }

        } catch (error) {
            console.error("Erro completo:", error);
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                switch (status) {
                    case 400:
                        if (data.errors) {
                            const erros = data.errors;
                            const campo = Object.keys(erros)[0];
                            const msg = erros[campo];
                            setMensagem(`Erro: ${msg}`);
                        } else {
                            setMensagem("Credenciais inválidas ou formato incorreto.");
                        }
                        break;
                    case 401:
                        setMensagem("Email ou senha incorretos. Verifique suas credenciais.");
                        break;
                    case 403:
                        setMensagem("Acesso negado. Seu usuário não tem permissão para acessar o sistema.");
                        break;
                    case 404:
                        setMensagem("Serviço de autenticação não encontrado.");
                        break;
                    case 422:
                        setMensagem("Dados de entrada inválidos. Verifique os campos informados.");
                        break;
                    case 429:
                        setMensagem("Muitas tentativas de login. Tente novamente em alguns minutos.");
                        break;
                    case 500:
                        setMensagem("Erro interno do servidor. Tente novamente mais tarde.");
                        break;
                    case 502:
                    case 503:
                    case 504:
                        setMensagem("Serviço temporariamente indisponível. Tente novamente em alguns instantes.");
                        break;
                    default:
                        if (data.message) {
                            setMensagem(data.message);
                        } else {
                            setMensagem("Erro ao realizar login. Tente novamente.");
                        }
                }
            } else if (error.request) {
                setMensagem("Não foi possível conectar ao servidor. Verifique sua conexão com a internet.");
            } else {
                setMensagem("Erro ao processar a requisição.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const limparFormulario = () => {
        setForm({ email: "", senha: "" });
        setMensagem("");
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 animate-fadeIn">

                {/* Cabeçalho */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                        Sistema de Eventos
                    </h1>
                    <p className="text-cyan-100">Acesse sua conta para continuar</p>
                </div>

                {/* Mensagem de erro/sucesso */}
                {mensagem && (
                    <div className={`mb-6 p-4 rounded-lg text-center font-medium animate-fadeIn ${
                        mensagem.includes("sucesso") 
                            ? "bg-green-100/20 text-green-200 border border-green-300/30"
                            : "bg-red-100/20 text-red-200 border border-red-300/30"
                    }`}>
                        {mensagem}
                    </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-cyan-100">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="seu.email@exemplo.com"
                            className="w-full bg-white/20 border border-white/30 px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition text-white placeholder-cyan-200"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Senha */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-cyan-100">
                                Senha
                            </label>
                            <button
                                type="button"
                                className="text-sm text-cyan-200 hover:text-cyan-100"
                                onClick={limparFormulario}
                            >
                                Limpar
                            </button>
                        </div>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            className="w-full bg-white/20 border border-white/30 px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition text-white placeholder-cyan-200"
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>

                    {/* Botão de Login */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition duration-200 ${
                            isLoading
                                ? "bg-cyan-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transform hover:-translate-y-0.5"
                        } text-white shadow-xl flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                Processando...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Entrar
                            </>
                        )}
                    </button>

                    {/* Botão de Cadastro */}
                    <Link href="/cadastro">
                        <button
                            type="button"
                            className="w-full py-3 px-4 rounded-xl font-semibold transition duration-200 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transform hover:-translate-y-0.5 text-white shadow-xl flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20} />
                            Criar Nova Conta
                        </button>
                    </Link>

                    {/* Links adicionais */}
                    <div className="pt-4 border-t border-white/20">
                        <p className="text-center text-sm text-cyan-100">
                            Ainda não tem conta?{" "}
                            <Link 
                                href="/cadastro" 
                                className="text-cyan-200 underline hover:text-cyan-100 font-medium"
                            >
                                Cadastre-se aqui
                            </Link>
                            {" "} | {" "}
                            <a 
                                href="/contato" 
                                className="text-cyan-200 hover:text-cyan-100 font-medium"
                            >
                                Contate o suporte
                            </a>
                        </p>
                    </div>
                </form>

                {/* Informações sobre perfis */}
                <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
                    <h3 className="text-sm font-semibold text-cyan-100 mb-2">
                        Perfis disponíveis:
                    </h3>
                    <ul className="text-xs text-cyan-200 space-y-1">
                        <li>• <strong>Admin:</strong> Acesso completo ao sistema</li>
                        <li>• <strong>Organizador:</strong> Criação e gestão de eventos</li>
                        <li>• <strong>Participante:</strong> Inscrição em eventos</li>
                    </ul>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                `}</style>
            </div>
        </div>
    );
}