import { Routes } from '@angular/router';
import { AiQueryListComponent } from './feature/ai-query-list.component/ai-query-list.component';

export const routes: Routes = [
  { path: '', component: AiQueryListComponent },
  { path: '**', redirectTo: '' }
];