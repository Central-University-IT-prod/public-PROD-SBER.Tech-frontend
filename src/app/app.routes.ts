import { Routes } from '@angular/router';

import { SelectedMeetingComponent as ClientSelectedMeetingComponent } from './client/selected-meeting/selected-meeting.component';
import { MeetingViewComponent as ClientMeetingViewComponent } from './client/meeting-view/meeting-view.component';

import { SelectedMeetingComponent as WorkerSelectedMeetingComponent } from './worker/selected-meeting/selected-meeting.component';
import { MeetingViewComponent as WorkerMeetingViewComponent } from './worker/meeting-view/meeting-view.component';
import { MeetingCreateComponent } from './client/meeting-create/meeting-create.component';

export const routes: Routes = [
  { path: '', redirectTo: '/worker/meetings', pathMatch: 'full' },
  {
    path: 'client',
    children: [
      {
        path: 'meetings',
        children: [
          {
            path: '',
            redirectTo: '/client/meetings/list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            title: 'Запланированные встречи',
            component: ClientSelectedMeetingComponent,
          },
          {
            path: 'create',
            title: 'Создание встречи',
            component: MeetingCreateComponent,
          },
          {
            path: ':name',
            title: 'Встреча {{ name }}',
            component: ClientMeetingViewComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'worker',
    children: [
      {
        path: 'meetings',
        children: [
          {
            path: '',
            redirectTo: '/worker/meetings/list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            title: 'Запланированные встречи',
            component: WorkerSelectedMeetingComponent,
          },
          {
            path: ':name',
            title: 'Встреча {{ name }}',
            component: WorkerMeetingViewComponent,
          },
        ],
      },
    ],
  },
];
