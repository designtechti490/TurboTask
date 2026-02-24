import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { Field, FieldDescription, FieldLabel } from "./components/ui/field";
import { Plus } from "lucide-react";

function App() {
  return (
    <main className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
      <header className="mx-auto max-w-md w-full items-center justify-center">
        <h1 className="text-5xl/tight text-center">✅ TurboTask</h1>
      </header>
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center">
        <Field className="bg-blue-950 rounded-2xl p-2">
          <FieldLabel htmlFor="input-task"></FieldLabel>
          <FieldDescription className="text-lg text-white font-bold ">
            Digite o nome da sua tarefa:
          </FieldDescription>
          <Input
            id="input-task"
            placeholder="Ler, Estudar, Tomar remédios..."
            className="placeholder-blue-950 placeholder-opacity-100"
          />
          <Button className="font-bold bg-white text-black hover:text-white">
            <Plus /> Criar
          </Button>
        </Field>
      </div>
    </main>
  );
}

export default App;
