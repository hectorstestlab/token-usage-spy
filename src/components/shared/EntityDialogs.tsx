import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEntities, Wedding, Client, Vendor, Task, BudgetCategory, VendorService, VendorBooking } from "@/contexts/EntitiesContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";

function CreateButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <Button onClick={onClick}>
      <Plus className="h-4 w-4 mr-1" />
      {children}
    </Button>
  );
}

interface BaseDialogProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}

/* ------------------------- WEDDING ------------------------- */
export function NewWeddingDialog({ trigger }: BaseDialogProps) {
  const { addWedding } = useEntities();
  const [open, setOpen] = useState(false);
  const [couple, setCouple] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [guests, setGuests] = useState(100);
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<Wedding["status"]>("Planificando");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couple || !date || !venue) return;
    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    addWedding({ couple, date: formatted, dateObj, venue, guests, budget: budget || "$0", status, progress: 0 });
    toast.success("Boda creada");
    setOpen(false);
    setCouple(""); setDate(""); setVenue(""); setGuests(100); setBudget(""); setStatus("Planificando");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <CreateButton>Nueva Boda</CreateButton>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Boda</DialogTitle>
          <DialogDescription>Agrega una nueva boda a tu lista</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Pareja</Label><Input value={couple} onChange={(e) => setCouple(e.target.value)} placeholder="Sara y Miguel" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Invitados</Label><Input type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></div>
          </div>
          <div className="space-y-2"><Label>Lugar</Label><Input value={venue} onChange={(e) => setVenue(e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Presupuesto</Label><Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$45,000" /></div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Wedding["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planificando">Planificando</SelectItem>
                  <SelectItem value="En Curso">En Curso</SelectItem>
                  <SelectItem value="Requiere Atención">Requiere Atención</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button type="submit">Crear</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- CLIENT ------------------------- */
export function NewClientDialog({ trigger }: BaseDialogProps) {
  const { addClient } = useEntities();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wedding, setWedding] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addClient({ name, email, phone, wedding, status: "Nuevo" });
    toast.success("Cliente agregado");
    setOpen(false);
    setName(""); setEmail(""); setPhone(""); setWedding("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <CreateButton>Nuevo Cliente</CreateButton>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Nombre de la pareja</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label>Teléfono</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="space-y-2"><Label>Fecha de boda</Label><Input value={wedding} onChange={(e) => setWedding(e.target.value)} placeholder="15 Abr, 2026" /></div>
          <DialogFooter><Button type="submit">Agregar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- VENDOR ------------------------- */
export function NewVendorDialog({ trigger }: BaseDialogProps) {
  const { addVendor } = useEntities();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addVendor({ name, category, rating: 0, bookings: 0, status: "Nuevo" });
    toast.success("Proveedor agregado");
    setOpen(false);
    setName(""); setCategory("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <CreateButton>Nuevo Proveedor</CreateButton>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo Proveedor</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Nombre</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Categoría</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Florista, Catering, ..." /></div>
          <DialogFooter><Button type="submit">Agregar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- TASK ------------------------- */
export function NewTaskDialog({ trigger }: BaseDialogProps) {
  const { addTask } = useEntities();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [urgent, setUrgent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    addTask({ text, due: due || "Sin fecha", urgent, done: false });
    toast.success("Tarea creada");
    setOpen(false);
    setText(""); setDue(""); setUrgent(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <CreateButton>Nueva Tarea</CreateButton>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nueva Tarea</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Descripción</Label><Textarea value={text} onChange={(e) => setText(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Vence</Label><Input value={due} onChange={(e) => setDue(e.target.value)} placeholder="Hoy, Mañana, 25 Mar" /></div>
          <div className="flex items-center gap-2">
            <input id="urgent" type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="rounded border-input" />
            <Label htmlFor="urgent" className="cursor-pointer">Urgente</Label>
          </div>
          <DialogFooter><Button type="submit">Crear</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- BUDGET CATEGORY ------------------------- */
export function NewBudgetCategoryDialog({ scope, trigger }: BaseDialogProps & { scope: BudgetCategory["scope"] }) {
  const { addBudgetCategory } = useEntities();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [allocated, setAllocated] = useState(0);
  const [spent, setSpent] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addBudgetCategory({ name, allocated, spent, scope });
    toast.success("Categoría agregada");
    setOpen(false);
    setName(""); setAllocated(0); setSpent(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <CreateButton>Nueva Categoría</CreateButton>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nueva Categoría de Presupuesto</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Nombre</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Asignado ($)</Label><Input type="number" value={allocated} onChange={(e) => setAllocated(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Gastado ($)</Label><Input type="number" value={spent} onChange={(e) => setSpent(Number(e.target.value))} /></div>
          </div>
          <DialogFooter><Button type="submit">Agregar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- VENDOR SERVICE ------------------------- */
export function NewServiceDialog({ trigger }: BaseDialogProps) {
  const { addService } = useEntities();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addService({ name, description, price: price || "$0", active: true });
    toast.success("Servicio agregado");
    setOpen(false);
    setName(""); setDescription(""); setPrice("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <CreateButton>Agregar Servicio</CreateButton>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo Servicio</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Nombre</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Descripción</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="space-y-2"><Label>Precio</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$3,200" /></div>
          <DialogFooter><Button type="submit">Crear</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- VENDOR BOOKING ------------------------- */
export function NewBookingDialog({ trigger }: BaseDialogProps) {
  const { addBooking } = useEntities();
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<VendorBooking["status"]>("Consulta");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    addBooking({ client, date, venue, amount: amount || "Por definir", status });
    toast.success("Reserva creada");
    setOpen(false);
    setClient(""); setDate(""); setVenue(""); setAmount(""); setStatus("Consulta");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <CreateButton>Nueva Reserva</CreateButton>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nueva Reserva</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Cliente</Label><Input value={client} onChange={(e) => setClient(e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Fecha</Label><Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="15 Abr, 2026" /></div>
            <div className="space-y-2"><Label>Monto</Label><Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$3,200" /></div>
          </div>
          <div className="space-y-2"><Label>Lugar</Label><Input value={venue} onChange={(e) => setVenue(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as VendorBooking["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Consulta">Consulta</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter><Button type="submit">Crear</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
