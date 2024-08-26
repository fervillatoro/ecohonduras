import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LicensesPage } from './licenses.page';

describe('LicensesPage', () => {
  let component: LicensesPage;
  let fixture: ComponentFixture<LicensesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
