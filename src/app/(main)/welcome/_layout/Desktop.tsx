import { GridShowcase } from '@lobehub/ui';
import { PropsWithChildren } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Logo } from '@/components/Logo';
import Follow from '@/features/Follow';

const COPYRIGHT = `© ${new Date().getFullYear()} LobeHub, LLC`;

const DesktopLayout = ({ children }: PropsWithChildren) => {
  return (
    <Flexbox
      align={'center'}
      height={'100%'}
      justify={'space-between'}
      padding={16}
      style={{ overflow: 'hidden', position: 'relative' }}
      width={'100%'}
    >
      <Logo style={{ alignSelf: 'flex-start' }} extra={'Descobrir'} size={36} type={'text'} />
      <GridShowcase innerProps={{ gap: 24 }} style={{ maxWidth: 1024 }} width={'100%'}>
        {children}
      </GridShowcase>
      <Flexbox align={'center'} horizontal justify={'space-between'}>
        <span style={{ opacity: 0.5 }}>{COPYRIGHT}</span>
        <Follow />
      </Flexbox>
    </Flexbox>
  );
};

export default DesktopLayout;
