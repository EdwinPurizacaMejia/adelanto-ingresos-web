import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticasHistorialComponent } from './politicas-historial.component';

describe('PoliticasHistorialComponent', () => {
  let component: PoliticasHistorialComponent;
  let fixture: ComponentFixture<PoliticasHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticasHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticasHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
