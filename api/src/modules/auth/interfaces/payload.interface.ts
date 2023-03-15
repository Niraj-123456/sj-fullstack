export interface IAccessPayload {
  id: string;
  email: string;
  phoneNumber: string;
}

export interface IRefreshPayload {
  id: string;
  phoneNumber: string;
}
