interface IPerson {
  name: string;
  surname: string;
  position: string;
}

export interface IMeetingScheme {
  datetime: Date;
  place_address: string;
  place_longtitude: number;
  place_latitude: number;
  operations_ids: number[];
  id: string;
  representative_id: number;
  approximate_end_datetime: Date;
  client_side_people: IPerson[];
}
