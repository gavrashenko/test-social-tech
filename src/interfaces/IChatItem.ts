import { IMessageItem } from '@/interfaces/IMessageItem';

export interface IChatItem {
  data: {
    logoUrl: string;
    name: string;
  };
  id: string;
  messages: IMessageItem[];
}
