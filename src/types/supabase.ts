
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
      restaurants: {
        Row: {
          id: string
          name: string
          image: string
          cuisine: string
          address: string
          location: string
          total_seats: number
          occupied_seats: number
          rating: number
          estimated_wait_time: number
          price_range: string
          description: string
          hours: string
          phone_number: string
          website?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          image: string
          cuisine: string
          address: string
          location: string
          total_seats: number
          occupied_seats: number
          rating: number
          estimated_wait_time: number
          price_range: string
          description: string
          hours: string
          phone_number: string
          website?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image?: string
          cuisine?: string
          address?: string
          location?: string
          total_seats?: number
          occupied_seats?: number
          rating?: number
          estimated_wait_time?: number
          price_range?: string
          description?: string
          hours?: string
          phone_number?: string
          website?: string
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string
          date: string
          time: string
          party_size: number
          table_type: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id: string
          date: string
          time: string
          party_size: number
          table_type: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string
          date?: string
          time?: string
          party_size?: number
          table_type?: string
          status?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          created_at?: string
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
