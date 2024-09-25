'use client';

import { useEffect } from 'react';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { OrganizationResponse } from '@/app/types/organization';
import { ORGANIZATION_STATUS } from '@/app/utils/get-org-status';
import { OtpCard } from '@/components/molecules/otp-card';
import { CardMotion } from '@/components/ui/card';

import { OrganizationForm } from './organization-form';
import PostForm from './post-form';
import Posts from './posts';

export default function Organizations({
  data: { organization, status },
}: Readonly<OrganizationResponse['data']>) {
  const { setOrganization } = useOrganizationStore();

  useEffect(() => {
    setOrganization(organization);
  }, [organization, setOrganization]);

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
          <OtpCard />
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
    default:
      return null;
  }
}
