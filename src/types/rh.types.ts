export interface AdminUser {
  id: number
  uuid: string
  first_name: string
  last_name: string
  full_name?: string
  email: string
  phone?: string
  rib_number?: string
  rib?: string
  rib_url?: string
  photo?: string
  photo_url?: string
  ifu_number?: string
  ifu?: string
  ifu_url?: string
  bank?: string
  email_verified_at?: string
  roles?: Role[]
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  name: string
  description?: string
}

export interface CreateAdminUserRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
  rib_number?: string
  rib?: File
  photo?: File
  ifu_number?: string
  ifu?: File
  bank?: string
}

export interface UpdateAdminUserRequest {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  phone?: string
  rib_number?: string
  rib?: File
  photo?: File
  ifu_number?: string
  ifu?: File
  bank?: string
}

export interface RhStats {
  total_professors: number
  total_admin_users: number
  active_professors: number
}
