export interface IMessageItem {
  id: string;
  data: {
    createdAt: number;
    self: boolean;
    text: string;
  };
  chatId?: string;
}
