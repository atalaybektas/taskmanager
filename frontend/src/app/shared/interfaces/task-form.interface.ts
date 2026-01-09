
export interface TaskFormValue {
  title: string;
  description?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
  targetUserId?: number;
}

