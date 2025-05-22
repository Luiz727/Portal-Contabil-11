export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          created_at?: string
          updated_at?: string
          name?: string
          avatar_url?: string
          active?: boolean
          last_login?: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string
          name?: string
          avatar_url?: string
          active?: boolean
          last_login?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
          name?: string
          avatar_url?: string
          active?: boolean
          last_login?: string
        }
      }
      empresas: {
        Row: {
          id: number
          nome: string
          cnpj?: string
          email?: string
          telefone?: string
          endereco?: string
          cidade?: string
          estado?: string
          cep?: string
          created_at?: string
          updated_at?: string
          active?: boolean
          tenant_id?: string
        }
        Insert: {
          nome: string
          cnpj?: string
          email?: string
          telefone?: string
          endereco?: string
          cidade?: string
          estado?: string
          cep?: string
          created_at?: string
          updated_at?: string
          active?: boolean
          tenant_id?: string
        }
        Update: {
          nome?: string
          cnpj?: string
          email?: string
          telefone?: string
          endereco?: string
          cidade?: string
          estado?: string
          cep?: string
          created_at?: string
          updated_at?: string
          active?: boolean
          tenant_id?: string
        }
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
  }
}