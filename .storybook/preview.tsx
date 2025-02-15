import type { Preview } from '@storybook/react';
import React from 'react';

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	decorators: [
		(Story) =>
			React.createElement(
				React.StrictMode,
				null,
				React.createElement(Story, null)
			),
	],
};

export default preview;
