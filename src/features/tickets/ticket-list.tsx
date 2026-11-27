import { Inbox, Pickaxe, Ticket as TicketIcon, TicketCheck, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
import type { Ticket, TicketStatus } from "@/features/tickets/types";

interface TicketListProps {
  tickets: Ticket[];
  isIT: boolean;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onDelete: (id: string) => void;
}

export function TicketList({
  tickets,
  isIT,
  onStatusChange,
  onDelete,
}: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-white/70">
        <Inbox className="mb-3 h-8 w-8" />
        <p>Nenhum chamado aberto ainda. Crie o primeiro acima.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between px-1 text-sm font-bold text-blue-100">
        <span>Chamados no painel: {tickets.length}</span>
      </div>
      <AnimatePresence>
        {tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            layout
            className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <TicketIcon className="h-4 w-4" />
                  {ticket.title}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {ticket.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-blue-900/70 px-2 py-1 text-blue-100">
                    Setor: {ticket.sector}
                  </span>
                  <span
                    className={`flex items-center rounded-full px-2 py-1 ${
                      ticket.priority === "alta"
                        ? "bg-red-500/80 text-white"
                        : ticket.priority === "media"
                          ? "bg-yellow-400/80 text-black"
                          : "bg-emerald-500/80 text-black"
                    }`}
                  >
                    Prioridade: {ticket.priority}
                  </span>
                  <span className="flex items-center rounded-full bg-white/10 px-2 py-1 text-white/80">
                    Status: {ticket.status}
                  </span>

                  <div className="mt-3 flex w-full flex-col gap-2 text-xs sm:flex-row sm:flex-wrap">
                    {isIT && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-white/30 text-black sm:w-auto"
                          onClick={() =>
                            onStatusChange(ticket.id, "em_atendimento")
                          }
                        >
                          <Pickaxe /> Em atendimento
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-emerald-400/60 text-emerald-500 sm:w-auto"
                          onClick={() => onStatusChange(ticket.id, "concluido")}
                        >
                          <TicketCheck /> Concluir
                        </Button>
                      </>
                    )}
                    {(isIT || ticket.status === "aberto") && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-red-400/60 text-red-500 sm:w-auto"
                          >
                            <Trash2 /> Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border border-white/20 bg-blue-950 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Excluir chamado?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Tem certeza que
                              deseja excluir este chamado?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-black">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => onDelete(ticket.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
