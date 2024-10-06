import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ProgressPlugin, WebpackPluginInstance, optimize } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { Env, Mode } from './types';

export function getWebpackPlugins(env: Env): WebpackPluginInstance[] {
    const isDev = env.mode === Mode.DEV;

    const plugins: WebpackPluginInstance[] = [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            ignoreOrder: true,
        }),
        new ForkTsCheckerWebpackPlugin({
            async: isDev,
        }),
        new optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ];

    if (isDev) {
        plugins.push(
            new ProgressPlugin(),
            new ESLintPlugin(),
        );
    }

    return plugins;
}
