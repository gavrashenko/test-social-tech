import { IChatItem } from '@/interfaces/IChatItem';
import { IMessageItem } from '@/interfaces/IMessageItem';

export interface IState {
  chatsList: IChatItem[];
  messagesBuffer: IMessageItem[];
  selfLogoUrl: string;
  network: boolean;
}
