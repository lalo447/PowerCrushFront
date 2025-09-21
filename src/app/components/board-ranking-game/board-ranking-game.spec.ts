import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardRankingGame } from './board-ranking-game';

describe('BoardRankingGame', () => {
  let component: BoardRankingGame;
  let fixture: ComponentFixture<BoardRankingGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardRankingGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardRankingGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
