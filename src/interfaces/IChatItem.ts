import IMessageItem from '@/interfaces/IMessageItem';

interface IChatItem {
  data: {
    logoUrl: string;
    name: string;
  };
  id: string;
  messages: IMessageItem[];
}

export default IChatItem;
