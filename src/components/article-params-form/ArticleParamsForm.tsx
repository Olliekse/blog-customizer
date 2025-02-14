import { ArrowButton } from '../../ui/arrow-button';
import { Button } from '../../ui/button';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Select } from '../../ui/select/Select';
import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	OptionType,
	contentWidthArr,
} from '../../constants/articleProps';

import styles from './ArticleParamsForm.module.scss';
import { Separator } from '../../ui/separator/Separator';
import { RadioGroup } from '../../ui/radio-group';
import { useSidebar } from '../../hooks/useSidebar';

interface ArticleParamsFormProps {
	/** Callback function when styles are changed and applied */
	onStyleChange?: (settings: ArticleStateType) => void;
	/** Initial state for the form - defaults to defaultArticleState */
	initialState?: ArticleStateType;
	/** Whether the form starts opened or closed */
	defaultOpen?: boolean;
	/** Optional callback when sidebar closes */
	onClose?: () => void;
}

/**
 * ArticleParamsForm - A sidebar component for customizing article appearance
 *
 * Features:
 * - Two-state system (temporary and applied states)
 * - Click outside detection (via useSidebar)
 * - Escape key handling (via useSidebar)
 * - Responsive design
 */
export const ArticleParamsForm: React.FC<ArticleParamsFormProps> = ({
	onStyleChange,
	initialState = defaultArticleState,
	defaultOpen = false,
	onClose,
}): JSX.Element => {
	// Use our custom sidebar hook
	const { isOpen, buttonRef, contentRef, handleToggle } = useSidebar({
		defaultOpen,
		onClose,
	});

	// State management
	const [formState, setFormState] = useState<ArticleStateType>(initialState);
	const [appliedState, setAppliedState] = useState<ArticleStateType>(initialState);

	// Update handlers
	const updateFormState = (newState: Partial<ArticleStateType>): void => {
		setFormState((prevState) => ({
			...prevState,
			...newState,
		}));
	};

	const handleFontFamilyChange = (option: OptionType): void => {
		updateFormState({ fontFamilyOption: option });
	};

	const handleFontSizeChange = (option: OptionType): void => {
		updateFormState({ fontSizeOption: option });
	};

	const handleFontColorChange = (option: OptionType): void => {
		updateFormState({ fontColor: option });
	};

	const handleBackgroundColorChange = (option: OptionType): void => {
		updateFormState({ backgroundColor: option });
	};

	const handleWidthChange = (option: OptionType): void => {
		updateFormState({ contentWidth: option });
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		setAppliedState(formState);
		onStyleChange?.(formState);
	};

	const handleReset = (): void => {
		const newState = defaultArticleState;
		setFormState(newState);
		setAppliedState(newState);
		onStyleChange?.(newState);
	};

	// Apply styles effect
	useEffect((): void => {
		const mainElement = document.querySelector('main');
		if (!mainElement) return;

		const styles = {
			'--font-family': appliedState.fontFamilyOption.value,
			'--font-size': appliedState.fontSizeOption.value,
			'--font-color': appliedState.fontColor.value,
			'--container-width': appliedState.contentWidth.value,
			'--bg-color': appliedState.backgroundColor.value,
			backgroundColor: appliedState.backgroundColor.value,
		} as const;

		Object.entries(styles).forEach(([property, value]): void => {
			mainElement.style.setProperty(property, value);
		});
	}, [appliedState]);

	// Helper functions
	const getDefaultPlaceholder = (
		selected: OptionType,
		options: OptionType[],
		defaultText: string,
	): string => {
		if (selected) return selected.title;
		return options.length > 0 ? options[0].title : defaultText;
	};

	return (
		<>
			<div ref={buttonRef}>
				<ArrowButton isOpen={isOpen} onClick={handleToggle} />
			</div>

			<aside
				ref={contentRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}
			>
				<form className={styles.form} onSubmit={handleSubmit}>
					<h2 className={styles.title}>ЗАДАЙТЕ ПАРАМЕТРЫ</h2>

					<Select
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={handleFontFamilyChange}
						title="Шрифт"
						placeholder={getDefaultPlaceholder(
							formState.fontFamilyOption,
							fontFamilyOptions,
							'Выберите шрифт',
						)}
					/>

					<RadioGroup
						name="fontSize"
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={handleFontSizeChange}
						title="Размер шрифта"
					/>

					<Select
						options={fontColors}
						selected={formState.fontColor}
						onChange={handleFontColorChange}
						title="Цвет шрифта"
					/>

					<Separator />

					<Select
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={handleBackgroundColorChange}
						title="Цвет фона"
					/>

					<Select
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={handleWidthChange}
						title="Ширина контента"
					/>

					<div className={styles.bottomContainer}>
						<Button title="Сбросить" htmlType="reset" type="clear" onClick={handleReset} />
						<Button title="Применить" htmlType="submit" type="apply" />
					</div>
				</form>
			</aside>
		</>
	);
};
