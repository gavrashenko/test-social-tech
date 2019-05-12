import IChatItem from '@/interfaces/IChatItem';
import IMessageItem from '@/interfaces/IMessageItem';

interface IState {
  chatsList: IChatItem[];
  messagesBuffer: IMessageItem[];
  selfLogoUrl: string;
  network: boolean;
}

export default IState;
