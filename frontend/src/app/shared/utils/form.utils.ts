import { Validators, ValidatorFn } from '@angular/forms';
import { Task, TaskRequest } from '../interfaces/task.interface';
import { TaskFormValue } from '../interfaces/task-form.interface';
import { User } from '../interfaces/user.interface';

/**
 * Form patch value hazırlar (edit modunda form doldurma için)
 */
export function prepareFormPatchValue(
  task: Task | null,
  isAdmin: boolean,
  isEditMode: boolean,
  hasTargetUserIdField: boolean
): Partial<TaskFormValue> {
  const patchValue: Partial<TaskFormValue> = {
    title: task?.title || '',
    description: task?.description || '',
    status: (task?.status || 'NEW') as TaskFormValue['status']
  };
  
  if (isAdmin && isEditMode && hasTargetUserIdField) {
    patchValue.targetUserId = task?.user?.id || undefined;
  }
  
  return patchValue;
}

/**
 * Form config hazırlar (reactive forms için)
 */
export function prepareFormConfig(
  task: Task | null,
  isAdmin: boolean,
  isEditMode: boolean,
  currentUser: User | null
): Record<string, [string | number | null, (ValidatorFn | ValidatorFn[] | null)?]> {
  const initialStatus = (task?.status || 'NEW') as TaskFormValue['status'];
  
  const formConfig: Record<string, [string | number | null, (ValidatorFn | ValidatorFn[] | null)?]> = {
    title: [task?.title || '', [Validators.required]],
    description: [task?.description || ''],
    status: [initialStatus, [Validators.required]]
  };
  
  if (isAdmin) {
    const defaultUserId = isEditMode 
      ? (task?.user?.id || null)
      : (currentUser?.id || null);
    formConfig['targetUserId'] = [defaultUserId, [Validators.required]];
  }
  
  return formConfig;
}

/**
 * Request body hazırlar (create/update için)
 */
export function prepareTaskRequest(
  formValue: TaskFormValue,
  isAdmin: boolean
): TaskRequest {
  const requestBody: TaskRequest = {
    title: formValue.title,
    description: formValue.description,
    status: formValue.status
  };
  
  if (isAdmin && formValue.targetUserId) {
    requestBody.targetUserId = formValue.targetUserId;
  }
  
  return requestBody;
}
