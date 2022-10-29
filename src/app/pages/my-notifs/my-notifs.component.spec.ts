import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNotifsComponent } from './my-notifs.component';

describe('MyNotifsComponent', () => {
  let component: MyNotifsComponent;
  let fixture: ComponentFixture<MyNotifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyNotifsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNotifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
