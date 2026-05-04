import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AIQuery, ChatGptRequest, SummarizerRequest } from '../../core/interfaces/ai-query.interface';
import { AiQueryFacadeService } from '../../core/services/ai-query-facade.service';
import { ModalComponent } from '../../shared/modal.component/modal.component';
import { CellPreviewModalComponent, CellPreview } from '../../shared/cell-preview-modal.component/cell-preview-modal.component';

type FilterType = 'all' | 'active' | 'inactive';
type CreateMode = 'chatgpt' | 'summarizer';

@Component({
  selector: 'app-ai-query-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    CellPreviewModalComponent,
  ],
  templateUrl: './ai-query-list.component.html',
  styleUrl: './ai-query-list.component.scss',
})
export class AiQueryListComponent implements OnInit {

  queries: AIQuery[] = [];
  isLoading = false;
  filterType: FilterType = 'all';

  showCreateModal = false;
  showEditModal = false;
  showDetailModal = false;
  createMode: CreateMode = 'chatgpt';

  selectedQuery: AIQuery | null = null;

  // Cell preview
  cellPreview: CellPreview | null = null;

  chatGptForm!: FormGroup;
  summarizerForm!: FormGroup;
  editForm!: FormGroup;

  toast: { message: string; type: 'success' | 'error' } | null = null;

  constructor(
    private facade: AiQueryFacadeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadAll();
  }

  private buildForms(): void {
    this.chatGptForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.summarizerForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      lang: ['es'],
      engine: [2]
    });

    this.editForm = this.fb.group({
      prompt: [''],
      url: [''],
      lang: ['es'],
      engine: [2]
    });
  }

  loadAll(): void {
    this.isLoading = true;
    const obs = this.filterType === 'all'
      ? this.facade.getAll()
      : this.filterType === 'active'
        ? this.facade.getActive()
        : this.facade.getInactive();

    obs.subscribe({
      next: (data: AIQuery[]) => { this.queries = data; this.isLoading = false; },
      error: () => { this.showToast('Error al cargar los datos', 'error'); this.isLoading = false; }
    });
  }

  setFilter(filter: FilterType): void {
    this.filterType = filter;
    this.loadAll();
  }

  // ── Cell preview ────────────────────────────────────────────────────────────
  openCellPreview(label: string, value: string, type: CellPreview['type'] = 'text'): void {
    if (!value || value === '-') return;
    this.cellPreview = { label, value, type };
  }

  closeCellPreview(): void {
    this.cellPreview = null;
  }

  // ── Create ──────────────────────────────────────────────────────────────────
  openCreate(mode: CreateMode): void {
    this.createMode = mode;
    this.chatGptForm.reset();
    this.summarizerForm.reset({ lang: 'es', engine: 2 });
    this.showCreateModal = true;
  }

  submitCreate(): void {
    if (this.createMode === 'chatgpt') {
      if (this.chatGptForm.invalid) return;
      this.isLoading = true;
      const req: ChatGptRequest = this.chatGptForm.value;
      this.facade.createChatGpt(req).subscribe({
        next: () => { this.showCreateModal = false; this.loadAll(); this.showToast('Consulta ChatGPT creada', 'success'); },
        error: () => { this.showToast('Error al crear consulta', 'error'); this.isLoading = false; }
      });
    } else {
      if (this.summarizerForm.invalid) return;
      this.isLoading = true;
      const req: SummarizerRequest = this.summarizerForm.value;
      this.facade.createSummarizer(req).subscribe({
        next: () => { this.showCreateModal = false; this.loadAll(); this.showToast('Resumen creado exitosamente', 'success'); },
        error: () => { this.showToast('Error al crear resumen', 'error'); this.isLoading = false; }
      });
    }
  }

  // ── Edit ────────────────────────────────────────────────────────────────────
  openEdit(query: AIQuery): void {
    this.selectedQuery = query;
    this.editForm.patchValue({
      prompt: query.prompt,
      url: query.url || '',
      lang: query.lang || 'es',
      engine: query.engine || 2
    });
    this.showEditModal = true;
  }

  submitEdit(): void {
    if (!this.selectedQuery) return;
    this.isLoading = true;
    this.facade.update(this.selectedQuery.id, this.editForm.value).subscribe({
      next: () => { this.showEditModal = false; this.loadAll(); this.showToast('Consulta actualizada', 'success'); },
      error: () => { this.showToast('Error al actualizar', 'error'); this.isLoading = false; }
    });
  }

  // ── Detail ──────────────────────────────────────────────────────────────────
  openDetail(query: AIQuery): void {
    this.selectedQuery = query;
    this.showDetailModal = true;
  }

  // ── Delete / Restore ────────────────────────────────────────────────────────
  softDelete(query: AIQuery): void {
    this.facade.softDelete(query.id).subscribe({
      next: (updatedQuery: AIQuery) => {
        const idx = this.queries.findIndex(q => q.id === query.id);
        if (idx !== -1) this.queries[idx] = updatedQuery;
        this.showToast('Consulta desactivada', 'success');
      },
      error: () => this.showToast('Error al eliminar', 'error')
    });
  }

  restore(query: AIQuery): void {
    this.facade.restore(query.id).subscribe({
      next: (updatedQuery: AIQuery) => {
        const idx = this.queries.findIndex(q => q.id === query.id);
        if (idx !== -1) this.queries[idx] = updatedQuery;
        this.showToast('Consulta restaurada', 'success');
      },
      error: () => this.showToast('Error al restaurar', 'error')
    });
  }

  // ── Utils ───────────────────────────────────────────────────────────────────
  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3500);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  truncate(text: string, max = 60): string {
    if (!text) return '-';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}