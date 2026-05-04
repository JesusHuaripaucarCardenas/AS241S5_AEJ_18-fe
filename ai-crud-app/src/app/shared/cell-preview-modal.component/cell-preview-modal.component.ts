import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CellPreview {
  label: string;
  value: string;
  type?: 'text' | 'id' | 'response';
}

@Component({
  selector: 'app-cell-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell-preview-modal.component.html',
  styleUrl: './cell-preview-modal.component.scss',
})
export class CellPreviewModalComponent {
  @Input() preview: CellPreview | null = null;
  @Output() close = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('preview-overlay')) {
      this.close.emit();
    }
  }

  copyToClipboard() {
    if (this.preview?.value) {
      navigator.clipboard.writeText(this.preview.value);
    }
  }
}