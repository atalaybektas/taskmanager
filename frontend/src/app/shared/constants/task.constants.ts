
export const TASK_STATUS = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];


export const TASK_STATUS_OPTIONS = [
  { label: 'Tümü', value: null },
  { label: 'Yeni', value: TASK_STATUS.NEW },
  { label: 'Devam Ediyor', value: TASK_STATUS.IN_PROGRESS },
  { label: 'Tamamlandı', value: TASK_STATUS.DONE }
];

export const TASK_STATUS_OPTIONS_FOR_DROPDOWN = [
  { label: 'Yeni', value: TASK_STATUS.NEW },
  { label: 'Devam Ediyor', value: TASK_STATUS.IN_PROGRESS },
  { label: 'Tamamlandı', value: TASK_STATUS.DONE }
];

