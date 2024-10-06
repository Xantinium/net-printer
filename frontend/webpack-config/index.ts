import 'webpack-dev-server';
import path from 'node:path';
import type { Configuration } from 'webpack';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import { Env, Mode } from './types';
import { getWebpackPlugins } from './plugins';
import { getWebpackLoaders } from './loaders';

export function getWebpackConfig(env: Env): Configuration {
    const isDev = env.mode === Mode.DEV;

    return {
        entry: path.join(__dirname, '..', 'index.ts'),
        output: {
            clean: true,
            path: path.join(__dirname, '..', 'dist'),
            filename: 'static/main.js',
        },
        target: 'web',
        mode: env.mode,
        module: {
            rules: getWebpackLoaders(env),
        },
        watchOptions: {
            ignored: /node_modules/,
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        devtool: isDev ? 'eval-source-map' : undefined,
        stats: {
            assets: false,
            modules: false,
            entrypoints: false,
            version: false,
        },
        plugins: getWebpackPlugins(env),
        ...(isDev && {
            devServer: {
                port: 3000,
                proxy: [
                    {
                        context: ['/api'],
                        target: 'http://127.0.0.1:80',
                    },
                ],
            },
        }),
        ...(!isDev && {
            optimization: {
                minimize: true,
                splitChunks: false,
                minimizer: [new TerserWebpackPlugin({
                    extractComments: false,
                })],
            },
        }),
    };
}
