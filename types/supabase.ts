/**
 * Tipos para o Supabase
 * Gerados com base no esquema do banco de dados
 */

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
      clientes: {
        Row: {
          id: string
          nome: string
          cpf_cnpj: string
          tipo: string
          endereco: string | null
          telefone: string | null
          email: string | null
          empresa_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome: string
          cpf_cnpj: string
          tipo?: string
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          empresa_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cpf_cnpj?: string
          tipo?: string
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          empresa_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          }
        ]
      }
      empresas: {
        Row: {
          id: string
          nome: string
          cnpj: string
          inscricao_estadual: string | null
          endereco: string | null
          telefone: string | null
          email: string | null
          logo_url: string | null
          website: string | null
          escritorio_id: string
          regime_tributario: string
          plano: Database["public"]["Enums"]["plano_empresa"]
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome: string
          cnpj: string
          inscricao_estadual?: string | null
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          logo_url?: string | null
          website?: string | null
          escritorio_id: string
          regime_tributario?: string
          plano?: Database["public"]["Enums"]["plano_empresa"]
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string
          inscricao_estadual?: string | null
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          logo_url?: string | null
          website?: string | null
          escritorio_id?: string
          regime_tributario?: string
          plano?: Database["public"]["Enums"]["plano_empresa"]
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_escritorio_id_fkey"
            columns: ["escritorio_id"]
            referencedRelation: "escritorios"
            referencedColumns: ["id"]
          }
        ]
      }
      escritorios: {
        Row: {
          id: string
          nome: string
          cnpj: string
          endereco: string | null
          telefone: string | null
          email: string | null
          logo_url: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome: string
          cnpj: string
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          logo_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          logo_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          empresa_id: string | null
          escritorio_id: string | null
          is_super_admin: boolean
          custom_permissions: string | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          empresa_id?: string | null
          escritorio_id?: string | null
          is_super_admin?: boolean
          custom_permissions?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          empresa_id?: string | null
          escritorio_id?: string | null
          is_super_admin?: boolean
          custom_permissions?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_escritorio_id_fkey"
            columns: ["escritorio_id"]
            referencedRelation: "escritorios"
            referencedColumns: ["id"]
          }
        ]
      }
      usuarios_empresas: {
        Row: {
          usuario_id: string
          empresa_id: string
          permissao_admin: boolean
        }
        Insert: {
          usuario_id: string
          empresa_id: string
          permissao_admin?: boolean
        }
        Update: {
          usuario_id?: string
          empresa_id?: string
          permissao_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_empresas_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_if_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      has_empresa_access: {
        Args: {
          empresa_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      plano_empresa: "mei" | "pme" | "corporativo"
      user_role: "admin" | "escritorio" | "empresa" | "cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}