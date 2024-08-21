import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButtonModule, TuiDialogModule, TuiScrollbarModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiComboBoxModule, TuiDataListWrapperModule, TuiFilterByInputPipeModule, TuiInputDateModule, TuiInputModule, TuiInputNumberModule, TuiInputTimeModule } from '@taiga-ui/kit';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { Observable, switchMap } from 'rxjs';
import { IPerson } from '../../utils/imeeting';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment.dev';
import { IOperationScheme } from '../../utils/ioperation-scheme';

@Component({
  selector: 'app-meeting-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiSvgModule,
    TuiScrollbarModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiInputTimeModule,
    TuiInputDateModule,
    TuiInputNumberModule,
    TuiDialogModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiFilterByInputPipeModule,
    AngularYandexMapsModule,
  ],
  templateUrl: './meeting-create.component.html',
  styleUrl: './meeting-create.component.scss'
})
export class MeetingCreateComponent implements OnInit {
  private name$!: Observable<string>;

  protected m_name: WritableSignal<string> = signal<string>('');

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  protected m_goBack(): void {
    this.router.navigate(['/client/meetings']);
  }

  protected m_deleteMeeting(): void {
    this.m_goBack();
  }

  protected m_dateFormControl: FormControl = new FormControl<string>('');

  protected m_timeFormControl: FormControl = new FormControl<string>('');

  protected m_addressFormControl: FormControl = new FormControl<string>('');

  protected m_latitude: WritableSignal<number> = signal<number>(0);

  protected m_latitudeFormControl: FormControl = new FormControl<number>(0);

  protected m_longitude: WritableSignal<number> = signal<number>(0);

  protected m_longitudeFormControl: FormControl = new FormControl<number>(0);

  protected m_peopleList: WritableSignal<IPerson[]> = signal<IPerson[]>([]);

  protected m_addingClientDialogOpen: boolean = false;

  protected m_showAddingClientDialog(): void {
    this.m_addingClientDialogOpen = true;
  }

  protected m_addingClientDialogFormGroup: FormGroup = new FormGroup({
    clientName: new FormControl<string>(''),
    clientSurname: new FormControl<string>(''),
    clientRole: new FormControl<string>(''),
  })

  protected m_addClient(): void {
    this.m_peopleList.update(p => [...p, {
      name: this.m_addingClientDialogFormGroup.get('clientName')?.value,
      surname: this.m_addingClientDialogFormGroup.get('clientSurname')?.value,
      position: this.m_addingClientDialogFormGroup.get('clientRole')?.value
    }]);
    this.m_addingClientDialogOpen = false;
    this.m_addingClientDialogFormGroup.reset();
  }

  protected m_operationsList: WritableSignal<string[]> = signal<string[]>([]);

  protected m_addingOperationDialogOpen: boolean = false;

  protected m_showAddingOperationDialog(): void {
    this.m_addingOperationDialogOpen = true;
  }

  protected m_addingOperationDialogFormGroup: FormGroup = new FormGroup({
    operationName: new FormControl<string>(''),
  })

  protected m_addOperation(): void {
    const newOperation: string = this.m_addingOperationDialogFormGroup.get('operationName')?.value;
    if (this.m_operationsList().includes(newOperation)) {
      this.m_addingOperationDialogOpen = false;
      this.m_addingOperationDialogFormGroup.reset();
      return;
    }
    this.m_operationsList.set([...this.m_operationsList(), newOperation]);
    this.m_addingOperationDialogOpen = false;
    this.m_addingOperationDialogFormGroup.reset();
  }

  protected m_availableOperationsList: WritableSignal<string[]> = signal<string[]>([]);

  private _operations$: Observable<IOperationScheme[]> = this.http.get<IOperationScheme[]>(environment.backendUrl + 'operations');

  protected m_createMeeting(): void {
    const date: Date = new Date(this.m_dateFormControl.value);

    const time = this.m_timeFormControl.value;

    date.setHours(time.hours, time.minutes, 0, 0);

    let dateStr: string = date.toISOString();

    dateStr = dateStr.slice(0, dateStr.length - 1);

    this.http.post(environment.backendUrl + 'meet_alt', {
      datetime: dateStr,
      place_address: this.m_addressFormControl.value,
      place_longtitude: this.m_longitudeFormControl.value,
      place_latitude: this.m_latitudeFormControl.value,
      operations_names: this.m_operationsList(),
    }).subscribe(() => this.m_goBack());
  }

  ngOnInit(): void {
    this.name$ = this.route.paramMap.pipe(
      switchMap(params => params.getAll('name').map(name => String(name))),
    )
    this.name$.subscribe(name => {
      this.m_name.set(name);
    })
    this._operations$.subscribe((operations: IOperationScheme[]) => {
      this.m_availableOperationsList.set(operations.map(operation => operation.name));
    })
    this.m_latitudeFormControl.valueChanges.subscribe((value: number) => {
      this.m_latitude.set(value);
    })
    this.m_longitudeFormControl.valueChanges.subscribe((value: number) => {
      this.m_longitude.set(value);
    })
  }

}
