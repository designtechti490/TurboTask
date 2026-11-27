import type { ReactNode } from "react";
import { Inbox, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AppShellProps {
  email: string;
  onSignOut: () => void;
  tasks: ReactNode;
  tickets: ReactNode;
}

export function AppShell({
  email,
  onSignOut,
  tasks,
  tickets,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-linear-to-r from-blue-500 to-purple-500 p-8 text-white">
      <header className="mx-auto mb-8 flex w-full max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-5xl font-bold italic tracking-tighter">
          ✅ TurboTask
        </h1>
        <div className="flex items-center gap-3">
          <span className="max-w-56 truncate text-xs text-white/80">
            {email}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/40 bg-blue-950/30 text-white hover:bg-white/10 hover:text-white"
            onClick={onSignOut}
          >
            Sair
          </Button>
        </div>
      </header>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-3xl grid-cols-2 bg-blue-950/50">
          <TabsTrigger value="tasks">
            <ListChecks /> Tarefas
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Inbox /> Chamados
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="tasks"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {tasks}
        </TabsContent>
        <TabsContent
          value="tickets"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {tickets}
        </TabsContent>
      </Tabs>
    </main>
  );
}
