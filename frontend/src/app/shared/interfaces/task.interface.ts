/**
 * Task model interface
 */
export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
  createdDate?: string;
  user?: {
    id: number;
    username: string;
  };
}

/**
 * Task request interface for create/update operations
 */
export interface TaskRequest {
  title: string;
  description?: string;
  status?: 'NEW' | 'IN_PROGRESS' | 'DONE';
  targetUserId?: number; // For ADMIN: can create/update tasks for other users
}

/**
 * Spring Boot Page response structure
 * Backend returns Page<TaskResponse>, Angular uses page.content
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * Task with enriched status information
 */
export interface TaskWithStatus extends Task {
  statusLabel: string;
  statusSeverity: string;
  ownerName: string;
  description: string;
}
