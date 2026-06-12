import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, MapPin, Users, DollarSign } from "lucide-react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { useEntities, Wedding } from "@/contexts/EntitiesContext";
import { NewWeddingDialog } from "@/components/shared/EntityDialogs";

function WeddingPopoverContent({ wedding }: { wedding: Wedding }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold text-foreground">{wedding.couple}</h4>
        <Badge variant={wedding.status === "Requiere Atención" ? "destructive" : "secondary"}>
          {wedding.status}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{wedding.date}</p>
      <div className="space-y-1 pt-2 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {wedding.venue}
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          {wedding.guests} invitados
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          {wedding.budget}
        </div>
      </div>
    </div>
  );
}

function CalendarView() {
  const { weddings } = useEntities();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weddingsByDay = useMemo(() => {
    const map = new Map<string, Wedding[]>();
    weddings.forEach((w) => {
      const key = format(w.dateObj, "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(w);
      map.set(key, arr);
    });
    return map;
  }, [weddings]);

  const weekdayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px mb-2">
          {weekdayLabels.map((d) => (
            <div key={d} className="text-xs font-medium text-muted-foreground text-center py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-border rounded-md overflow-hidden">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayWeddings = weddingsByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, currentMonth);
            const today = isToday(day);

            return (
              <div
                key={key}
                className={`min-h-[96px] p-1.5 bg-card flex flex-col gap-1 ${
                  !inMonth ? "opacity-40" : ""
                }`}
              >
                <div
                  className={`text-xs font-medium self-end ${
                    today
                      ? "bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center"
                      : "text-foreground"
                  }`}
                >
                  {format(day, "d")}
                </div>
                <div className="flex flex-col gap-1 overflow-hidden">
                  {dayWeddings.map((w) => (
                    <Popover key={w.id}>
                      <PopoverTrigger asChild>
                        <button
                          className={`text-left text-[11px] leading-tight px-1.5 py-1 rounded truncate font-medium transition-colors ${
                            w.status === "Requiere Atención"
                              ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                              : "bg-primary/15 text-primary hover:bg-primary/25"
                          }`}
                        >
                          {w.couple}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64" align="start">
                        <WeddingPopoverContent wedding={w} />
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ListView() {
  const { weddings } = useEntities();
  return (
    <div className="grid gap-4">
      {weddings.map((w) => (
        <Card key={w.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5 flex items-center gap-6 flex-wrap">
            <div className="flex-1 min-w-[180px]">
              <h3 className="font-semibold text-foreground">{w.couple}</h3>
              <p className="text-sm text-muted-foreground">{w.date} · {w.venue}</p>
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">{w.guests} invitados</div>
            <div className="text-sm font-medium text-foreground hidden md:block">{w.budget}</div>
            {w.inviteCode && (
              <Badge variant="outline" className="font-mono">Código: {w.inviteCode}</Badge>
            )}
            <Badge variant={w.status === "Requiere Atención" ? "destructive" : "secondary"}>{w.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function PlannerWeddings() {
  const { weddings } = useEntities();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bodas</h1>
          <p className="text-muted-foreground">Gestiona todas tus próximas bodas</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{weddings.length} en total</Badge>
          <NewWeddingDialog />
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>
        <TabsContent value="list">
          <ListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
