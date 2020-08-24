import { capitalCase, sentenceCase } from 'change-case';
import {
  Action,
  Entity,
  User,
  Group,
  Permission,
  BookingStatus,
  BookingType,
} from '@fhg-test/core';
import logger from '@boringcodes/utils/logger';

import GroupsRepository from './components/groups/repository';
import PermissionsRepository from './components/permissions/repository';
import UsersRepository from './components/users/repository';
import BookingStatusesRepository from './components/booking-statuses/repository';
import BookingTypesRepository from './components/booking-types/repository';
import RBACRepository from './components/rbac/repository';

const actions: Action[] = [
  Action.Create,
  Action.Read,
  Action.Update,
  Action.Delete,
];

const entityActions: { readonly [key: string]: Action[] } = {
  [Entity.Booking]: actions,
  [Entity.BookingStatus]: actions,
  [Entity.BookingType]: actions,
  [Entity.Permission]: actions,
  [Entity.Group]: actions,
  [Entity.RBAC]: actions,
  [Entity.Session]: actions,
  [Entity.User]: actions,
};

const permissions: Permission[] = Object.keys(entityActions).reduce(
  (prev, entity) => [
    ...prev,
    ...entityActions[entity].map((action) => ({
      id: `${entity}:${action}`,
      name: `${capitalCase(action)} ${sentenceCase(entity)}`,
    })),
  ],
  [] as Permission[],
);

const groups: Group[] = [
  {
    id: '000000000000000000000000',
    name: 'Admin',
    permissions: permissions.map(({ id }) => id),
  },
];

const users: User[] = [
  {
    id: '000000000000000000000000',
    displayName: 'Admin User',
    credentials: {
      password:
        'q1zQvLf+X3E5mnBb+d3xfQbp+Z1VXXUO8ZlCeHHTdwuSGlq0p/WwjZKhYm5XV0X+pvb0ggKCQ8iAaL55yPO9lw==',
      email: 'admin@fullertonhealth.com',
      salt: 'B3nH7HkkDa5s8ark5x1n8A==',
    },
    groups: groups.map(({ id }) => id),
  },
  {
    id: '000000000000000000000001',
    displayName: 'User 1',
    credentials: {
      password:
        'q1zQvLf+X3E5mnBb+d3xfQbp+Z1VXXUO8ZlCeHHTdwuSGlq0p/WwjZKhYm5XV0X+pvb0ggKCQ8iAaL55yPO9lw==',
      email: 'user1@fullertonhealth.com',
      salt: 'B3nH7HkkDa5s8ark5x1n8A==',
    },
    groups: [],
  },
  {
    id: '000000000000000000000002',
    displayName: 'User 2',
    credentials: {
      password:
        'q1zQvLf+X3E5mnBb+d3xfQbp+Z1VXXUO8ZlCeHHTdwuSGlq0p/WwjZKhYm5XV0X+pvb0ggKCQ8iAaL55yPO9lw==',
      email: 'user2@fullertonhealth.com',
      salt: 'B3nH7HkkDa5s8ark5x1n8A==',
    },
    groups: [],
  },
];

const bookingStatuses: BookingStatus[] = [
  {
    id: 'pending-review',
    name: 'Pending Review',
  },
  {
    id: 'approved',
    name: 'Approved',
  },
  {
    id: 'rejected',
    name: 'Rejected',
  },
];

const bookingTypes: BookingType[] = [
  {
    id: 'health-talk',
    name: 'Health Talk',
  },
  {
    id: 'wellness-events',
    name: 'Wellness Events',
  },
  {
    id: 'fitness-activities',
    name: 'Fitness Activities',
  },
];

const initRBAC = async (): Promise<void> => {
  const users = await UsersRepository.list();
  const rbacs = await Promise.all(
    users.map(async (user) => {
      const groups = await GroupsRepository.listByIds(user.groups as string[]);

      return {
        id: user.id,
        permissions: groups.reduce(
          (prev, group) => [...prev, ...(group.permissions as string[])],
          [] as string[],
        ),
      };
    }),
  );

  await RBACRepository.initData(rbacs.map((o) => ({ _id: o.id, ...o })));
};

const initData = async (): Promise<void> => {
  await Promise.all([
    PermissionsRepository.initData(
      permissions.map((o) => ({ _id: o.id, ...o })),
    ),
    GroupsRepository.initData(groups.map((o) => ({ _id: o.id, ...o }))),
    UsersRepository.initData(users.map((o) => ({ _id: o.id, ...o }))),
    BookingStatusesRepository.initData(
      bookingStatuses.map((o) => ({ _id: o.id, ...o })),
    ),
    BookingTypesRepository.initData(
      bookingTypes.map((o) => ({ _id: o.id, ...o })),
    ),
  ]);
  await initRBAC();

  logger.info('> Default data initialized');
};

export default initData;
