export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      menu: {
        Row: {
          manager_id: string
          menu_id: number
          menu_name: string
        }
        Insert: {
          manager_id: string
          menu_id?: number
          menu_name: string
        }
        Update: {
          manager_id?: string
          menu_id?: number
          menu_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_manager_id"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      order_product: {
        Row: {
          order_id: number
          order_product_id: number
          product_id: number
          qty: number
        }
        Insert: {
          order_id: number
          order_product_id?: number
          product_id: number
          qty: number
        }
        Update: {
          order_id?: number
          order_product_id?: number
          product_id?: number
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_id"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "fk_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      orders: {
        Row: {
          customer_phone_number: string
          order_id: number
          status_id: number
          subtotal: number
          tax_rate: number
          time_being_cooked: string | null
          time_picked_up: string | null
          time_ready: string | null
          time_received: string
          truck_id: number
        }
        Insert: {
          customer_phone_number: string
          order_id?: number
          status_id: number
          subtotal: number
          tax_rate: number
          time_being_cooked?: string | null
          time_picked_up?: string | null
          time_ready?: string | null
          time_received?: string
          truck_id: number
        }
        Update: {
          customer_phone_number?: string
          order_id?: number
          status_id?: number
          subtotal?: number
          tax_rate?: number
          time_being_cooked?: string | null
          time_picked_up?: string | null
          time_ready?: string | null
          time_received?: string
          truck_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_status_id"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "status"
            referencedColumns: ["status_id"]
          },
          {
            foreignKeyName: "fk_truck_id"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck"
            referencedColumns: ["truck_id"]
          },
        ]
      }
      product: {
        Row: {
          description: string
          image_path: string
          is_available: boolean
          menu_id: number
          price: number
          product_id: number
          product_name: string
        }
        Insert: {
          description: string
          image_path: string
          is_available: boolean
          menu_id: number
          price: number
          product_id?: number
          product_name: string
        }
        Update: {
          description?: string
          image_path?: string
          is_available?: boolean
          menu_id?: number
          price?: number
          product_id?: number
          product_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_menu_id"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["menu_id"]
          },
        ]
      }
      status: {
        Row: {
          status_id: number
          status_name: string
        }
        Insert: {
          status_id?: number
          status_name: string
        }
        Update: {
          status_id?: number
          status_name?: string
        }
        Relationships: []
      }
      truck: {
        Row: {
          image_path: string | null
          manager_id: string
          menu_id: number | null
          qr_code_path: string
          truck_id: number
          truck_name: string
        }
        Insert: {
          image_path?: string | null
          manager_id: string
          menu_id?: number | null
          qr_code_path: string
          truck_id?: number
          truck_name: string
        }
        Update: {
          image_path?: string | null
          manager_id?: string
          menu_id?: number | null
          qr_code_path?: string
          truck_id?: number
          truck_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_manager_id"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_menu_id"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["menu_id"]
          },
        ]
      }
      truck_assignment: {
        Row: {
          assignment_id: number
          date_assigned: string
          employee_id: string
          truck_id: number
        }
        Insert: {
          assignment_id?: number
          date_assigned?: string
          employee_id: string
          truck_id: number
        }
        Update: {
          assignment_id?: number
          date_assigned?: string
          employee_id?: string
          truck_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_employee_id"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_truck_id"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck"
            referencedColumns: ["truck_id"]
          },
        ]
      }
      user: {
        Row: {
          email: string
          first_name: string
          is_manager: boolean
          last_name: string
          user_id: string
        }
        Insert: {
          email: string
          first_name: string
          is_manager: boolean
          last_name: string
          user_id: string
        }
        Update: {
          email?: string
          first_name?: string
          is_manager?: boolean
          last_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
