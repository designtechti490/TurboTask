import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CheckCircle2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  useEffect(() => {
    localStorage.setItem("@TurboTask:tasks", JSON.stringify(tasks));
  }, [tasks]);

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
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editText } : task,
    );

    setTasks(updatedTasks);
    setEditingId(null); // Sai do modo de edição
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

      <div className="mx-auto w-full max-w-md flex flex-col gap-6">
        <div className="bg-blue-950 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
          <label className="text-lg font-bold">
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

        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-sm font-bold px-1">
            <p className="text-blue-200">Tarefas criadas: {totalTasks}</p>
            <p className="text-purple-200">
              Concluídas: {tasksConcluidas} de {totalTasks}
            </p>
          </div>

          <div className="flex gap-2">
            {(["todas", "pendentes", "concluidas"] as FilterType[]).map((f) => (
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
            ))}
          </div>
        </div>

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
                    <Button size="sm" onClick={() => handleSaveEdit(task.id)}>
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
                  <button
                    onClick={() =>
                      setTasks(tasks.filter((t) => t.id !== task.id))
                    }
                    className="hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
export default App;
