import { AppShell } from "@/components/app-shell";
import { AuthPage } from "@/features/auth/auth-page";
import { useAuth } from "@/features/auth/use-auth";
import { TasksPanel } from "@/features/tasks/tasks-panel";
import { TicketsPanel } from "@/features/tickets/tickets-panel";

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-r from-blue-500 to-purple-500 p-4 text-white">
        <p>Carregando sessão...</p>
      </main>
    );
  }

  if (!auth.session) {
    return <AuthPage auth={auth} />;
  }

  const { user } = auth.session;
  const isIT = user.app_metadata.role === "it";

  return (
    <AppShell
      email={user.email ?? ""}
      onSignOut={auth.signOut}
      tasks={<TasksPanel userId={user.id} />}
      tickets={<TicketsPanel userId={user.id} isIT={isIT} />}
    />
  );
}

export default App;
