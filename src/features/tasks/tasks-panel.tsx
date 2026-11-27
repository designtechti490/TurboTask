import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import type { Task, TaskFilter } from "@/features/tasks/types";

interface TasksPanelProps {
  userId: string;
}

export function TasksPanel({ userId }: TasksPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("todas");

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        toast("Erro ao buscar tarefas", {
          description: error.message,
          style: { background: "#7f1d1d", color: "white" },
        });
        return;
      }

      setTasks(
        (data ?? []).map((task) => ({
          id: task.id,
          text: task.title,
          completed: task.is_completed,
        })),
      );
    };

    fetchTasks();
  }, [userId]);

  const addTask = async () => {
    const title = taskText.trim();
    if (!title) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ user_id: userId, title, is_completed: false }])
      .select()
      .single();

    if (error) {
      toast("Erro ao criar tarefa", {
        description: error.message,
        style: { background: "#7f1d1d", color: "white" },
      });
      return;
    }

    setTasks((previous) => [
      { id: data.id, text: data.title, completed: data.is_completed },
      ...previous,
    ]);
    setTaskText("");
    toast("Tarefa criada", {
      description: "Sua tarefa foi adicionada à lista.",
    });
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const completed = !task.completed;
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: completed })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      toast("Erro ao atualizar tarefa", {
        description: error.message,
        style: { background: "#7f1d1d", color: "white" },
      });
      return;
    }

    setTasks((previous) =>
      previous.map((item) => (item.id === id ? { ...item, completed } : item)),
    );
  };

  const saveEdit = async (id: string) => {
    const title = editText.trim();
    if (!title) return;

    const { error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      toast("Erro ao atualizar tarefa", {
        description: error.message,
        style: { background: "#7f1d1d", color: "white" },
      });
      return;
    }

    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, text: title } : task)),
    );
    setEditingId(null);
    toast("Tarefa atualizada", {
      description: "O texto da tarefa foi alterado.",
    });
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      toast("Erro ao excluir tarefa", {
        description: error.message,
        style: { background: "#7f1d1d", color: "white" },
      });
      return;
    }

    setTasks((previous) => previous.filter((item) => item.id !== id));
    toast("Tarefa excluída", {
      description: "A tarefa foi removida da lista.",
      style: { background: "#7f1d1d", color: "white" },
    });
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "pendentes") return !task.completed;
    if (filter === "concluidas") return task.completed;
    return true;
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card className="flex flex-col gap-4 rounded-2xl border-none bg-blue-950 p-6 shadow-2xl">
        <label className="text-lg font-bold text-white">
          Digite o nome da sua tarefa:
        </label>
        <Input
          value={taskText}
          onChange={(event) => setTaskText(event.target.value)}
          placeholder="Ler, Estudar, Tomar remédios..."
          className="border-blue-800 bg-transparent text-white placeholder:text-blue-300/50"
        />
        <Button
          onClick={addTask}
          className="bg-white font-bold text-black transition-colors hover:bg-blue-100"
        >
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between px-1 text-sm font-bold">
          <p className="text-blue-200">Tarefas criadas: {tasks.length}</p>
          <p className="text-purple-200">
            Concluídas: {completedTasks} de {tasks.length}
          </p>
        </div>
        <div className="flex gap-2">
          {(["todas", "pendentes", "concluidas"] as TaskFilter[]).map(
            (taskFilter) => (
              <button
                key={taskFilter}
                onClick={() => setFilter(taskFilter)}
                className={`flex-1 rounded-md py-1 text-xs font-bold uppercase transition-all ${
                  filter === taskFilter
                    ? "scale-105 bg-white text-blue-950"
                    : "bg-blue-950/40 text-white/60"
                }`}
              >
                {taskFilter}
              </button>
            ),
          )}
        </div>
      </div>

      {visibleTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="mb-4 rounded-full bg-white/10 p-4">
            <span className="text-4xl">🚀</span>
          </div>
          <h3 className="text-lg font-semibold">Sua lista está limpa!</h3>
          <p className="text-sm text-white/50">
            Que tal adicionar uma nova tarefa para turbinar seu dia?
          </p>
        </motion.div>
      )}

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {visibleTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className="group flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"
            >
              {editingId === task.id ? (
                <div className="mr-2 flex flex-1 gap-2">
                  <Input
                    value={editText}
                    onChange={(event) => setEditText(event.target.value)}
                    className="h-8 border-white/20 bg-blue-900"
                    autoFocus
                  />
                  <Button size="sm" onClick={() => saveEdit(task.id)}>
                    Salvar
                  </Button>
                </div>
              ) : (
                <span
                  className={`flex-1 ${task.completed ? "text-white/50 line-through" : ""}`}
                  onDoubleClick={() => {
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
                  aria-label={`Editar ${task.text}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleTask(task.id)}
                  className="transition-colors hover:text-green-400"
                  aria-label={`Alternar conclusão de ${task.text}`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="transition-colors hover:text-red-400"
                      aria-label={`Excluir ${task.text}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border border-white/20 bg-blue-950 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Tem certeza que deseja
                        excluir esta tarefa?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-black">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteTask(task.id)}
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
  );
}
