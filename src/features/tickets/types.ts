export type TicketPriority = "baixa" | "media" | "alta";
export type TicketStatus = "aberto" | "em_atendimento" | "concluido";
export type TicketSector =
  | "rh"
  | "administrativo"
  | "manutencao"
  | "diretoria"
  | "recepcao";

export interface Ticket {
  id: string;
  title: string;
  sector: TicketSector;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}
