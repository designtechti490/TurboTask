import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Pencil,
  ListChecks,
  Inbox,
  Ticket,
  Pickaxe,
  TicketCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./components/ui/select";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./components/ui/alert-dialog";

export type Prioridade = "baixa" | "media" | "alta";
export type StatusChamado = "aberto" | "em_atendimento" | "concluido";

export interface Chamado {
  id: string;
  titulo: string;
  setor: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusChamado;
  dataCriacao: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("@TurboTask:tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });

  const [setor, setSetor] = useState<string>("");
  const [prioridade, setPrioridade] = useState<Prioridade | "">("");
  const [tituloChamado, setTituloChamado] = useState("");
  const [descricaoChamado, setDescricaoChamado] = useState("");
  const [chamados, setChamados] = useState<Chamado[]>(() => {
    const savedChamados = localStorage.getItem("@TurboTask:chamados");
    if (savedChamados) {
      try {
        return JSON.parse(savedChamados) as Chamado[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleUpdateChamadoStatus = (id: string, status: StatusChamado) => {
    setChamados((prev) =>
      prev.map((chamado) =>
        chamado.id === id ? { ...chamado, status } : chamado,
      ),
    );

    toast("Status atualizado", {
      description: `O chamado foi marcado como ${status.replace("_", " ")}.`,
    });
  };

  const handleDeleteChamado = (id: string) => {
    setChamados((prev) => prev.filter((chamado) => chamado.id !== id));

    toast("Chamado excluído", {
      description: "O chamado foi removido da fila.",
      style: { background: "#7f1d1d", color: "white" },
    });
  };

  const handleCreateTicket = () => {
    if (
      !tituloChamado.trim() ||
      !descricaoChamado.trim() ||
      !setor ||
      !prioridade
    ) {
      return;
    }

    const novoChamado: Chamado = {
      id: crypto.randomUUID(),
      titulo: tituloChamado,
      setor,
      descricao: descricaoChamado,
      prioridade: prioridade as Prioridade,
      status: "aberto",
      dataCriacao: new Date().toISOString(),
    };

    setChamados((prev) => [...prev, novoChamado]);

    setTituloChamado("");
    setDescricaoChamado("");
    setSetor("");
    setPrioridade("");

    toast("Chamado criado", {
      description: "Seu chamado foi aberto com sucesso.",
    });
  };

  useEffect(() => {
    localStorage.setItem("@TurboTask:tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("@TurboTask:chamados", JSON.stringify(chamados));
  }, [chamados]);

  const handleToggleTask = (id: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    if (!taskText.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskText("");

    toast("Tarefa criada", {
      description: "Sua tarefa foi adicionada à lista.",
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editText } : task,
    );

    setTasks(updatedTasks);
    setEditingId(null);

    toast("Tarefa atualizada", {
      description: "O texto da tarefa foi alterado.",
    });
  };

  type FilterType = "todas" | "pendentes" | "concluidas";
  const [filter, setFilter] = useState<FilterType>("todas");

  const tasksConcluidas = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const tarefasFiltradas = tasks.filter((task) => {
    if (filter === "pendentes") return !task.completed;
    if (filter === "concluidas") return task.completed;
    return true;
  });

  return (
    <main className="min-h-screen bg-linear-to-r from-blue-500 to-purple-500 text-white p-8">
      <header className="flex items-center justify-center gap-2 mb-8">
        <h1 className="text-5xl font-bold italic tracking-tighter">
          ✅ TurboTask
        </h1>
      </header>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 bg-blue-950/50">
          <TabsTrigger value="tasks">
            <ListChecks /> Tarefas
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Inbox /> Chamados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-6">
            <Card className="bg-blue-950 border-none rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
              <label className="text-lg text-white font-bold">
                Digite o nome da sua tarefa:
              </label>
              <Input
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Ler, Estudar, Tomar remédios..."
                className="bg-transparent border-blue-800 text-white placeholder:text-blue-300/50"
              />
              <Button
                onClick={handleAddTask}
                className="font-bold bg-white text-black hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" /> Criar
              </Button>
            </Card>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-sm font-bold px-1">
                <p className="text-blue-200">Tarefas criadas: {totalTasks}</p>
                <p className="text-purple-200">
                  Concluídas: {tasksConcluidas} de {totalTasks}
                </p>
              </div>

              <div className="flex gap-2">
                {(["todas", "pendentes", "concluidas"] as FilterType[]).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                        filter === f
                          ? "bg-white text-blue-950 scale-105"
                          : "bg-blue-950/40 text-white/60"
                      }`}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            </div>

            {tarefasFiltradas.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold">Sua lista está limpa!</h3>
                <p className="text-white/50 text-sm">
                  Que tal adicionar uma nova tarefa para turbinar seu dia?
                </p>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {tarefasFiltradas.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                    className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex items-center justify-between border border-white/20 group"
                  >
                    {editingId === task.id ? (
                      // MODO EDIÇÃO
                      <div className="flex flex-1 gap-2 mr-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="h-8 bg-blue-900 border-white/20"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(task.id)}
                        >
                          Salvar
                        </Button>
                      </div>
                    ) : (
                      // MODO NORMAL
                      <span
                        className={`flex-1 ${task.completed ? "line-through text-white/50" : ""}`}
                        onDoubleClick={() => {
                          // Atalho: clique duplo para editar
                          setEditingId(task.id);
                          setEditText(task.text);
                        }}
                      >
                        {task.text}
                      </span>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setEditText(task.text);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="hover:text-green-400 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="hover:text-red-400 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-blue-950 border border-white/20 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Tem certeza que
                              deseja excluir esta tarefa?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-black">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() =>
                                setTasks((prev) =>
                                  prev.filter((t) => t.id !== task.id),
                                )
                              }
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="mx-auto w-full max-w-3xl flex flex-col gap-6">
            <Card className="bg-blue-950 border-none rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold">
                  Abrir Novo Chamado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={tituloChamado}
                  onChange={(e) => setTituloChamado(e.target.value)}
                  placeholder="Título do problema..."
                  className="bg-transparent border-blue-800 text-white placeholder:text-blue-300/50"
                />

                <Select value={setor} onValueChange={setSetor}>
                  <SelectTrigger className="w-full max-w-48 text-white font-bold">
                    <SelectValue placeholder="Setor do incidente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Setor</SelectLabel>
                      <SelectItem value="Administrativo">
                        Administrativo
                      </SelectItem>
                      <SelectItem value="Diretoria">Diretoria</SelectItem>
                      <SelectItem value="Manutencao">Manutenção</SelectItem>
                      <SelectItem value="Recepcao">Recepção</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <RadioGroup
                  value={prioridade}
                  onValueChange={(value) => setPrioridade(value as Prioridade)}
                  className="text-white font-bold flex flex-col gap-3 m-4 sm:flex-row sm:flex-wrap sm:gap-6"
                >
                  <span className="mb-1 text-sm sm:text-base">
                    Qual a prioridade?
                  </span>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="baixa"
                      id="prioridade-baixa"
                      className="border-white/60 text-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-blue-900"
                    />
                    <Label
                      htmlFor="prioridade-baixa"
                      className="text-white/80 peer-data-[state=checked]:text-white"
                    >
                      Baixa
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="media"
                      id="prioridade-media"
                      className="border-white/60 text-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-blue-900"
                    />
                    <Label
                      htmlFor="prioridade-media"
                      className="text-white/80 peer-data-[state=checked]:text-white"
                    >
                      Média
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="alta"
                      id="prioridade-alta"
                      className="border-white/60 text-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-blue-900"
                    />
                    <Label
                      htmlFor="prioridade-alta"
                      className="text-white/80 peer-data-[state=checked]:text-white"
                    >
                      Alta
                    </Label>
                  </div>
                </RadioGroup>

                <Textarea
                  value={descricaoChamado}
                  onChange={(e) => setDescricaoChamado(e.target.value)}
                  placeholder="Descreva o que está acontecendo detalhadamente..."
                  className="bg-transparent border-blue-800 text-white placeholder:text-blue-300/50"
                />

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleCreateTicket}
                    className="w-full font-bold bg-white text-black hover:bg-blue-100 transition-colors"
                  >
                    Gerar Chamado <Ticket />
                  </Button>
                  <p className="text-sm text-blue-200">
                    Chamados criados: {chamados.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {chamados.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-white/70">
                <Inbox className="w-8 h-8 mb-3" />
                <p>Nenhum chamado aberto ainda. Crie o primeiro acima.</p>
              </div>
            )}

            {chamados.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm font-bold px-1 text-blue-100">
                  <span>Chamados abertos: {chamados.length}</span>
                </div>

                <AnimatePresence>
                  {chamados.map((chamado) => (
                    <motion.div
                      key={chamado.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                      className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            <Ticket className="w-4 h-4" />
                            {chamado.titulo}
                          </h3>
                          <p className="text-sm text-white/70 mt-1">
                            {chamado.descricao}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                            <span className="px-2 py-1 rounded-full bg-blue-900/70 text-blue-100">
                              Setor: {chamado.setor}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full flex items-center ${
                                chamado.prioridade === "alta"
                                  ? "bg-red-500/80 text-white"
                                  : chamado.prioridade === "media"
                                    ? "bg-yellow-400/80 text-black"
                                    : "bg-emerald-500/80 text-black"
                              }`}
                            >
                              Prioridade: {chamado.prioridade}
                            </span>
                            <span className="flex items-center px-2 py-1 rounded-full bg-white/10 text-white/80">
                              Status: {chamado.status}
                            </span>

                            <div className="flex flex-col gap-2 mt-3 text-xs w-full sm:flex-row sm:flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/30 text-black w-full sm:w-auto"
                                onClick={() =>
                                  handleUpdateChamadoStatus(
                                    chamado.id,
                                    "em_atendimento",
                                  )
                                }
                              >
                                <Pickaxe /> Em atendimento
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-400/60 text-emerald-500 w-full sm:w-auto"
                                onClick={() =>
                                  handleUpdateChamadoStatus(
                                    chamado.id,
                                    "concluido",
                                  )
                                }
                              >
                                <TicketCheck /> Concluir
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-400/60 text-red-500 w-full sm:w-auto"
                                  >
                                    <Trash2 /> Excluir
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-blue-950 border border-white/20 text-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Excluir chamado?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Essa ação não pode ser desfeita. Tem
                                      certeza que deseja excluir este chamado?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="text-black">
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() =>
                                        handleDeleteChamado(chamado.id)
                                      }
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
export default App;
