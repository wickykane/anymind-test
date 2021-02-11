import { Channel, User } from 'src/app/core/types';

export const users: User[] = [
  {
    userId: 'Joyse',
    avatar: '/assets/images/Joyse.png',
  },
  {
    userId: 'Sam',
    avatar: '/assets/images/Sam.png',
  },
  {
    userId: 'Russell',
    avatar: '/assets/images/Russell.png',
  },
];

export const channels: Channel[] = [
  { id: '1', name: 'General Channel' },
  { id: '2', name: 'Technology Channel' },
  { id: '3', name: 'LGTM Channel' },
];
