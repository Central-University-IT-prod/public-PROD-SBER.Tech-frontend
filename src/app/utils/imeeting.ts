import { IRepresentative } from "./irepresentative";

export interface ICompany {
  name: string;
  pathToLogo?: string;
}

export enum OperationType {
  CARD_DELIVERY = "Доставка карты",
  CARD_RETRIEVAL = "Возвращение карты",
}

export interface IPointOnMap {
  address: string;
  lat: number;
  lng: number;
}

export interface ITimeRange {
  from: Date;
  to: Date;
}

export interface IPerson {
  name: string;
  surname: string;
  position: string;
}

export interface IMeeting {
  id: string;
  company: ICompany;
  operationTypes: string[];
  meetingPoint: IPointOnMap;
  date: Date;
  timeRange: ITimeRange;
  participants?: IPerson[];
  documents?: string[];
  representative?: IRepresentative;
}
