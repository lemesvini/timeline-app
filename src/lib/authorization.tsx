import * as React from 'react';

import { type User, Role } from '@/types/api';

import { useUser } from './auth';

type RoleTypes = keyof typeof Role;

export const ROLES = Role;

export const POLICIES = {
  'users:create': (user: User) => user.role === Role.ADMINISTRATOR,
  'users:update': (user: User) => user.role === Role.ADMINISTRATOR,
  'users:delete': (user: User) => user.role === Role.ADMINISTRATOR,
};

export const useAuthorization = () => {
  const { data: user } = useUser();

  if (!user) {
    throw new Error('User not found');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user) {
        return allowedRoles?.includes(user.role);
      }

      return true;
    },
    [user]
  );

  return { checkAccess, role: user.role };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: RoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
