import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiQueryListComponent } from './ai-query-list.component';

describe('AiQueryListComponent', () => {
  let component: AiQueryListComponent;
  let fixture: ComponentFixture<AiQueryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiQueryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
