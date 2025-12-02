"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, PlusCircle, LogIn, Users, Shield, LogOut } from "lucide-react";
import { useEffect } from "react";

export default function CreateEvento() {
    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        tipo: "",
        local: "",
        dataInicio: "",
        dataFinal: "",
        linkEvento: "",
        linkImagem: "",
    });

    const [errors, setErrors] = useState({});
    const [mensagem, setMensagem] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // Novo estado para loading

    const tiposEvento = [
        "CONGRESSO",
        "TREINAMENTO",
        "WORKSHOP",
        "IMERSÃO",
        "REUNIÃO",
        "HACKATON",
        "STARTUP",
    ];

    const router = useRouter();

    useEffect(() => {
        // Verificar scroll
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    function formatarData(dataLocal) {
        if (!dataLocal) return "";
        const dt = new Date(dataLocal);

        const dia = String(dt.getDate()).padStart(2, "0");
        const mes = String(dt.getMonth() + 1).padStart(2, "0");
        const ano = dt.getFullYear();
        const hora = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");

        return `${dia}/${mes}/${ano} ${hora}:${min}`;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setUserRole("");
        setUserName("");
        router.push("/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setMensagem("");
        setErrors({});
        setIsCreating(true);

        try {
            const token = localStorage.getItem("token");
            
            const payload = {
                ...form,
                dataInicio: formatarData(form.dataInicio),
                dataFinal: formatarData(form.dataFinal),
            };

            console.log("Payload sendo enviado:", payload); // Para debug

            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.post("http://localhost:8080/api/v1/evento", payload, { headers });
            
            console.log("Resposta da API:", response); // Para debug

            setMensagem("Evento criado com sucesso!");
            
            // Limpar formulário
            setForm({
                nome: "",
                descricao: "",
                tipo: "",
                local: "",
                dataInicio: "",
                dataFinal: "",
                linkEvento: "",
                linkImagem: "",
            });
            setSubmitted(false);
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                router.push("/eventos");
            }, 2000);
            
        } catch (error) {
            console.error("Erro detalhado:", error); // Para debug
            
            if (error.response?.status === 400) {
                setErrors(error.response.data.errors || {});
                setMensagem("É necessário preencher os campos obrigatórios.");
            } else if (error.response?.status === 401) {
                setMensagem("Sessão expirada. Faça login novamente.");
                setTimeout(() => router.push("/usuario/login"), 2000);
            } else if (error.response?.status === 403) {
                setMensagem("Você não tem permissão para criar eventos.");
            } else if (error.response?.data?.message) {
                setMensagem(`Erro: ${error.response.data.message}`);
            } else {
                setMensagem("Erro inesperado ao criar evento. Verifique o console para mais detalhes.");
            }
        } finally {
            setIsCreating(false);
        }
    };

    const showStar = (field) =>
        submitted && (!form[field] || errors[field]);

    const isAdmin = userRole?.toLowerCase() === "admin";

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700">

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
                                    <PlusCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                                    EventFlow
                                </h1>
                                <p className="text-xs text-cyan-200 opacity-80">Criar Evento</p>
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
                                <PlusCircle size={18} />
                                <span className="font-medium">Eventos</span>
                            </Link>

                            {/* Botão de Gerenciar Usuários (apenas para admin) */}
                            {isLoggedIn && isAdmin && (
                                <Link
                                    href="/usuarios"
                                    className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    <Shield size={18} />
                                    <span className="font-medium">Usuários</span>
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
                                        <PlusCircle size={18} />
                                        <span className="font-semibold">Cadastrar</span>
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Botão Mobile Menu */}
                        <div className="md:hidden">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-white font-bold text-sm">
                                            {userName?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-lg text-sm"
                                    >
                                        <LogOut size={16} />
                                        <span>Sair</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/usuario/login"
                                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-lg"
                                >
                                    <LogIn size={18} />
                                    <span>Entrar</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo principal */}
            <div className="w-full max-w-4xl mt-32 px-4 pb-10">
                {/* CARD FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/10 backdrop-blur-xl shadow-2xl p-8 rounded-2xl w-full space-y-6 border border-white/20"
                >
                    <h1 className="text-4xl font-bold text-white text-center mb-8 tracking-wide">
                        Criar Novo Evento
                    </h1>

                    {mensagem && (
                        <div className={`p-4 rounded-xl text-center font-medium animate-fadeIn ${
                            mensagem.includes("sucesso") 
                                ? "bg-green-100/20 text-green-200 border border-green-300/30"
                                : "bg-red-100/20 text-red-200 border border-red-300/30"
                        }`}>
                            {mensagem}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NOME */}
                        <div>
                            <label className="font-semibold text-cyan-100 text-lg">
                                Nome do Evento {showStar("nome") && <span className="text-red-400">*</span>}
                            </label>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome do evento"
                                className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-cyan-200"
                            />
                            {errors.nome && <p className="text-red-300 text-sm mt-1">{errors.nome}</p>}
                        </div>

                        {/* TIPO */}
                        <div>
                            <label className="font-semibold text-cyan-100 text-lg">
                                Tipo do Evento {showStar("tipo") && <span className="text-red-400">*</span>}
                            </label>
                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={handleChange}
                                className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
                            >
                                <option value="" className="text-gray-800">Selecione...</option>
                                {tiposEvento.map((t) => (
                                    <option key={t} value={t} className="text-gray-800">
                                        {t}
                                    </option>
                                ))}
                            </select>
                            {errors.tipo && <p className="text-red-300 text-sm mt-1">{errors.tipo}</p>}
                        </div>
                    </div>

                    {/* DESCRIÇÃO */}
                    <div>
                        <label className="font-semibold text-cyan-100 text-lg">
                            Descrição {showStar("descricao") && <span className="text-red-400">*</span>}
                        </label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            placeholder="Digite uma descrição detalhada do evento"
                            className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-cyan-200"
                            rows="4"
                        />
                        {errors.descricao && (
                            <p className="text-red-300 text-sm mt-1">{errors.descricao}</p>
                        )}
                    </div>

                    {/* LOCAL */}
                    <div>
                        <label className="font-semibold text-cyan-100 text-lg">
                            Local {showStar("local") && <span className="text-red-400">*</span>}
                        </label>
                        <input
                            type="text"
                            name="local"
                            value={form.local}
                            onChange={handleChange}
                            placeholder="Digite o local do evento"
                            className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-cyan-200"
                        />
                        {errors.local && <p className="text-red-300 text-sm mt-1">{errors.local}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* DATA INÍCIO */}
                        <div>
                            <label className="font-semibold text-cyan-100 text-lg">
                                Data de Início {showStar("dataInicio") && <span className="text-red-400">*</span>}
                            </label>
                            <input
                                type="datetime-local"
                                name="dataInicio"
                                value={form.dataInicio}
                                onChange={handleChange}
                                className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
                            />
                            {errors.dataInicio && (
                                <p className="text-red-300 text-sm mt-1">{errors.dataInicio}</p>
                            )}
                        </div>

                        {/* DATA FINAL */}
                        <div>
                            <label className="font-semibold text-cyan-100 text-lg">
                                Data Final {showStar("dataFinal") && <span className="text-red-400">*</span>}
                            </label>
                            <input
                                type="datetime-local"
                                name="dataFinal"
                                value={form.dataFinal}
                                onChange={handleChange}
                                className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
                            />
                            {errors.dataFinal && (
                                <p className="text-red-300 text-sm mt-1">{errors.dataFinal}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* LINK DO EVENTO */}
                        <div>
                            <label className="font-semibold text-cyan-100 text-lg">Link do Evento</label>
                            <input
                                type="text"
                                name="linkEvento"
                                value={form.linkEvento}
                                onChange={handleChange}
                                placeholder="https://exemplo.com/evento"
                                className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-cyan-200"
                            />
                        </div>

                        {/* LINK DA IMAGEM */}
                        <div>
                            <label className="font-semibold text-cyan-100 text-lg">Link da Imagem</label>
                            <input
                                type="text"
                                name="linkImagem"
                                value={form.linkImagem}
                                onChange={handleChange}
                                placeholder="URL da imagem de capa"
                                className="w-full mt-2 p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-cyan-200"
                            />
                        </div>
                    </div>

                    {/* Botões de ação - CORRIGIDO */}
                    <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-white/20">
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition rounded-xl font-semibold text-lg text-white shadow-xl"
                        >
                            <Home size={20} />
                            Cancelar
                        </Link>
                        
                        {/* Botão de Criar Evento - MANTIDO como submit */}
                        <button
                            type="submit"
                            disabled={isCreating}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-lg text-white shadow-xl transition ${
                                isCreating
                                    ? "bg-gradient-to-r from-cyan-400 to-teal-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                            }`}
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} />
                                    Criar Evento
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Informações adicionais */}
                <div className="mt-8 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4">Dicas para criar um bom evento:</h3>
                    <ul className="space-y-3 text-cyan-100">
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                            <span>Forneça uma descrição clara e atraente</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                            <span>Use imagens de alta qualidade para atrair participantes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                            <span>Verifique se as datas estão corretas</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                            <span>Inclua todas as informações de contato necessárias</span>
                        </li>
                    </ul>
                </div>
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
    );
}