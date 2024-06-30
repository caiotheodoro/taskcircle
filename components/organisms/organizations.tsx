'use client';

import { useEffect } from 'react';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { ORGANIZATION_STATUS } from '@/app/utils/get-org-status';
import { CardMotion } from '@/components/ui/card';
import { useGetOrganizationStatus } from '@/hooks/organization';

import { OrganizationForm } from '../component/organization-form';
import { OtpCard } from '../component/otp-card';
import PostForm from './post-form';
import Posts from './posts';

interface OrganizationProps {
  currOrg: string;
}
export const config = {
  runtime: 'edge',
};

export default function Organizations({
  currOrg,
}: Readonly<OrganizationProps>) {
  const { data, error: orgError } = useGetOrganizationStatus(currOrg);

  if (orgError) return orgError.message;

  switch (data?.status) {
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
  }
}
