/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-onboarding',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	typescript: {
		check: false,
		checkOptions: {},
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) =>
				prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
		},
	},
	webpackFinal: async (config) => {
		// Handle TypeScript and JavaScript
		config.module.rules.push({
			test: /\.(ts|tsx|js|jsx)$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						['@babel/preset-env', { targets: { node: 'current' } }],
						['@babel/preset-react', { runtime: 'automatic' }],
						'@babel/preset-typescript',
					],
				},
			},
		});

		// Handle SCSS modules
		config.module.rules.push({
			test: /\.scss$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: {
							auto: true,
							localIdentName: '[name]__[local]--[hash:base64:5]',
						},
					},
				},
				'sass-loader',
			],
		});

		// Handle SVG files
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		// Add path aliases
		config.resolve.alias = {
			...config.resolve.alias,
			src: '/Users/Ollie/Desktop/Yandex-Practicum-Sprints/blog-customizer/src',
		};

		config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');
		return config;
	},
};
export default config;
