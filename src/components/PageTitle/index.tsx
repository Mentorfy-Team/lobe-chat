import { memo, useEffect } from 'react';

const PageTitle = memo<{ title: string }>(({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} · Mentorfy GPT` : 'Mentorfy GPT';
  }, [title]);

  return null;
});

export default PageTitle;
