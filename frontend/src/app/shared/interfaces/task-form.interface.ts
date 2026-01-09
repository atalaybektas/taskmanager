/**
 * Task form value interface
 * Status tipi Task interface'i ile uyumlu olmalı
 */
export interface TaskFormValue {
  title: string;
  description?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
  targetUserId?: number;
}

