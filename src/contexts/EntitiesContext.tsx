import { createContext, useContext, useState, ReactNode } from "react";

export interface Wedding {
  id: string;
  couple: string;
  date: string;
  dateObj: Date;
  venue: string;
  guests: number;
  status: "Planificando" | "En Curso" | "Requiere Atención" | "Completado";
  budget: string;
  progress: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  wedding: string;
  status: "Activo" | "Nuevo" | "Inactivo";
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  bookings: number;
  status: "Preferido" | "Activo" | "Nuevo";
}

export interface Task {
  id: string;
  text: string;
  due: string;
  urgent: boolean;
  done: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  scope: "planner" | "client";
}

export interface VendorService {
  id: string;
  name: string;
  description: string;
  price: string;
  active: boolean;
}

export interface VendorBooking {
  id: string;
  client: string;
  date: string;
  venue: string;
  status: "Confirmado" | "Pendiente" | "Consulta";
  amount: string;
}

interface EntitiesContextValue {
  weddings: Wedding[];
  addWedding: (w: Omit<Wedding, "id">) => void;
  clients: Client[];
  addClient: (c: Omit<Client, "id">) => void;
  vendors: Vendor[];
  addVendor: (v: Omit<Vendor, "id">) => void;
  tasks: Task[];
  addTask: (t: Omit<Task, "id">) => void;
  toggleTask: (id: string) => void;
  budget: BudgetCategory[];
  addBudgetCategory: (b: Omit<BudgetCategory, "id">) => void;
  services: VendorService[];
  addService: (s: Omit<VendorService, "id">) => void;
  bookings: VendorBooking[];
  addBooking: (b: Omit<VendorBooking, "id">) => void;
}

const EntitiesContext = createContext<EntitiesContextValue | null>(null);

const id = () => Math.random().toString(36).slice(2, 10);

const initialWeddings: Wedding[] = [
  { id: id(), couple: "Sara y Miguel", date: "15 Abr, 2026", dateObj: new Date(2026, 3, 15), venue: "Jardín de Rosas", guests: 150, status: "En Curso", budget: "$45,000", progress: 78 },
  { id: id(), couple: "Emma y Jaime", date: "22 May, 2026", dateObj: new Date(2026, 4, 22), venue: "Hacienda del Lago", guests: 200, status: "Requiere Atención", budget: "$62,000", progress: 45 },
  { id: id(), couple: "Olivia y David", date: "10 Jun, 2026", dateObj: new Date(2026, 5, 10), venue: "Gran Salón", guests: 120, status: "En Curso", budget: "$38,000", progress: 62 },
  { id: id(), couple: "Sofía y Liam", date: "4 Jul, 2026", dateObj: new Date(2026, 6, 4), venue: "Pabellón de Playa", guests: 80, status: "Planificando", budget: "$28,000", progress: 20 },
  { id: id(), couple: "Ava y Noah", date: "20 Ago, 2026", dateObj: new Date(2026, 7, 20), venue: "Cabaña de Montaña", guests: 100, status: "Planificando", budget: "$35,000", progress: 15 },
];

const initialClients: Client[] = [
  { id: id(), name: "Sara y Miguel", email: "sara.m@email.com", phone: "(555) 123-4567", wedding: "15 Abr, 2026", status: "Activo" },
  { id: id(), name: "Emma y Jaime", email: "emma.j@email.com", phone: "(555) 234-5678", wedding: "22 May, 2026", status: "Activo" },
  { id: id(), name: "Olivia y David", email: "olivia.d@email.com", phone: "(555) 345-6789", wedding: "10 Jun, 2026", status: "Activo" },
  { id: id(), name: "Sofía y Liam", email: "sofia.l@email.com", phone: "(555) 456-7890", wedding: "4 Jul, 2026", status: "Nuevo" },
  { id: id(), name: "Ava y Noah", email: "ava.n@email.com", phone: "(555) 567-8901", wedding: "20 Ago, 2026", status: "Nuevo" },
];

const initialVendors: Vendor[] = [
  { id: id(), name: "Flores y Pétalos", category: "Florista", rating: 4.9, bookings: 12, status: "Preferido" },
  { id: id(), name: "Captura Momentos Fotografía", category: "Fotógrafo", rating: 4.8, bookings: 8, status: "Preferido" },
  { id: id(), name: "Celebraciones Gourmet", category: "Catering", rating: 4.7, bookings: 6, status: "Activo" },
  { id: id(), name: "Cuerdas Armónicas", category: "Entretenimiento", rating: 4.6, bookings: 4, status: "Activo" },
  { id: id(), name: "Dulces Capas Pastelería", category: "Pastel y Postres", rating: 4.9, bookings: 10, status: "Preferido" },
  { id: id(), name: "Decoración Elegante", category: "Decoración", rating: 4.5, bookings: 3, status: "Nuevo" },
];

const initialTasks: Task[] = [
  { id: id(), text: "Confirmar florista para Sara y Miguel", due: "Hoy", urgent: true, done: false },
  { id: id(), text: "Enviar contrato a Emma y Jaime", due: "Mañana", urgent: false, done: false },
  { id: id(), text: "Revisar opciones de menú de catering", due: "20 Mar", urgent: false, done: false },
  { id: id(), text: "Recorrido final — Jardín de Rosas", due: "25 Mar", urgent: false, done: false },
];

const initialBudget: BudgetCategory[] = [
  { id: id(), name: "Lugar y Catering", allocated: 18000, spent: 15200, scope: "planner" },
  { id: id(), name: "Fotografía y Video", allocated: 8000, spent: 6500, scope: "planner" },
  { id: id(), name: "Flores y Decoración", allocated: 5000, spent: 4800, scope: "planner" },
  { id: id(), name: "Entretenimiento", allocated: 4000, spent: 2000, scope: "planner" },
  { id: id(), name: "Vestuario y Belleza", allocated: 3500, spent: 3200, scope: "planner" },
  { id: id(), name: "Papelería", allocated: 1500, spent: 900, scope: "planner" },
  { id: id(), name: "Transporte", allocated: 2000, spent: 0, scope: "planner" },
  { id: id(), name: "Varios", allocated: 3000, spent: 1400, scope: "planner" },
  { id: id(), name: "Lugar y Catering", allocated: 18000, spent: 15200, scope: "client" },
  { id: id(), name: "Fotografía", allocated: 5500, spent: 5500, scope: "client" },
  { id: id(), name: "Flores", allocated: 3200, spent: 3200, scope: "client" },
  { id: id(), name: "Entretenimiento", allocated: 4000, spent: 0, scope: "client" },
  { id: id(), name: "Vestuario", allocated: 3500, spent: 2800, scope: "client" },
  { id: id(), name: "Otros", allocated: 2800, spent: 1200, scope: "client" },
];

const initialServices: VendorService[] = [
  { id: id(), name: "Fotografía de Boda", description: "Cobertura completa del día hasta 10 horas", price: "$3,200", active: true },
  { id: id(), name: "Sesión de Compromiso", description: "Sesión de 1 hora en ubicación a elegir", price: "$800", active: true },
  { id: id(), name: "Paquete Elopement", description: "Cobertura de ceremonia íntima de 2 horas", price: "$1,500", active: true },
  { id: id(), name: "Photo Booth Adicional", description: "Fondo personalizado, accesorios, impresiones ilimitadas", price: "$600", active: false },
];

const initialBookings: VendorBooking[] = [
  { id: id(), client: "Sara y Miguel", date: "15 Abr, 2026", venue: "Jardín de Rosas", status: "Confirmado", amount: "$3,200" },
  { id: id(), client: "Emma y Jaime", date: "22 May, 2026", venue: "Hacienda del Lago", status: "Confirmado", amount: "$4,500" },
  { id: id(), client: "Olivia y David", date: "10 Jun, 2026", venue: "Gran Salón", status: "Pendiente", amount: "$2,800" },
  { id: id(), client: "Evento Corporativo", date: "28 Mar, 2026", venue: "Centro de Conferencias", status: "Confirmado", amount: "$1,500" },
  { id: id(), client: "Sofía y Liam", date: "4 Jul, 2026", venue: "Pabellón de Playa", status: "Consulta", amount: "Por definir" },
];

export function EntitiesProvider({ children }: { children: ReactNode }) {
  const [weddings, setWeddings] = useState<Wedding[]>(initialWeddings);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [budget, setBudget] = useState<BudgetCategory[]>(initialBudget);
  const [services, setServices] = useState<VendorService[]>(initialServices);
  const [bookings, setBookings] = useState<VendorBooking[]>(initialBookings);

  return (
    <EntitiesContext.Provider
      value={{
        weddings,
        addWedding: (w) => setWeddings((prev) => [{ ...w, id: id() }, ...prev]),
        clients,
        addClient: (c) => setClients((prev) => [{ ...c, id: id() }, ...prev]),
        vendors,
        addVendor: (v) => setVendors((prev) => [{ ...v, id: id() }, ...prev]),
        tasks,
        addTask: (t) => setTasks((prev) => [{ ...t, id: id() }, ...prev]),
        toggleTask: (tid) =>
          setTasks((prev) => prev.map((t) => (t.id === tid ? { ...t, done: !t.done } : t))),
        budget,
        addBudgetCategory: (b) => setBudget((prev) => [...prev, { ...b, id: id() }]),
        services,
        addService: (s) => setServices((prev) => [{ ...s, id: id() }, ...prev]),
        bookings,
        addBooking: (b) => setBookings((prev) => [{ ...b, id: id() }, ...prev]),
      }}
    >
      {children}
    </EntitiesContext.Provider>
  );
}

export function useEntities() {
  const ctx = useContext(EntitiesContext);
  if (!ctx) throw new Error("useEntities must be used within EntitiesProvider");
  return ctx;
}
