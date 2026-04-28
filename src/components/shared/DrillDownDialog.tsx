import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DrillDownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  primaryHref?: string;
  primaryLabel?: string;
}

export default function DrillDownDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  primaryHref,
  primaryLabel,
}: DrillDownDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-2">{children}</div>
        {primaryHref && (
          <DialogFooter>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link to={primaryHref}>{primaryLabel ?? "Ver todo"}</Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
