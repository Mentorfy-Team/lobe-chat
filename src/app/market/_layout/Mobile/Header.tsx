'use client';

import { MobileNavBar } from '@lobehub/ui';
import { memo } from 'react';

import { mobileHeaderSticky } from '@/styles/mobileHeader';

import ShareAgentButton from '../../features/ShareAgentButton';
import { Logo } from '@/components/Logo';

const Header = memo(() => {
  return (
    <MobileNavBar
      center={<Logo type={'text'} />}
      right={<ShareAgentButton mobile />}
      style={mobileHeaderSticky}
    />
  );
});

export default Header;
