export interface IUser {
  id: string;
  email?: string;
  type?: number;
}

export interface IUserData {
  headers?: string;
  savings?: string;
  income?: string;
  others?: string;
}
