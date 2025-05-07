export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      doctor_patient_relationships: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          invitation_date: string | null
          patient_id: string
          referral_code: string | null
          status: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          invitation_date?: string | null
          patient_id: string
          referral_code?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          invitation_date?: string | null
          patient_id?: string
          referral_code?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_patient_relationships_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_patient_relationships_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ecg_live_sessions: {
        Row: {
          created_at: string
          current_heart_rate: number | null
          device_id: string | null
          ended_at: string | null
          id: string
          patient_id: string
          session_notes: string | null
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_heart_rate?: number | null
          device_id?: string | null
          ended_at?: string | null
          id?: string
          patient_id: string
          session_notes?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_heart_rate?: number | null
          device_id?: string | null
          ended_at?: string | null
          id?: string
          patient_id?: string
          session_notes?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ecg_recordings: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          ecg_data: Json
          flags: Json | null
          heart_rate: number | null
          id: string
          patient_id: string
          recorded_at: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          ecg_data: Json
          flags?: Json | null
          heart_rate?: number | null
          id?: string
          patient_id: string
          recorded_at?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          ecg_data?: Json
          flags?: Json | null
          heart_rate?: number | null
          id?: string
          patient_id?: string
          recorded_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ecg_recordings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          patient_id: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          patient_id: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          patient_id?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          age: number | null
          allergies: string | null
          blood_type: string | null
          created_at: string
          current_medications: string | null
          emergency_contact: string | null
          full_name: string | null
          gender: string | null
          height: number | null
          id: string
          medical_history: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          allergies?: string | null
          blood_type?: string | null
          created_at?: string
          current_medications?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id: string
          medical_history?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          allergies?: string | null
          blood_type?: string | null
          created_at?: string
          current_medications?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          medical_history?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          referral_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: string | null
          created_at: string
          doctor_id: string | null
          ecg_recording_id: string | null
          id: string
          patient_id: string
          pdf_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          doctor_id?: string | null
          ecg_recording_id?: string | null
          id?: string
          patient_id: string
          pdf_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          doctor_id?: string | null
          ecg_recording_id?: string | null
          id?: string
          patient_id?: string
          pdf_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_ecg_recording_id_fkey"
            columns: ["ecg_recording_id"]
            isOneToOne: false
            referencedRelation: "ecg_recordings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_doctor_by_referral_code: {
        Args: { code: string }
        Returns: string
      }
      is_connected_to_doctor: {
        Args: { doctor_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "patient" | "doctor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["patient", "doctor"],
    },
  },
} as const
