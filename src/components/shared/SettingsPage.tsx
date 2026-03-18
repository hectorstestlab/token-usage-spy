import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      <Card>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <SettingsIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Settings Coming Soon</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Account preferences, notifications, and profile management will be available once the backend is connected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
