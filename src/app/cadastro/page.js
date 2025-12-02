"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    tipo: "0",
    dataNascimento: "",
    senha: "",
    confirmSenha: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Dados enviados:", formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 animate-fadeIn">

        <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">
          Criar Conta
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NOME */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white placeholder-gray-300"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="seuemail@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white placeholder-gray-300"
            />
          </div>

          {/* CPF */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">CPF</label>
            <input
              type="text"
              name="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              required
              maxLength={14}
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white placeholder-gray-300"
            />
          </div>

          {/* TELEFONE */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
              required
              maxLength={15}
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white placeholder-gray-300"
            />
          </div>

          {/* TIPO */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Tipo de Usuário</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white"
            >
              <option className="text-black" value="0">Administrador</option>
              <option className="text-black" value="1">Usuário Comum</option>
              <option className="text-black" value="2">Organizador</option>
            </select>
          </div>

          {/* NASCIMENTO */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white"
            />
          </div>

          {/* SENHA */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="********"
              value={formData.senha}
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white placeholder-gray-300"
            />
          </div>

          {/* CONFIRMAR SENHA */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Confirmar Senha</label>
            <input
              type="password"
              name="confirmSenha"
              placeholder="Repita sua senha"
              value={formData.confirmSenha}
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/30 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-cyan-400 text-white placeholder-gray-300"
            />
          </div>

          {/* BOTÃO — AGORA DENTRO DO FORM */}
          <button
            type="submit"
            className="w-full mt-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transition rounded-xl flex items-center justify-center gap-2 font-semibold text-lg shadow-xl col-span-1 md:col-span-2"
          >
            <UserPlus size={22} />
            Criar Conta
          </button>

        </form>

        {/* VOLTAR AO LOGIN */}
        <p className="text-center mt-6 text-sm">
          Já tem login?{" "}
          <Link  href="/usuario/login" className="text-cyan-200 underline hover:text-cyan-100">
            Entrar
          </Link>
        </p>

      </div>
    </div>
  );
}