import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  { name: "Sara M.", rating: 5, text: "¡Absolutamente increíble! Cada foto fue una obra maestra. No podría recomendarlos más.", date: "Feb 2026" },
  { name: "Emily R.", rating: 5, text: "Profesionales, creativos y muy fáciles de trabajar. Nuestras fotos de boda son impresionantes.", date: "Ene 2026" },
  { name: "Jessica L.", rating: 4, text: "Gran experiencia en general. Nos encantó la sesión de compromiso, el día de la boda fue impecable.", date: "Dic 2025" },
  { name: "Amanda K.", rating: 5, text: "Capturaron cada momento perfectamente. ¡No dejamos de ver nuestro álbum una y otra vez!", date: "Nov 2025" },
  { name: "Raquel T.", rating: 4, text: "Trabajo hermoso. La entrega fue un poco lenta pero la calidad lo compensó.", date: "Oct 2025" },
];

export default function VendorReviews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reseñas</h1>
        <p className="text-muted-foreground">Lo que dicen tus clientes</p>
      </div>
      <div className="grid gap-4">
        {reviews.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < r.rating ? "text-wedding-gold fill-wedding-gold" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
