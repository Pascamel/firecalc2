export interface IGenericEvent<T> {
  time: number;
  event: string;
  label?: string;
  previous_value: T;
  new_value: T;
}

export type IEvent =
  | IGenericEvent<boolean>
  | IGenericEvent<string>
  | IGenericEvent<number>
  | IGenericEvent<null>;

export interface IEvents extends Array<IEvent> {}

export interface IJournal {
  lastupdate: string;
  events: IEvents;
}
