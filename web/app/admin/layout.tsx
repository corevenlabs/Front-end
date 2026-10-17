import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin | Corevenlabs' },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRaiz({ children }: { children: React.ReactNode }) {
  return children;
}
