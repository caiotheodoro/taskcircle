'use client';

import { useEffect } from 'react';

import usePersistStore from '@/app/hooks/stores/persist';
import { ORGANIZATION_STATUS } from '@/app/utils/get-org-status';
import { CardMotion } from '@/components/ui/card';
import { useGetOrganizationStatus } from '@/hooks/organization';

import { OrganizationForm } from '../component/organization-form';
import PostForm from './post-form';
import Posts from './posts';

interface OrganizationProps {
  currOrg: string;
}

export default function Organizations({
  currOrg,
}: Readonly<OrganizationProps>) {
  const { data: status, error: orgError } = useGetOrganizationStatus(currOrg);

  const { setOrganization } = usePersistStore();

  if (orgError) return orgError.message;

  useEffect(() => {
    setOrganization(currOrg);
  }, [currOrg, setOrganization]);

  switch (status) {
    case ORGANIZATION_STATUS.CLAIMABLE:
      return (
        <CardMotion
          layout
          className="flex flex-col mt-6 font-medium border-none shadow-none h-full"
        >
          <OrganizationForm />
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
    case ORGANIZATION_STATUS.MEMBER:
      return (
        <CardMotion
          layout
          className="flex flex-col mt-6 font-medium border-none shadow-none"
        >
          <PostForm />
          <Posts />
        </CardMotion>
      );
  }
}
