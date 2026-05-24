import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AIQuery, ChatGptRequest, SummarizerRequest } from '../interfaces/ai-query.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiQueryService {
  private baseUrl = `${environment.apiUrl}/v1/api/ai`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<AIQuery[]> {
    return this.http.get<AIQuery[]>(this.baseUrl);
  }

  findActive(): Observable<AIQuery[]> {
    return this.http.get<AIQuery[]>(`${this.baseUrl}/active`);
  }

  findInactive(): Observable<AIQuery[]> {
    return this.http.get<AIQuery[]>(`${this.baseUrl}/inactive`);
  }

  findById(id: string): Observable<AIQuery> {
    return this.http.get<AIQuery>(`${this.baseUrl}/${id}`);
  }

  findByApi(apiName: string): Observable<AIQuery[]> {
    return this.http.get<AIQuery[]>(`${this.baseUrl}/api/${apiName}`);
  }

  askChatGpt(request: ChatGptRequest): Observable<AIQuery> {
    return this.http.post<AIQuery>(`${this.baseUrl}/chatgpt`, request);
  }

  summarizeUrl(request: SummarizerRequest): Observable<AIQuery> {
    return this.http.post<AIQuery>(`${this.baseUrl}/summarizer`, request);
  }

  update(id: string, data: Partial<AIQuery>): Observable<AIQuery> {
    return this.http.put<AIQuery>(`${this.baseUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<AIQuery> {
    return this.http.patch<AIQuery>(`${this.baseUrl}/delete/${id}`, {});
  }

  restore(id: string): Observable<AIQuery> {
    return this.http.patch<AIQuery>(`${this.baseUrl}/restore/${id}`, {});
  }
}
