import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskRequest, Page } from '../shared/interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(status?: string, page: number = 0, sort?: string): Observable<Page<Task>> {
    let params = new HttpParams().set('page', page.toString());
    
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
}


