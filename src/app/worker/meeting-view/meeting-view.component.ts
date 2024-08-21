import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { Observable, switchMap } from 'rxjs';
import { IMeeting } from '../../utils/imeeting';
import { IMeetingScheme } from '../../utils/imeeting-scheme';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment.dev';
import { IOperationScheme } from '../../utils/ioperation-scheme';
import { TuiLineClampModule } from '@taiga-ui/kit';
import { IRepresentative } from '../../utils/irepresentative';

@Component({
  selector: 'app-meeting-view',
  standalone: true,
  imports: [
    TuiSvgModule,
    TuiScrollbarModule,
    AngularYandexMapsModule,
    TuiLineClampModule,
  ],
  templateUrl: './meeting-view.component.html',
  styleUrl: './meeting-view.component.scss'
})
export class MeetingViewComponent implements OnInit {
  private name$!: Observable<string>;

  protected m_name: WritableSignal<string> = signal<string>('');

  protected m_meeting: WritableSignal<IMeeting> = signal<IMeeting>({} as IMeeting);

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  private _getOperation(id: number): Observable<IOperationScheme> {
    return this.http.get<IOperationScheme>(environment.backendUrl + 'operation/' + id);
  }

  private _getMeeting(id: string): Observable<IMeetingScheme> {
    return this.http.get<IMeetingScheme>(environment.backendUrl + 'meet/' + id);
  }

  private _getRepresentative(id: number): Observable<IRepresentative> {
    return this.http.get<IRepresentative>(environment.backendUrl + 'representatives/' + id);
  }

  protected m_goBack(): void {
    this.router.navigate(['/worker/meetings']);
  }

  ngOnInit(): void {
    this.name$ = this.route.paramMap.pipe(
      switchMap(params => params.getAll('name').map(name => String(name))),
    )
    this.name$.subscribe(name => {
      this.m_name.set(name);
    })
    this._getMeeting(this.m_name()).subscribe(meet => {
      this.m_meeting.set({
        id: meet.id,
        company: { name: "Tinkoff" },
        operationTypes: [],
        meetingPoint: { address: meet.place_address, lng: meet.place_longtitude, lat: meet.place_latitude },
        date: new Date(meet.datetime),
        timeRange: {
          from: new Date(meet.datetime),
          to: new Date(meet.approximate_end_datetime),
        },
        participants: meet.client_side_people,
      })
      const operations: IOperationScheme[] = [];
      const documents: string[] = [];
      meet.operations_ids.forEach(id => {
        this._getOperation(id).subscribe(operation => {
          if (operation !== undefined) {
            operations.push(operation);
            if (operation.documents !== undefined) {
              documents.push(...operation.documents);
            }

            this.m_meeting.set({
              ...this.m_meeting(),
              operationTypes: operations.map(operation => operation.name),
              documents: documents,
            })
          }
        })
      })

      this._getRepresentative(meet.representative_id).subscribe(representative => {
        if (representative !== undefined) {
          this.m_meeting.set({
            ...this.m_meeting(),
            representative: representative
          })
        }
      })
    })
  }

}
