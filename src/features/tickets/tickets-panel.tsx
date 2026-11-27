import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { TicketForm } from "@/features/tickets/ticket-form";
import { TicketList } from "@/features/tickets/ticket-list";
import type {
  Ticket,
  TicketPriority,
  TicketSector,
  TicketStatus,
} from "@/features/tickets/types";

interface TicketsPanelProps {
  userId: string;
  isIT: boolean;
}

export function TicketsPanel({ userId, isIT }: TicketsPanelProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sector, setSector] = useState<TicketSector | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsQuery = supabase.from("tickets").select("*");
      const scopedQuery = isIT
        ? ticketsQuery
        : ticketsQuery.eq("user_id", userId);
      const { data, error } = await scopedQuery.order("created_at", {
        ascending: false,
      });

      if (error) {
        toast("Erro ao buscar chamados", {
          description: error.message,
          style: { background: "#7f1d1d", color: "white" },
        });
        return;
      }

      setTickets(
        (data ?? []).map((ticket) => ({
          id: ticket.id,
          title: ticket.title,
          sector: ticket.sector,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          createdAt: ticket.created_at,
        })),
      );
    };

    fetchTickets();
  }, [isIT, userId]);

  const createTicket = async () => {
    if (!title.trim() || !description.trim() || !sector || !priority) return;

    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          user_id: userId,
          title,
          description,
          priority,
          sector,
          status: "aberto",
        },
      ])
      .select()
      .single();

    if (error) {
      toast("Erro ao criar chamado", {
        description: error.message,
        style: { background: "#7f1d1d", color: "white" },
      });
      return;
    }

    setTickets((previous) => [
      {
        id: data.id,
        title: data.title,
        sector: data.sector,
        description: data.description,
        priority: data.priority,
        status: data.status,
        createdAt: data.created_at,
      },
      ...previous,
    ]);
    setTitle("");
    setDescription("");
    setSector("");
    setPriority("");
    toast("Chamado criado", {
      description: "Seu chamado foi aberto com sucesso.",
    });
  };

  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    if (!isIT) return;

    const { error } = await supabase
      .from("tickets")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast("Erro ao atualizar status", {
        description: error.message,
        style: { background: "#7f1d1d", color: "white" },
      });
      return;
    }

    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket,
      ),
    );
    toast("Status atualizado", {
      description: `O chamado foi marcado como ${status.replace("_", " ")}.`,
    });
  };

  const deleteTicket = async (id: string) => {
    const { error } = await supabase.from("tickets").delete().eq("id", id);

    if (error) {
      toast("Erro ao excluir chamado", {
        description: error.message,
        style: { background: "#7f1d1d", color: "white" },
      });
      return;
    }

    setTickets((previous) => previous.filter((ticket) => ticket.id !== id));
    toast("Chamado excluído", {
      description: "O chamado foi removido da fila.",
      style: { background: "#7f1d1d", color: "white" },
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <TicketForm
        title={title}
        onTitleChange={setTitle}
        sector={sector}
        onSectorChange={setSector}
        priority={priority}
        onPriorityChange={setPriority}
        description={description}
        onDescriptionChange={setDescription}
        onSubmit={createTicket}
        ticketCount={tickets.length}
      />
      <TicketList
        tickets={tickets}
        isIT={isIT}
        onStatusChange={updateTicketStatus}
        onDelete={deleteTicket}
      />
    </div>
  );
}
