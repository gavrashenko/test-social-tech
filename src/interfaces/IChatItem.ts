import { IMessageItem } from '@/interfaces/IMessageItem';

export interface IChatItem {
  data: {
    chat_img_url: string;
    chat_name: string;
  };
  id: string;
  messages: IMessageItem[];
}
