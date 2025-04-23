
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface NotesSectionProps {
  notes: string;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
}

export function NotesSection({ notes, onNotesChange, onSaveNotes }: NotesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes & Observations</CardTitle>
        <CardDescription>
          Add your medical notes for this patient's ECG
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Enter your medical observations and notes here..."
          className="min-h-[150px]"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={onSaveNotes}>
          <Save className="mr-2 h-4 w-4" />
          Save Notes
        </Button>
      </CardFooter>
    </Card>
  );
}
