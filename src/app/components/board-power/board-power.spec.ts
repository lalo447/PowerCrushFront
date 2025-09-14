import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPower } from './board-power';

describe('BoardPower', () => {
  let component: BoardPower;
  let fixture: ComponentFixture<BoardPower>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardPower]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardPower);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
