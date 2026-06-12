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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      budget_categories: {
        Row: {
          allocated: number
          created_at: string
          id: string
          name: string
          scope: string
          spent: number
          wedding_id: string
        }
        Insert: {
          allocated?: number
          created_at?: string
          id?: string
          name: string
          scope: string
          spent?: number
          wedding_id: string
        }
        Update: {
          allocated?: number
          created_at?: string
          id?: string
          name?: string
          scope?: string
          spent?: number
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_answers: {
        Row: {
          created_at: string
          id: string
          interview_id: string
          question_id: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          interview_id: string
          question_id: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          interview_id?: string
          question_id?: string
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_answers_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_questions: {
        Row: {
          category: string
          created_at: string
          id: string
          options: Json | null
          planner_id: string
          required: boolean | null
          sort_order: number | null
          text: string
          type: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          options?: Json | null
          planner_id: string
          required?: boolean | null
          sort_order?: number | null
          text: string
          type: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          options?: Json | null
          planner_id?: string
          required?: boolean | null
          sort_order?: number | null
          text?: string
          type?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          client_name: string
          created_at: string
          id: string
          interview_date: string
          notes: string | null
          planner_id: string
          status: string
          updated_at: string
          wedding_id: string | null
        }
        Insert: {
          client_name: string
          created_at?: string
          id?: string
          interview_date?: string
          notes?: string | null
          planner_id: string
          status?: string
          updated_at?: string
          wedding_id?: string | null
        }
        Update: {
          client_name?: string
          created_at?: string
          id?: string
          interview_date?: string
          notes?: string | null
          planner_id?: string
          status?: string
          updated_at?: string
          wedding_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      payment_approval_requests: {
        Row: {
          amount: number
          currency: string
          id: string
          payment_method_brand: string | null
          payment_method_last4: string | null
          planner_id: string
          requested_at: string
          resolved_at: string | null
          service_name: string
          status: string
          vendor_name: string | null
          wedding_id: string
        }
        Insert: {
          amount: number
          currency?: string
          id?: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          planner_id: string
          requested_at?: string
          resolved_at?: string | null
          service_name: string
          status?: string
          vendor_name?: string | null
          wedding_id: string
        }
        Update: {
          amount?: number
          currency?: string
          id?: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          planner_id?: string
          requested_at?: string
          resolved_at?: string | null
          service_name?: string
          status?: string
          vendor_name?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_approval_requests_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string
          created_at: string
          exp_month: string
          exp_year: string
          holder_name: string
          id: string
          is_default: boolean | null
          last4: string
          user_id: string
        }
        Insert: {
          brand: string
          created_at?: string
          exp_month: string
          exp_year: string
          holder_name: string
          id?: string
          is_default?: boolean | null
          last4: string
          user_id: string
        }
        Update: {
          brand?: string
          created_at?: string
          exp_month?: string
          exp_year?: string
          holder_name?: string
          id?: string
          is_default?: boolean | null
          last4?: string
          user_id?: string
        }
        Relationships: []
      }
      planner_vendors: {
        Row: {
          bookings: number | null
          category: string
          created_at: string
          id: string
          name: string
          planner_id: string
          rating: number | null
          status: string
        }
        Insert: {
          bookings?: number | null
          category: string
          created_at?: string
          id?: string
          name: string
          planner_id: string
          rating?: number | null
          status?: string
        }
        Update: {
          bookings?: number | null
          category?: string
          created_at?: string
          id?: string
          name?: string
          planner_id?: string
          rating?: number | null
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_id: string
          author_name: string
          author_role: string
          created_at: string
          id: string
          rating: number
          text: string | null
          vendor_id: string
        }
        Insert: {
          author_id: string
          author_name: string
          author_role: string
          created_at?: string
          id?: string
          rating: number
          text?: string | null
          vendor_id: string
        }
        Update: {
          author_id?: string
          author_name?: string
          author_role?: string
          created_at?: string
          id?: string
          rating?: number
          text?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          done: boolean | null
          due_date: string | null
          id: string
          text: string
          urgent: boolean | null
          wedding_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean | null
          due_date?: string | null
          id?: string
          text: string
          urgent?: boolean | null
          wedding_id: string
        }
        Update: {
          created_at?: string
          done?: boolean | null
          due_date?: string | null
          id?: string
          text?: string
          urgent?: boolean | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          payment_method_last4: string | null
          service_name: string
          status: string
          user_id: string
          vendor_name: string | null
          wedding_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_method_last4?: string | null
          service_name: string
          status?: string
          user_id: string
          vendor_name?: string | null
          wedding_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_method_last4?: string | null
          service_name?: string
          status?: string
          user_id?: string
          vendor_name?: string | null
          wedding_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
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
      vendor_bookings: {
        Row: {
          amount: string | null
          booking_date: string | null
          client_name: string
          created_at: string
          id: string
          status: string
          vendor_id: string
          venue: string | null
        }
        Insert: {
          amount?: string | null
          booking_date?: string | null
          client_name: string
          created_at?: string
          id?: string
          status?: string
          vendor_id: string
          venue?: string | null
        }
        Update: {
          amount?: string | null
          booking_date?: string | null
          client_name?: string
          created_at?: string
          id?: string
          status?: string
          vendor_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      vendor_services: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: string | null
          vendor_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: string | null
          vendor_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: string | null
          vendor_id?: string
        }
        Relationships: []
      }
      wedding_members: {
        Row: {
          id: string
          joined_at: string
          member_role: string
          user_id: string
          wedding_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          member_role: string
          user_id: string
          wedding_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          member_role?: string
          user_id?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_members_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      weddings: {
        Row: {
          budget_total: number | null
          couple: string
          created_at: string
          guests: number | null
          id: string
          invite_code: string
          planner_id: string
          progress: number | null
          status: string
          updated_at: string
          venue: string | null
          wedding_date: string | null
        }
        Insert: {
          budget_total?: number | null
          couple: string
          created_at?: string
          guests?: number | null
          id?: string
          invite_code?: string
          planner_id: string
          progress?: number | null
          status?: string
          updated_at?: string
          venue?: string | null
          wedding_date?: string | null
        }
        Update: {
          budget_total?: number | null
          couple?: string
          created_at?: string
          guests?: number | null
          id?: string
          invite_code?: string
          planner_id?: string
          progress?: number | null
          status?: string
          updated_at?: string
          venue?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invite_code: { Args: never; Returns: string }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_wedding_member: {
        Args: { _user: string; _wedding: string }
        Returns: boolean
      }
      is_wedding_owner: {
        Args: { _user: string; _wedding: string }
        Returns: boolean
      }
      join_wedding_by_code: {
        Args: { _code: string; _role: string }
        Returns: string
      }
      owns_interview: {
        Args: { _interview: string; _user: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "planner" | "client" | "vendor"
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
      app_role: ["planner", "client", "vendor"],
    },
  },
} as const
