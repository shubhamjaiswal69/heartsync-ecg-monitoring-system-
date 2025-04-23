
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatternSelectorProps {
  patternType: string;
  onPatternChange: (value: string) => void;
}

// ECG pattern types with labels
const ecgPatterns = [
  { id: "normal", name: "Normal Sinus Rhythm" },
  { id: "arrhythmia", name: "Arrhythmia" },
  { id: "tachycardia", name: "Tachycardia" }
];

export function PatternSelector({ patternType, onPatternChange }: PatternSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>View Pattern</Label>
      <Select value={patternType} onValueChange={onPatternChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Pattern" />
        </SelectTrigger>
        <SelectContent>
          {ecgPatterns.map(pattern => (
            <SelectItem key={pattern.id} value={pattern.id}>
              {pattern.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        For demonstration purposes only. Select different patterns to view sample ECG data.
      </p>
    </div>
  );
}
