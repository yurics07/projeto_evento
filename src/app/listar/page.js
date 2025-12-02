"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Shield,
  User,
  Briefcase,
  Calendar
} from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const router = useRouter();

  const API_URL = "http://localhost:8080/api";

  // Carregar usuários
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${API_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Sessão expirada. Faça login novamente.");
            setTimeout(() => router.push("/login"), 2000);
            break;
          case 403:
            setError("Você não tem permissão para acessar esta página.");
            break;
          default:
            setError("Erro ao carregar usuários. Tente novamente.");
        }
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar usuário
  const handleDeletarUsuario = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`${API_URL}/usuarios/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess("Usuário excluído com sucesso!");
      carregarUsuarios();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      setError("Erro ao excluir usuário. Tente novamente.");
    }
  };

  // Função para visualizar detalhes do usuário
  const handleVisualizarUsuario = (usuario) => {
    setUsuarioSelecionado(usuario);
  };

  // Fechar modal de detalhes
  const fecharModal = () => {
    setUsuarioSelecionado(null);
  };

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter(usuario => {
    const buscaMatch = 
      usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
      usuario.cpf.includes(busca);

    const tipoMatch = filtroTipo === "todos" || 
      usuario.tipo.toString() === filtroTipo;

    return buscaMatch && tipoMatch;
  });

  // Paginação
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicial, indiceFinal);

  // Funções de paginação
  const irParaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  // Formatar tipo de usuário
  const formatarTipo = (tipo) => {
    switch (tipo) {
      case 0: return "Administrador";
      case 1: return "Cliente";
      case 2: return "Funcionário";
      default: return "Desconhecido";
    }
  };

  // Obter ícone e cor por tipo
  const getTipoInfo = (tipo) => {
    switch (tipo) {
      case 0:
        return { icon: Shield, cor: "from-purple-600 to-purple-800", bg: "bg-purple-100/20", text: "text-purple-300" };
      case 1:
        return { icon: User, cor: "from-green-600 to-emerald-700", bg: "bg-green-100/20", text: "text-green-300" };
      case 2:
        return { icon: Briefcase, cor: "from-blue-600 to-cyan-700", bg: "bg-blue-100/20", text: "text-blue-300" };
      default:
        return { icon: User, cor: "from-gray-600 to-gray-800", bg: "bg-gray-100/20", text: "text-gray-300" };
    }
  };

  // Formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Exportar para CSV
  const exportarCSV = () => {
    const dados = usuarios.map(usuario => ({
      ID: usuario.id,
      Nome: usuario.nome,
      Email: usuario.email,
      CPF: usuario.cpf,
      Telefone: usuario.telefone,
      Tipo: formatarTipo(usuario.tipo),
      'Data Nascimento': formatarData(usuario.dataNascimento),
      'Cadastrado em': formatarData(usuario.createdAt)
    }));

    const csv = [
      Object.keys(dados[0]).join(','),
      ...dados.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            <Users className="inline-block mr-3" size={36} />
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">
            Gerencie todos os usuários do sistema em um só lugar
          </p>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-fadeIn">
            {error}
            <button 
              onClick={() => setError("")}
              className="float-right text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 animate-fadeIn">
            {success}
            <button 
              onClick={() => setSuccess("")}
              className="float-right text-green-800 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Barra de ferramentas */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Filtro */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition"
              >
                <option value="todos">Todos os tipos</option>
                <option value="0">Administradores</option>
                <option value="1">Clientes</option>
                <option value="2">Funcionários</option>
              </select>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3">
              <button
                onClick={exportarCSV}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition transform hover:-translate-y-0.5 shadow-md"
              >
                <Download size={20} />
                Exportar
              </button>
              
              <button
                onClick={() => router.push("/usuarios/novo")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition transform hover:-translate-y-0.5 shadow-md"
              >
                <UserPlus size={20} />
                Novo
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Administradores</div>
              <div className="text-2xl font-bold text-purple-800">
                {usuarios.filter(u => u.tipo === 0).length}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-sm text-green-600 font-medium">Clientes</div>
              <div className="text-2xl font-bold text-green-800">
                {usuarios.filter(u => u.tipo === 1).length}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Funcionários</div>
              <div className="text-2xl font-bold text-blue-800">
                {usuarios.filter(u => u.tipo === 2).length}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-600 font-medium">Total</div>
              <div className="text-2xl font-bold text-gray-800">
                {usuarios.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de usuários */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          
          {/* Cabeçalho da tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Usuário</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Contato</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Data Nasc.</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Cadastrado em</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {usuariosPaginados.map((usuario) => {
                  const tipoInfo = getTipoInfo(usuario.tipo);
                  const TipoIcon = tipoInfo.icon;
                  
                  return (
                    <tr 
                      key={usuario.id} 
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-500">
                          #{usuario.id}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${tipoInfo.bg}`}>
                            <TipoIcon size={20} className={tipoInfo.text} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{usuario.nome}</div>
                            <div className="text-sm text-gray-500">CPF: {usuario.cpf}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">{usuario.email}</div>
                          <div className="text-sm text-gray-500">{usuario.telefone}</div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${tipoInfo.bg} ${tipoInfo.text}`}>
                          <TipoIcon size={12} />
                          {formatarTipo(usuario.tipo)}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          {formatarData(usuario.dataNascimento)}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-500">
                          {formatarData(usuario.createdAt)}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVisualizarUsuario(usuario)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                          
                          <button
                            onClick={() => router.push(`/usuarios/editar/${usuario.id}`)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleDeletarUsuario(usuario.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuários
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => irParaPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                    className={`p-2 rounded-lg ${
                      paginaAtual === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(totalPaginas)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => irParaPagina(index + 1)}
                      className={`w-8 h-8 rounded-lg ${
                        paginaAtual === index + 1
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => irParaPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                    className={`p-2 rounded-lg ${
                      paginaAtual === totalPaginas
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de detalhes do usuário */}
        {usuarioSelecionado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className={`p-6 rounded-t-2xl bg-gradient-to-r ${getTipoInfo(usuarioSelecionado.tipo).cor} text-white`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Detalhes do Usuário</h3>
                  <button
                    onClick={fecharModal}
                    className="text-white/80 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/90 mt-1">Informações completas do usuário</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">ID</label>
                    <p className="font-medium">#{usuarioSelecionado.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Nome</label>
                    <p className="font-medium">{usuarioSelecionado.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{usuarioSelecionado.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">CPF</label>
                    <p className="font-medium">{usuarioSelecionado.cpf}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Telefone</label>
                    <p className="font-medium">{usuarioSelecionado.telefone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Tipo</label>
                    <p className="font-medium">{formatarTipo(usuarioSelecionado.tipo)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Data Nascimento</label>
                    <p className="font-medium">{formatarData(usuarioSelecionado.dataNascimento)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Cadastrado em</label>
                    <p className="font-medium">{formatarData(usuarioSelecionado.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
                <button
                  onClick={fecharModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    router.push(`/usuarios/editar/${usuarioSelecionado.id}`);
                    fecharModal();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition"
                >
                  Editar Usuário
                </button>
              </div>
            </div>
          </div>
        )}

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