'use client';

import React from 'react';

import usePersistStore from '@/app/hooks/stores/persist';

export default function OrgPanel() {
  const { organization } = usePersistStore();
  return (
    <>
      <span className="mr-4 text-sm">{organization?.slug}</span>
      <span className="mr-4 text-sm">•</span>
    </>
  );
}
