import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPlayerName } from './alert-player-name';

describe('AlertPlayerName', () => {
  let component: AlertPlayerName;
  let fixture: ComponentFixture<AlertPlayerName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertPlayerName]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertPlayerName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
