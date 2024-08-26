import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarbonFootprintPage } from './carbon-footprint.page';

describe('CarbonFootprintPage', () => {
  let component: CarbonFootprintPage;
  let fixture: ComponentFixture<CarbonFootprintPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarbonFootprintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
