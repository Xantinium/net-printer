import React from 'react';
import { createRoot } from 'react-dom/client';
import { configure } from '@gravity-ui/uikit';
import { App } from './src';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

configure({
    lang: 'ru',
});

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(React.createElement(App));
