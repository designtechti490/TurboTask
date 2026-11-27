export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type TaskFilter = "todas" | "pendentes" | "concluidas";
