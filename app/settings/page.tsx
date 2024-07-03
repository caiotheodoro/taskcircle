import React from 'react';

import CententralizedContent from '@/components/molecules/cententralized-content';
import { SettingsPage } from '@/components/organisms/settings';

export default async function Settings() {
  return (
    <main>
      <CententralizedContent>
        <SettingsPage />
      </CententralizedContent>
    </main>
  );
}
