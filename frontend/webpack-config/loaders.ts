import { RuleSetRule } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Env, Mode } from './types';

export function getWebpackLoaders(env: Env): RuleSetRule[] {
    const isDev = env.mode === Mode.DEV;

    const cssLoader: RuleSetRule['use'] = {
        loader: 'css-loader',
        options: {
            sourceMap: false,
            modules: {
                auto: true,
                namedExport: false,
                exportLocalsConvention: 'as-is',
                localIdentName: isDev ? '[folder]__[local]--[hash:base64:4]' : '[hash:base64]',
            },
        },
    };

    const loaders: RuleSetRule[] = [
        {
            test: /\.[jt]sx?$/i,
            loader: '@swc-node/loader',
            exclude: [/node_modules/],
        },
        {
            test: /\.css$/i,
            use: [
                MiniCssExtractPlugin.loader,
                cssLoader,
            ],
        },
        {
            test: /\.svg$/i,
            type: 'asset/resource',
            generator: {
                filename: 'static/[name][ext]',
            },
        },
    ];

    return loaders;
}
