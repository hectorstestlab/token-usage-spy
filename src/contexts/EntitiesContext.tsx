import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

// ----------------- Public shapes preserved from previous mock -----------------
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
  inviteCode?: string;
  plannerId?: string;
}
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  wedding: string;
  status: "Activo" | "Nuevo" | "Inactivo";
  userId?: string;
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
  weddingId?: string;
}
export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  scope: "planner" | "client";
  weddingId?: string;
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
  loading: boolean;
  weddings: Wedding[];
  addWedding: (w: Omit<Wedding, "id">) => Promise<void>;
  clients: Client[];
  addClient: (c: Omit<Client, "id">) => Promise<void>;
  vendors: Vendor[];
  addVendor: (v: Omit<Vendor, "id">) => Promise<void>;
  tasks: Task[];
  addTask: (t: Omit<Task, "id">) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  budget: BudgetCategory[];
  addBudgetCategory: (b: Omit<BudgetCategory, "id">) => Promise<void>;
  services: VendorService[];
  addService: (s: Omit<VendorService, "id">) => Promise<void>;
  bookings: VendorBooking[];
  addBooking: (b: Omit<VendorBooking, "id">) => Promise<void>;
  joinWeddingByCode: (code: string, asRole: "client" | "vendor") => Promise<boolean>;
  refresh: () => Promise<void>;
}

const EntitiesContext = createContext<EntitiesContextValue | null>(null);

const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "Sin fecha";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Sin fecha";
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
};
const fmtMoney = (n: number | null | undefined) =>
  n == null ? "$0" : `$${Number(n).toLocaleString("en-US")}`;
const parseMoney = (s: string) => Number(String(s).replace(/[^\d.]/g, "")) || 0;

export function EntitiesProvider({ children }: { children: ReactNode }) {
  const { user, role } = useUser();
  const [loading, setLoading] = useState(false);
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [budget, setBudget] = useState<BudgetCategory[]>([]);
  const [services, setServices] = useState<VendorService[]>([]);
  const [bookings, setBookings] = useState<VendorBooking[]>([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setWeddings([]); setClients([]); setVendors([]); setTasks([]);
      setBudget([]); setServices([]); setBookings([]);
      return;
    }
    setLoading(true);
    try {
      // -------- WEDDINGS visible to current user (planner owns OR member) --------
      const { data: wRows } = await supabase
        .from("weddings")
        .select("*")
        .order("wedding_date", { ascending: true });
      const mappedWeddings: Wedding[] = (wRows ?? []).map((w: any) => ({
        id: w.id,
        couple: w.couple,
        date: fmtDate(w.wedding_date),
        dateObj: w.wedding_date ? new Date(w.wedding_date) : new Date(),
        venue: w.venue ?? "",
        guests: w.guests ?? 0,
        status: (w.status ?? "Planificando") as Wedding["status"],
        budget: fmtMoney(Number(w.budget_total ?? 0)),
        progress: w.progress ?? 0,
        inviteCode: w.invite_code,
        plannerId: w.planner_id,
      }));
      setWeddings(mappedWeddings);
      const wedIds = mappedWeddings.map((w) => w.id);

      // -------- TASKS for visible weddings --------
      if (wedIds.length) {
        const { data: tRows } = await supabase
          .from("tasks")
          .select("*")
          .in("wedding_id", wedIds)
          .order("created_at", { ascending: false });
        setTasks(
          (tRows ?? []).map((t: any) => ({
            id: t.id,
            text: t.text,
            due: fmtDate(t.due_date),
            urgent: !!t.urgent,
            done: !!t.done,
            weddingId: t.wedding_id,
          }))
        );

        // -------- BUDGET for visible weddings --------
        const { data: bRows } = await supabase
          .from("budget_categories")
          .select("*")
          .in("wedding_id", wedIds);
        setBudget(
          (bRows ?? []).map((b: any) => ({
            id: b.id,
            name: b.name,
            allocated: Number(b.allocated),
            spent: Number(b.spent),
            scope: b.scope,
            weddingId: b.wedding_id,
          }))
        );
      } else {
        setTasks([]);
        setBudget([]);
      }

      // -------- PLANNER VENDORS (planner-only directory) --------
      if (role === "planner") {
        const { data: vRows } = await supabase
          .from("planner_vendors")
          .select("*")
          .order("created_at", { ascending: false });
        setVendors(
          (vRows ?? []).map((v: any) => ({
            id: v.id,
            name: v.name,
            category: v.category,
            rating: Number(v.rating) || 0,
            bookings: v.bookings ?? 0,
            status: v.status,
          }))
        );

        // -------- CLIENTS derived from wedding_members --------
        if (wedIds.length) {
          const { data: members } = await supabase
            .from("wedding_members")
            .select("*")
            .eq("member_role", "client")
            .in("wedding_id", wedIds);
          const userIds = (members ?? []).map((m: any) => m.user_id);
          let profilesMap = new Map<string, string>();
          if (userIds.length) {
            const { data: profs } = await supabase
              .from("profiles")
              .select("id, full_name")
              .in("id", userIds);
            (profs ?? []).forEach((p: any) => profilesMap.set(p.id, p.full_name ?? "Cliente"));
          }
          const wedMap = new Map(mappedWeddings.map((w) => [w.id, w]));
          setClients(
            (members ?? []).map((m: any) => {
              const w = wedMap.get(m.wedding_id);
              return {
                id: m.id,
                name: profilesMap.get(m.user_id) ?? "Cliente",
                email: "",
                phone: "",
                wedding: w?.date ?? "",
                status: "Activo" as const,
                userId: m.user_id,
              };
            })
          );
        } else {
          setClients([]);
        }
      } else {
        setVendors([]);
        setClients([]);
      }

      // -------- VENDOR-OWNED SERVICES + BOOKINGS --------
      if (role === "vendor") {
        const [{ data: sRows }, { data: bkRows }] = await Promise.all([
          supabase.from("vendor_services").select("*").order("created_at", { ascending: false }),
          supabase.from("vendor_bookings").select("*").order("created_at", { ascending: false }),
        ]);
        setServices(
          (sRows ?? []).map((s: any) => ({
            id: s.id, name: s.name, description: s.description ?? "",
            price: s.price ?? "$0", active: !!s.active,
          }))
        );
        setBookings(
          (bkRows ?? []).map((b: any) => ({
            id: b.id, client: b.client_name, date: fmtDate(b.booking_date),
            venue: b.venue ?? "", status: b.status as VendorBooking["status"],
            amount: b.amount ?? "Por definir",
          }))
        );
      } else {
        setServices([]);
        setBookings([]);
      }
    } catch (err) {
      console.error("EntitiesContext refresh error", err);
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => { refresh(); }, [refresh]);

  // ------------------------- mutations -------------------------
  const addWedding: EntitiesContextValue["addWedding"] = async (w) => {
    if (!user) return;
    const { error } = await supabase.from("weddings").insert({
      planner_id: user.id,
      couple: w.couple,
      wedding_date: w.dateObj.toISOString().slice(0, 10),
      venue: w.venue,
      guests: w.guests,
      budget_total: parseMoney(w.budget),
      progress: w.progress ?? 0,
      status: w.status,
    });
    if (error) { toast.error(error.message); return; }
    await refresh();
  };

  const addClient: EntitiesContextValue["addClient"] = async () => {
    toast.info("Las parejas se unen ingresando el código de invitación de su boda.");
  };

  const addVendor: EntitiesContextValue["addVendor"] = async (v) => {
    if (!user) return;
    const { error } = await supabase.from("planner_vendors").insert({
      planner_id: user.id,
      name: v.name, category: v.category,
      rating: v.rating, bookings: v.bookings, status: v.status,
    });
    if (error) { toast.error(error.message); return; }
    await refresh();
  };

  const addTask: EntitiesContextValue["addTask"] = async (t) => {
    const wid = t.weddingId ?? weddings[0]?.id;
    if (!wid) { toast.error("Crea primero una boda"); return; }
    const due = t.due && t.due !== "Sin fecha" && /^\d{4}-\d{2}-\d{2}$/.test(t.due) ? t.due : null;
    const { error } = await supabase.from("tasks").insert({
      wedding_id: wid, text: t.text, due_date: due, urgent: t.urgent, done: t.done,
    });
    if (error) { toast.error(error.message); return; }
    await refresh();
  };

  const toggleTask: EntitiesContextValue["toggleTask"] = async (id) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const { error } = await supabase.from("tasks").update({ done: !t.done }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };

  const addBudgetCategory: EntitiesContextValue["addBudgetCategory"] = async (b) => {
    const wid = b.weddingId ?? weddings[0]?.id;
    if (!wid) { toast.error("Crea primero una boda"); return; }
    const { error } = await supabase.from("budget_categories").insert({
      wedding_id: wid, name: b.name, allocated: b.allocated, spent: b.spent, scope: b.scope,
    });
    if (error) { toast.error(error.message); return; }
    await refresh();
  };

  const addService: EntitiesContextValue["addService"] = async (s) => {
    if (!user) return;
    const { error } = await supabase.from("vendor_services").insert({
      vendor_id: user.id, name: s.name, description: s.description,
      price: s.price, active: s.active,
    });
    if (error) { toast.error(error.message); return; }
    await refresh();
  };

  const addBooking: EntitiesContextValue["addBooking"] = async (b) => {
    if (!user) return;
    const date = b.date && /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : null;
    const { error } = await supabase.from("vendor_bookings").insert({
      vendor_id: user.id, client_name: b.client, booking_date: date,
      venue: b.venue, status: b.status, amount: b.amount,
    });
    if (error) { toast.error(error.message); return; }
    await refresh();
  };

  const joinWeddingByCode: EntitiesContextValue["joinWeddingByCode"] = async (code, asRole) => {
    const { error } = await supabase.rpc("join_wedding_by_code", { _code: code, _role: asRole });
    if (error) { toast.error(error.message); return false; }
    toast.success("Te uniste a la boda");
    await refresh();
    return true;
  };

  return (
    <EntitiesContext.Provider
      value={{
        loading, weddings, addWedding, clients, addClient, vendors, addVendor,
        tasks, addTask, toggleTask, budget, addBudgetCategory,
        services, addService, bookings, addBooking, joinWeddingByCode, refresh,
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
