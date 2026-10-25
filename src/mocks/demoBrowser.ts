import { setupWorker } from 'msw/browser';
import { demoHandlers } from './demoHandlers';

export const demoWorker = setupWorker(...demoHandlers);

export async function startDemoWorker(): Promise<void> {
  await demoWorker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}
