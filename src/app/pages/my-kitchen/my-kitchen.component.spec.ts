import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyKitchenComponent } from './my-kitchen.component';

describe('MyKitchenComponent', () => {
  let component: MyKitchenComponent;
  let fixture: ComponentFixture<MyKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyKitchenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
