'use client';

import { useEffect } from 'react';

import usePersistStore from '@/app/hooks/stores/persist';
import { ORGANIZATION_STATUS } from '@/app/utils/get-org-status';
import { CardMotion } from '@/components/ui/card';
import { useGetOrganizations } from '@/hooks/get-organization-status';

import PostForm from './post-form';
import Posts from './posts';

interface OrganizationProps {
  currOrg: string;
}

export default function Organizations({
  currOrg,
}: Readonly<OrganizationProps>) {
  const {
    data: status,
    error: orgError,
    isSuccess,
  } = useGetOrganizations(currOrg);

  const { setOrganization } = usePersistStore();

  if (orgError) return orgError.message;

  useEffect(() => {
    if (isSuccess) {
      console.log('oi', currOrg);
      setOrganization(currOrg);
    }
  }, [currOrg, setOrganization]);

  switch (status) {
    case ORGANIZATION_STATUS.CLAIMABLE:
      return (
        <CardMotion
          layout
          className="flex flex-col mt-6 font-medium border-none shadow-none"
        >
          claimable
        </CardMotion>
      );
    case ORGANIZATION_STATUS.CLAIMED:
      return (
        <CardMotion
          layout
          className="flex flex-col mt-6 font-medium border-none shadow-none"
        >
          claimed
        </CardMotion>
      );
    case ORGANIZATION_STATUS.OWNED:
      return (
        <CardMotion
          layout
          className="flex flex-col mt-6 font-medium border-none shadow-none"
        >
          <PostForm />
          <Posts />
        </CardMotion>
      );
    case ORGANIZATION_STATUS.MEMBER:
      return (
        <CardMotion
          layout
          className="flex flex-col mt-6 font-medium border-none shadow-none"
        >
          member
        </CardMotion>
      );
  }
}
