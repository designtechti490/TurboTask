import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
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

        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex items-center justify-between border border-white/20 group"
            >
              <span
                className={`flex-1 ${task.completed ? "line-through text-white/50" : ""}`}
              >
                {task.text}
              </span>

              <div className="flex gap-2">
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
export default App;
