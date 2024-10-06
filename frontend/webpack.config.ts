import type { Env } from './webpack-config/types';
import { getWebpackConfig } from './webpack-config';

export default (env: Env) => getWebpackConfig({
    mode: env.mode,
});
