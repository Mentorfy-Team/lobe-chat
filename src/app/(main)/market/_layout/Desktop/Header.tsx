'use client';

import { ChatHeader } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';

import ShareAgentButton from '../../features/ShareAgentButton';
import { Logo } from '@/components/Logo';

export const useStyles = createStyles(({ css, token }) => ({
  logo: css`
    color: ${token.colorText};
    fill: ${token.colorText};
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();

  return (
    <ChatHeader
      left={<Logo className={styles.logo} extra={'Descobrir'} size={36} type={'text'} />}
      right={<ShareAgentButton />}
    />
  );
});

export default Header;
