import React, { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRoleId =
  | 'ppic'
  | 'qc_receiving'
  | 'supervisor'
  | 'qa_safety'
  | 'sanitation'
  | 'director'

export interface UserRole {
  id: UserRoleId
  code: string
  title: string
  department: string
  description: string
  badgeTone: 'brand' | 'success' | 'warning' | 'info' | 'danger'
  focusRoute: string
}

export const USER_ROLES: Record<UserRoleId, UserRole> = {
  ppic: {
    id: 'ppic',
    code: 'PPIC',
    title: 'Production Planner (PPIC)',
    department: 'Perencanaan & Kontrol Produksi',
    description: 'Pengaturan jadwal produksi, matriks changeover, dan optimalisasi kapasitas line.',
    badgeTone: 'brand',
    focusRoute: '/operational-data/production-order'
  },
  qc_receiving: {
    id: 'qc_receiving',
    code: 'QC-REC',
    title: 'Milk Receiving & QC Analyst',
    department: 'Penerimaan Susu & Laboratorium',
    description: 'Pencatatan kedatangan truk tangki, pengujian suhu dingin (<= 4°C), alkohol, dan alokasi silo.',
    badgeTone: 'info',
    focusRoute: '/operational-data/delivery'
  },
  supervisor: {
    id: 'supervisor',
    code: 'OPS-SUPV',
    title: 'Plant Shift Supervisor',
    department: 'Operasional Lantai Pabrik',
    description: 'Monitoring visualisasi aliran P&ID, penanganan mesin breakdown, dan eksekusi batch.',
    badgeTone: 'warning',
    focusRoute: '/dashboard'
  },
  qa_safety: {
    id: 'qa_safety',
    code: 'QA-LEAD',
    title: 'QA & Food Safety Lead',
    department: 'Quality Assurance & Audit',
    description: 'Penelusuran batch genealogy, simulasi mock recall darurat, dan verifikasi audit trail BPOM.',
    badgeTone: 'danger',
    focusRoute: '/milk-traceability/forward'
  },
  sanitation: {
    id: 'sanitation',
    code: 'CIP-ENG',
    title: 'Sanitation & CIP Specialist',
    department: 'Engineering & Sanitasi Aseptik',
    description: 'Pemantauan siklus pembersihan CIP, pencegahan kontaminasi silang, dan sterilisasi AT/FL.',
    badgeTone: 'info',
    focusRoute: '/master-data/rules'
  },
  director: {
    id: 'director',
    code: 'DIR-EXEC',
    title: 'Plant General Manager',
    department: 'Manajemen Eksekutif Pabrik',
    description: 'Tinjauan neraca volume harian (06:00-06:00), efisiensi OEE, dan rasio yield vs loss.',
    badgeTone: 'brand',
    focusRoute: '/dashboard'
  }
}

interface UserRoleContextValue {
  activeRole: UserRole
  setRoleId: (id: UserRoleId) => void
  roles: UserRole[]
}

const STORAGE_KEY = 'orbis_user_role'

const UserRoleContext = createContext<UserRoleContextValue | null>(null)

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleIdState] = useState<UserRoleId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as UserRoleId
      if (saved && USER_ROLES[saved]) return saved
    } catch {
      // ignore
    }
    return 'ppic'
  })

  const setRoleId = (id: UserRoleId) => {
    setRoleIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // ignore
    }
  }

  const value: UserRoleContextValue = {
    activeRole: USER_ROLES[roleId],
    setRoleId,
    roles: Object.values(USER_ROLES)
  }

  return React.createElement(UserRoleContext.Provider, { value }, children)
}

export function useUserRole(): UserRoleContextValue {
  const ctx = useContext(UserRoleContext)
  if (!ctx) {
    return {
      activeRole: USER_ROLES.ppic,
      setRoleId: () => {},
      roles: Object.values(USER_ROLES)
    }
  }
  return ctx
}
