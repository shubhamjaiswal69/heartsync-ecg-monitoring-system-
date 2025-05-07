
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type Patient = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

type InvitationRowProps = {
  id: string;
  patient: Patient | null;
  createdAt: string;
  onAccept: (id: string, patientName: string) => void;
  onReject: (id: string, patientName: string) => void;
};

export function getPatientName(patient: Patient | null) {
  if (!patient) return "Unknown Patient";
  
  if (patient.first_name && patient.last_name) {
    return `${patient.first_name} ${patient.last_name}`;
  } else if (patient.first_name) {
    return patient.first_name;
  } else {
    return patient.email;
  }
}

export function InvitationRow({ id, patient, createdAt, onAccept, onReject }: InvitationRowProps) {
  const patientName = getPatientName(patient);
  
  return (
    <TableRow>
      <TableCell className="font-medium">
        {patientName}
      </TableCell>
      <TableCell>
        {new Date(createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onAccept(id, patientName)}
        >
          <Check size={16} className="text-green-500" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onReject(id, patientName)}
        >
          <X size={16} className="text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
