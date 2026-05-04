import { Injectable } from '@angular/core';
import { AiQueryService } from '../services/ai-query.service';
import { AIQuery, ChatGptRequest, SummarizerRequest } from '../interfaces/ai-query.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiQueryFacadeService {

  constructor(private coreService: AiQueryService) {}

  getAll(): Observable<AIQuery[]> {
    return this.coreService.findAll();
  }

  getActive(): Observable<AIQuery[]> {
    return this.coreService.findActive();
  }

  getInactive(): Observable<AIQuery[]> {
    return this.coreService.findInactive();
  }

  getById(id: string): Observable<AIQuery> {
    return this.coreService.findById(id);
  }

  createChatGpt(request: ChatGptRequest): Observable<AIQuery> {
    return this.coreService.askChatGpt(request);
  }

  createSummarizer(request: SummarizerRequest): Observable<AIQuery> {
    return this.coreService.summarizeUrl(request);
  }

  update(id: string, data: Partial<AIQuery>): Observable<AIQuery> {
    return this.coreService.update(id, data);
  }

  softDelete(id: string): Observable<AIQuery> {
    return this.coreService.delete(id);
  }

  restore(id: string): Observable<AIQuery> {
    return this.coreService.restore(id);
  }
}
