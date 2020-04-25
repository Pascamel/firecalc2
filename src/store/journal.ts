import { firestore } from '../firebase';
import deepCopy from '../helpers/deepCopy';

export interface IGenericEvent<T> {
  time: number;
  event: string;
  previous_value: T;
  new_value: T;
  notSaved?: boolean;
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

export const load = async (uid: string): Promise<IJournal> => {
  const snapshot = await firestore.getJournal(uid);

  if (!snapshot) {
    return {} as IJournal;
  }

  return {
    lastupdate: snapshot.data()?.lastupdate,
    events: snapshot.data()?.events,
  };
};

export const formatEvent = (event: IEvent): IEvent => {
  const { notSaved, ...otherProps } = event;
  return otherProps;
};

export const save = async (uid: string, journal: IJournal) => {
  const payload: IJournal = {
    lastupdate: new Date().getTime().toString(),
    events: deepCopy(journal.events.map(formatEvent)) as IEvents,
  };

  try {
    await firestore.setJournal(uid, payload);
    return true;
  } catch {
    return false;
  }
};
