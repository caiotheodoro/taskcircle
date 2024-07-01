import { Role } from '@/server/schema';

export enum ORGANIZATION_STATUS {
  CLAIMABLE = 'claimable',
  CLAIMED = 'claimed',

  OWNED = 'owned',

  MEMBER = 'member',
}

export enum HookActionStatus {
  IDLE = 'idle',
  EXECUTING = 'executing',
  HAS_SUCCEEDED = 'hasSucceeded',
  HAS_ERRORED = 'hasErrored',
}
interface Organization {
  role: string;
  organization: {
    name: string;
  };
}

export const getOrgStatus = (orgs: Organization[], currOrg: string) => {
  if (orgs.some((org) => org.organization.name === currOrg)) {
    if (
      orgs.find((org) => org.organization.name === currOrg).role === Role.ADMIN
    ) {
      return ORGANIZATION_STATUS.OWNED;
    }
    return ORGANIZATION_STATUS.MEMBER;
  }
  return ORGANIZATION_STATUS.CLAIMABLE;
};
