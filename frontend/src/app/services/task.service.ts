import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Validators, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TASK_STATUS_OPTIONS } from '../shared/constants/task.constants';
import { TaskFormValue } from '../shared/interfaces/task-form.interface';
import { Task, TaskRequest, Page, TaskWithStatus } from '../shared/interfaces/task.interface';
import { User } from '../shared/interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // görevleri pagination ile getirir
  getTasks(
    status?: string,
    page: number = 0,
    sort?: string
  ): Observable<Page<Task>> {
    let params = new HttpParams()
      .set('page', page.toString());
    
    if (status) {
      params = params.set('status', status);
    }
    
    if (sort) {
      params = params.set('sort', sort);
    }
    
    return this.http.get<Page<Task>>(this.apiUrl, { params });
  }

  createTask(task: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(taskId: number, task: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  // görev silme işlemi id kontrolü ile
  deleteTaskWithValidation(task: Task): { 
    observable: Observable<void> | null; 
    errorMessage: string | null;
  } {
    if (!task.id) {
      return {
        observable: null,
        errorMessage: 'Görev ID bulunamadı!'
      };
    }
    return {
      observable: this.deleteTask(task.id),
      errorMessage: null
    };
  }

  getStatusLabel(status: string): string {
    const option = TASK_STATUS_OPTIONS.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  // status'a göre css severity döndürür renkler icin
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'IN_PROGRESS':
        return 'warn';
      case 'DONE':
        return 'success';
      default:
        return '';
    }
  }

  // form patch value hazırlar edit modunda form doldurma için
  prepareFormPatchValue(
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

  // form config hazırlar reactive forms icin
  prepareFormConfig(
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

  // request body hazırlar create/update için
  prepareTaskRequest(
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

  // create veya update kararını verir
  saveTask(
    taskId: number | undefined,
    requestBody: TaskRequest,
    isEditMode: boolean
  ): Observable<Task> {
    if (isEditMode && taskId) {
      return this.updateTask(taskId, requestBody);
    }
    return this.createTask(requestBody);
  }

  // tasklara status label ve severity ekler
  enrichTasksWithStatus(tasks: Task[]): TaskWithStatus[] {
    return tasks.map(task => ({
      ...task,
      statusLabel: this.getStatusLabel(task.status),
      statusSeverity: this.getStatusSeverity(task.status),
      ownerName: task.user?.username || '-',
      description: task.description || '-'
    }));
  }

  // yeni task objesi oluşturur defaultlarla
  createNewTask(): Task {
    return {
      title: '',
      description: '',
      status: 'NEW'
    };
  }

  // edit/create moduna göre form labellarını döndürür
  getFormLabels(isEditMode: boolean): {
    dialogTitle: string;
    saveButtonLabel: string;
    successMessage: string;
    errorMessage: string;
  } {
    return {
      dialogTitle: isEditMode ? 'Görev Düzenle' : 'Yeni Görev',
      saveButtonLabel: isEditMode ? 'Güncelle' : 'Oluştur',
      successMessage: isEditMode ? 'Görev güncellendi!' : 'Görev oluşturuldu!',
      errorMessage: isEditMode 
        ? 'Görev güncellenirken bir hata oluştu!'
        : 'Görev oluşturulurken bir hata oluştu!'
    };
  }

  // kullanıcı rolüne göre css class döndürür
  getUserRoleClass(user: User): string {
    return user.role ? `role-${user.role.toLowerCase()}` : '';
  }
}


