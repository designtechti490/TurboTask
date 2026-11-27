import { Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TicketPriority, TicketSector } from "@/features/tickets/types";

interface TicketFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  sector: TicketSector | "";
  onSectorChange: (value: TicketSector | "") => void;
  priority: TicketPriority | "";
  onPriorityChange: (value: TicketPriority | "") => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  ticketCount: number;
}

export function TicketForm({
  title,
  onTitleChange,
  sector,
  onSectorChange,
  priority,
  onPriorityChange,
  description,
  onDescriptionChange,
  onSubmit,
  ticketCount,
}: TicketFormProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl border-none bg-blue-950 p-6 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">
          Abrir Novo Chamado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Título do problema..."
          className="border-blue-800 bg-transparent text-white placeholder:text-blue-300/50"
        />

        <Select
          value={sector}
          onValueChange={(value) => onSectorChange(value as TicketSector)}
        >
          <SelectTrigger className="w-full max-w-48 font-bold text-white">
            <SelectValue placeholder="Setor do incidente" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Setor</SelectLabel>
              <SelectItem value="manutencao">Manutenção</SelectItem>
              <SelectItem value="rh">RH</SelectItem>
              <SelectItem value="administracao">Administração</SelectItem>
              <SelectItem value="diretoria">Diretoria</SelectItem>
              <SelectItem value="recepcao">Recepção</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <RadioGroup
          value={priority}
          onValueChange={(value) => onPriorityChange(value as TicketPriority)}
          className="m-4 flex flex-col gap-3 font-bold text-white sm:flex-row sm:flex-wrap sm:gap-6"
        >
          <span className="mb-1 text-sm sm:text-base">
            Qual a prioridade?
          </span>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="baixa"
              id="prioridade-baixa"
              className="border-white/60 text-white data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900"
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
              className="border-white/60 text-white data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900"
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
              className="border-white/60 text-white data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900"
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
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Descreva o que está acontecendo detalhadamente..."
          className="border-blue-800 bg-transparent text-white placeholder:text-blue-300/50"
        />

        <div className="flex flex-col gap-4">
          <Button
            onClick={onSubmit}
            className="w-full bg-white font-bold text-black transition-colors hover:bg-blue-100"
          >
            Gerar Chamado <TicketIcon />
          </Button>
          <p className="text-sm text-blue-200">
            Chamados criados: {ticketCount}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
