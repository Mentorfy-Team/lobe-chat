import { Metadata } from 'next';

import { appEnv, getAppConfig } from '@/config/app';
import { OFFICIAL_URL } from '@/const/url';
import { translation } from '@/server/translation';

const title = 'Mentorfy GPT';

const { SITE_URL = OFFICIAL_URL } = getAppConfig();
const BASE_PATH = appEnv.NEXT_PUBLIC_BASE_PATH;

// if there is a base path, then we don't need the manifest
const noManifest = !!BASE_PATH;

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await translation('metadata');
  return {
    appleWebApp: {
      statusBarStyle: 'black-translucent',
      title,
    },
    description: t('chat.description'),
    icons: {
      apple: '/images/favicon.png',
      icon: '/images/favicon.png',
      shortcut: '/images/favicon.ico',
    },
    manifest: noManifest ? undefined : '/manifest.json',
    metadataBase: new URL(SITE_URL),
    openGraph: {
      description: t('chat.description'),
      images: [
        //
      ],
      locale: 'en-US',
      siteName: title,
      title: title,
      type: 'website',
      url: OFFICIAL_URL,
    },
    title: {
      default: t('chat.title'),
      template: '%s · Mentorfy GPT',
    },
    twitter: {
      card: 'summary_large_image',
      description: t('chat.description'),
      images: ['/og/cover.png'],
      site: '@mentorfy.me',
      title: t('chat.title'),
    },
  };
};
