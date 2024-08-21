import { Component, InputSignal, Signal, computed, input } from '@angular/core';
import { IMeeting } from '../../../utils/imeeting';
import { TuiBadgeModule, TuiLineClampModule, TuiStatus } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meeting-preview',
  standalone: true,
  imports: [
    CommonModule,
    TuiBadgeModule,
    TuiLineClampModule,
  ],
  templateUrl: './meeting-preview.component.html',
  styleUrl: './meeting-preview.component.scss'
})
export class MeetingPreviewComponent {
  public meeting: InputSignal<IMeeting> = input.required<IMeeting>();

  protected m_dateString: Signal<string> = computed<string>(() => {
    const date = new Date(this.meeting().date);
    const today = new Date();
    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return 'Сегодня';
    }
    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0) + 86400000) {
      return 'Завтра';
    }
    return this.meeting().date.toLocaleDateString('RU-ru');
  });

  protected m_dateBadgeStatus: Signal<TuiStatus> = computed<TuiStatus>(() => {
    const dateString = this.m_dateString();
    if (dateString === 'Сегодня') {
      return 'success';
    }
    if (dateString === 'Завтра') {
      return 'warning';
    }
    return 'default';
  });
}
