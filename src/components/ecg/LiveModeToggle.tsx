
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LiveModeToggleProps {
  isLive: boolean;
  onToggle: (checked: boolean) => void;
}

export function LiveModeToggle({ isLive, onToggle }: LiveModeToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="live-mode" 
        checked={isLive} 
        onCheckedChange={onToggle}
      />
      <Label htmlFor="live-mode">Live Mode</Label>
    </div>
  );
}
