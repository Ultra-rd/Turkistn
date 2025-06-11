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
      attractions: {
        Row: {
          category_id: number
          created_at: string
          description: string
          id: string
          image: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id: number
          created_at?: string
          description: string
          id?: string
          image: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string
          id?: string
          image?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          phone: string
          tour_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          phone: string
          tour_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string
          tour_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          audio_file: string | null
          description: string
          detailed_info: string | null
          district: string | null
          google_maps_url: string
          id: number
          image: string
          name: string
        }
        Insert: {
          audio_file?: string | null
          description: string
          detailed_info?: string | null
          district?: string | null
          google_maps_url: string
          id?: number
          image: string
          name: string
        }
        Update: {
          audio_file?: string | null
          description?: string
          detailed_info?: string | null
          district?: string | null
          google_maps_url?: string
          id?: number
          image?: string
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string
          id: number
          location: string
          name: string
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: number
          location: string
          name: string
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: number
          location?: string
          name?: string
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      tour_agent_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          photo_url: string
          tour_agent_id: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url: string
          tour_agent_id?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url?: string
          tour_agent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_agent_photos_tour_agent_id_fkey"
            columns: ["tour_agent_id"]
            isOneToOne: false
            referencedRelation: "tour_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_agent_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
          tour_agent_id: number | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
          tour_agent_id?: number | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
          tour_agent_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_agent_posts_tour_agent_id_fkey"
            columns: ["tour_agent_id"]
            isOneToOne: false
            referencedRelation: "tour_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_agents: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: number
          logo: string
          name: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          logo: string
          name: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          logo?: string
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      tours: {
        Row: {
          description: string
          duration: string
          featured: boolean | null
          group_size: string
          id: number
          image: string
          price: string
          start_dates: string
          title: string
          tour_agent_id: number | null
        }
        Insert: {
          description: string
          duration: string
          featured?: boolean | null
          group_size: string
          id?: number
          image: string
          price: string
          start_dates: string
          title: string
          tour_agent_id?: number | null
        }
        Update: {
          description?: string
          duration?: string
          featured?: boolean | null
          group_size?: string
          id?: number
          image?: string
          price?: string
          start_dates?: string
          title?: string
          tour_agent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_tour_agent_id_fkey"
            columns: ["tour_agent_id"]
            isOneToOne: false
            referencedRelation: "tour_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tour_agents: {
        Row: {
          created_at: string
          id: string
          tour_agent_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          tour_agent_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          tour_agent_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tour_agents_tour_agent_id_fkey"
            columns: ["tour_agent_id"]
            isOneToOne: false
            referencedRelation: "tour_agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "user" | "admin" | "tour_agent"
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
      user_role: ["user", "admin", "tour_agent"],
    },
  },
} as const
