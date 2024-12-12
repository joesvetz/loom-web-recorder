"use client";

import dynamic from 'next/dynamic';

const LoomRecorder = dynamic(
  () => import('./components/LoomRecorder'),
  { ssr: false } // This is important!
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoomRecorder />
    </main>
  );
}