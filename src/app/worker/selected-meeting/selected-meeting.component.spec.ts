import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedMeetingComponent } from './selected-meeting.component';

describe('SelectedMeetingComponent', () => {
  let component: SelectedMeetingComponent;
  let fixture: ComponentFixture<SelectedMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedMeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectedMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
