import { registerProviderOverrides, registerTools } from '../../../packages/pi-extension/src/index.ts';

export default function asterExtension(pi: Parameters<typeof registerTools>[0]) {
  registerProviderOverrides(pi);
  registerTools(pi);
}
