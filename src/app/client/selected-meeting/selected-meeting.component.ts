import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { IMeeting } from '../../utils/imeeting';
import { MeetingPreviewComponent } from "./meeting-preview/meeting-preview.component";
import { TuiTabsModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiScrollbarModule } from '@taiga-ui/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IMeetingScheme } from '../../utils/imeeting-scheme';
import { environment } from '../../../environment/environment.dev';
import { IOperationScheme } from '../../utils/ioperation-scheme';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-selected-meeting',
    standalone: true,
    templateUrl: './selected-meeting.component.html',
    styleUrl: './selected-meeting.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    MeetingPreviewComponent,
    TuiTabsModule,
    TuiButtonModule,
    TuiScrollbarModule,
  ],
})
export class SelectedMeetingComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {}

  protected m_visitMeetingPage(meetingId: string): void {
    this.router.navigate([`/client/meetings/${meetingId}`]);
  }

  private _getOperation(id: number): Observable<IOperationScheme> {
    return this.http.get<IOperationScheme>(environment.backendUrl + 'operation/' + id);
  }

  ngOnInit(): void {
    this.http.get<IMeetingScheme[]>(environment.backendUrl + 'meets').subscribe(meets => {
      const meetings: IMeeting[] = [];
      meets.forEach(meet => {
        const operations: IOperationScheme[] = [];
        meet.operations_ids.forEach(id => {
          this._getOperation(id).subscribe(operation => {
            operations.push(operation);
          })
        })
        meetings.push({
          id: meet.id,
          company: { name: "Tinkoff" },
          operationTypes: [],
          meetingPoint: { address: meet.place_address, lng: meet.place_longtitude, lat: meet.place_latitude },
          date: new Date(meet.datetime),
          timeRange: {
            from: new Date(meet.datetime),
            to: new Date(meet.approximate_end_datetime),
          },
        })
      })

      this.m_availableMeetings.set(meetings);

      for (let i = 0; i < meetings.length; i++) {
        const operations: IOperationScheme[] = [];
        meets[i].operations_ids.forEach(id => {
          this._getOperation(id).subscribe(operation => {
            operations.push(operation);

            meetings[i].operationTypes = operations.map(operation => operation.name);

            this.m_availableMeetings.set([...meetings]);
          })
        })
      }
    })
  }

  protected m_availableMeetings: WritableSignal<IMeeting[]> = signal<IMeeting[]>([]);
}
