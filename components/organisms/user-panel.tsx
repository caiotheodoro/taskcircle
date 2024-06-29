'use client';

import React from 'react';

import useOrganizationStore from '@/app/hooks/stores/organization';

export default function OrgPanel() {
  const { organization } = useOrganizationStore();
  if (organization?.slug)
    return (
      <>
        <span className="mr-4 text-sm">{organization?.slug}</span>
        <span className="mr-5 text-sm">•</span>
      </>
    );
}
