import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellPreviewModalComponent } from './cell-preview-modal.component';

describe('CellPreviewModalComponent', () => {
  let component: CellPreviewModalComponent;
  let fixture: ComponentFixture<CellPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
