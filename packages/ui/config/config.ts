import getConfig from 'next/config';
import { UiConfig } from '@package/config';

const { publicRuntimeConfig }: { publicRuntimeConfig: UiConfig } = getConfig();

export default publicRuntimeConfig;
