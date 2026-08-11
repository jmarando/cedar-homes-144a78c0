export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      lead_activities: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["activity_channel"]
          contact_handle: string | null
          created_at: string
          created_by: string | null
          direction: Database["public"]["Enums"]["activity_direction"]
          external_id: string | null
          id: string
          lead_id: string | null
          occurred_at: string
          status: string | null
          subject: string | null
        }
        Insert: {
          body?: string | null
          channel?: Database["public"]["Enums"]["activity_channel"]
          contact_handle?: string | null
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["activity_direction"]
          external_id?: string | null
          id?: string
          lead_id?: string | null
          occurred_at?: string
          status?: string | null
          subject?: string | null
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["activity_channel"]
          contact_handle?: string | null
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["activity_direction"]
          external_id?: string | null
          id?: string
          lead_id?: string | null
          occurred_at?: string
          status?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          budget: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          interest: string
          internal_notes: string | null
          landing_page: string | null
          last_contacted_at: string | null
          last_name: string | null
          lead_score: number
          message: string | null
          persona: string | null
          phone: string
          preferred_contact: string
          referrer: string | null
          source: string
          stage: Database["public"]["Enums"]["lead_stage"]
          timeline: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          budget?: string | null
          country?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          interest: string
          internal_notes?: string | null
          landing_page?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          lead_score?: number
          message?: string | null
          persona?: string | null
          phone: string
          preferred_contact?: string
          referrer?: string | null
          source?: string
          stage?: Database["public"]["Enums"]["lead_stage"]
          timeline?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          budget?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          interest?: string
          internal_notes?: string | null
          landing_page?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          lead_score?: number
          message?: string | null
          persona?: string | null
          phone?: string
          preferred_contact?: string
          referrer?: string | null
          source?: string
          stage?: Database["public"]["Enums"]["lead_stage"]
          timeline?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      nurture_tasks: {
        Row: {
          attempts: number
          channel: string
          created_at: string
          id: string
          last_error: string | null
          lead_id: string
          scheduled_for: string
          sent_at: string | null
          status: string
          template_id: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          channel: string
          created_at?: string
          id?: string
          last_error?: string | null
          lead_id: string
          scheduled_for: string
          sent_at?: string | null
          status?: string
          template_id: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          channel?: string
          created_at?: string
          id?: string
          last_error?: string | null
          lead_id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nurture_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nurture_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "nurture_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      nurture_templates: {
        Row: {
          body: string
          channel: string
          created_at: string
          day_offset: number
          id: string
          is_active: boolean
          sort_order: number
          step_key: string
          subject: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          channel: string
          created_at?: string
          day_offset: number
          id?: string
          is_active?: boolean
          sort_order?: number
          step_key: string
          subject?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          day_offset?: number
          id?: string
          is_active?: boolean
          sort_order?: number
          step_key?: string
          subject?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_channel:
        | "whatsapp"
        | "email"
        | "call"
        | "sms"
        | "note"
        | "system"
        | "form"
      activity_direction: "inbound" | "outbound" | "internal"
      app_role: "admin" | "sales" | "user"
      lead_stage:
        | "new"
        | "contacted"
        | "qualified"
        | "visit_booked"
        | "visited"
        | "negotiating"
        | "deposit_paid"
        | "lost"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_channel: [
        "whatsapp",
        "email",
        "call",
        "sms",
        "note",
        "system",
        "form",
      ],
      activity_direction: ["inbound", "outbound", "internal"],
      app_role: ["admin", "sales", "user"],
      lead_stage: [
        "new",
        "contacted",
        "qualified",
        "visit_booked",
        "visited",
        "negotiating",
        "deposit_paid",
        "lost",
      ],
    },
  },
} as const
