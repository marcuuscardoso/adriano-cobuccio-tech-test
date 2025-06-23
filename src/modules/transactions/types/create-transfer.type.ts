export interface ICreateTransferType {
  senderId: string;
  receiverId: string;
  amount: number;
  description?: string;
  createdBy?: string;
}