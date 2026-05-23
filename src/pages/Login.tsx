import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useUser, UserRole } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Heart, ClipboardList, Users, Store, Loader2 } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Ingresa tu nombre"),
  role: z.enum(["planner", "client", "vendor"]),
});

const roleOptions = [
  { value: "planner" as const, label: "Wedding Planner", description: "Gestiona bodas y clientes", icon: ClipboardList },
  { value: "client" as const, label: "Pareja", description: "Planifica tu boda", icon: Users },
  { value: "vendor" as const, label: "Proveedor", description: "Ofrece tus servicios", icon: Store },
];

export default function Login() {
  const navigate = useNavigate();
  const { user, role, loading: sessionLoading } = useUser();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  // Sign in form
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign up form
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suRole, setSuRole] = useState<UserRole>("planner");

  // Redirect when authenticated + role loaded
  useEffect(() => {
    if (!sessionLoading && user && role) {
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [user, role, sessionLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email: siEmail, password: siPassword });
    if (!parsed.success) {
      toast({ title: "Datos inválidos", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast({ title: "No se pudo iniciar sesión", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "¡Bienvenido de vuelta!" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({
      email: suEmail, password: suPassword, fullName: suName, role: suRole,
    });
    if (!parsed.success) {
      toast({ title: "Datos inválidos", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: parsed.data.fullName,
          role: parsed.data.role,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "No se pudo crear la cuenta", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "¡Cuenta creada!",
      description: "Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
    });
    setTab("signin");
    setSiEmail(parsed.data.email);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/login" });
    if (result.error) {
      setLoading(false);
      toast({ title: "Error con Google", description: result.error.message ?? String(result.error), variant: "destructive" });
    }
    // If redirected: browser navigates away. If tokens returned: onAuthStateChange handles routing.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-blush/30 via-background to-wedding-cream/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Heart className="h-10 w-10 text-primary fill-primary mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">WedPlan</h1>
          <p className="text-muted-foreground">Tu plataforma de planificación de bodas</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <CardTitle className="text-xl">Bienvenido de vuelta</CardTitle>
                <CardDescription>Ingresa con tu correo y contraseña</CardDescription>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Correo</Label>
                    <Input id="si-email" type="email" value={siEmail} onChange={(e) => setSiEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-password">Contraseña</Label>
                    <Input id="si-password" type="password" value={siPassword} onChange={(e) => setSiPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Iniciar sesión
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
                <CardDescription>Empieza a planificar en minutos</CardDescription>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Nombre completo</Label>
                    <Input id="su-name" value={suName} onChange={(e) => setSuName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Correo</Label>
                    <Input id="su-email" type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-password">Contraseña</Label>
                    <Input id="su-password" type="password" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} required minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label>Soy</Label>
                    <RadioGroup value={suRole ?? "planner"} onValueChange={(v) => setSuRole(v as UserRole)} className="grid gap-2">
                      {roleOptions.map((opt) => (
                        <label
                          key={opt.value}
                          htmlFor={`role-${opt.value}`}
                          className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <RadioGroupItem id={`role-${opt.value}`} value={opt.value} />
                          <opt.icon className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{opt.label}</div>
                            <div className="text-xs text-muted-foreground">{opt.description}</div>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Crear cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">o continúa con</span>
              </div>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
