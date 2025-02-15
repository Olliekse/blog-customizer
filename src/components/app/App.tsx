import { CSSProperties, useState } from 'react';

import { Article } from '../article/Article';
import { ArticleParamsForm } from '../article-params-form/ArticleParamsForm';
import { defaultArticleState, ArticleStateType } from '../../constants/articleProps';

import styles from './App.module.scss';

export const App = () => {
	const [articleDisplayState, setArticleDisplayState] =
		useState<ArticleStateType>(defaultArticleState);

	return (
		<main
			className={styles.main}
			style={
				{
					'--font-family': articleDisplayState.fontFamilyOption.value,
					'--font-size': articleDisplayState.fontSizeOption.value,
					'--font-color': articleDisplayState.fontColor.value,
					'--container-width': articleDisplayState.contentWidth.value,
					'--bg-color': articleDisplayState.backgroundColor.value,
					backgroundColor: articleDisplayState.backgroundColor.value,
				} as CSSProperties
			}
		>
			<ArticleParamsForm onStyleChange={setArticleDisplayState} />
			<Article />
		</main>
	);
};
