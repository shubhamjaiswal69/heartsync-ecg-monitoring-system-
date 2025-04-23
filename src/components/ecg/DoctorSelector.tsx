
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DoctorSelectorProps {
  selectedDoctor: string;
  onDoctorChange: (value: string) => void;
}

export function DoctorSelector({ selectedDoctor, onDoctorChange }: DoctorSelectorProps) {
  return (
    <Select value={selectedDoctor} onValueChange={onDoctorChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Share with doctor" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dr-smith">Dr. Smith</SelectItem>
        <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
      </SelectContent>
    </Select>
  );
}
