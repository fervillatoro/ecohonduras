import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBillPage } from './add-bill.page';

describe('AddBillPage', () => {
  let component: AddBillPage;
  let fixture: ComponentFixture<AddBillPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
