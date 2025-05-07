
import { cn } from "@/lib/utils";
import { Loader2, type LucideProps } from "lucide-react";

export function Spinner({ className, ...props }: LucideProps) {
  return (
    <Loader2 
      className={cn("h-4 w-4 animate-spin text-muted-foreground", className)} 
      {...props} 
    />
  );
}
