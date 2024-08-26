import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailSentPage } from './mail-sent.page';

describe('MailSentPage', () => {
  let component: MailSentPage;
  let fixture: ComponentFixture<MailSentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
