import React from 'react';
import { AppShell } from '@aster/ui';
import { asterClient } from './asterClient';

export default function App() {
  return <AppShell client={asterClient} />;
}
