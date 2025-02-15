import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSidebarProps {
	defaultOpen?: boolean;
	onClose?: () => void;
}

interface UseSidebarReturn {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	buttonRef: React.RefObject<HTMLDivElement>;
	contentRef: React.RefObject<HTMLElement>;
	handleToggle: () => void;
}

/**
 * Custom hook for managing sidebar behavior
 *
 * Features:
 * - Toggle sidebar state
 * - Click outside detection
 * - Escape key handling
 * - Refs for button and content
 */
export const useSidebar = ({ defaultOpen = false, onClose }: UseSidebarProps): UseSidebarReturn => {
	// State for sidebar open/close
	const [isOpen, setIsOpen] = useState(defaultOpen);

	// Refs for click outside detection
	const buttonRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLElement>(null);

	// Memoized toggle handler
	const handleToggle = useCallback((): void => {
		const newIsOpen = !isOpen;
		setIsOpen(newIsOpen);
		if (!newIsOpen && onClose) {
			onClose();
		}
	}, [isOpen, onClose]);

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!isOpen) return;

			const target = e.target as Node;

			// Check for clicks in dropdowns
			const selectDropdowns = document.querySelectorAll('[data-testid="selectDropdown"]');
			const isClickInDropdown = Array.from(selectDropdowns).some((dropdown) =>
				dropdown.contains(target),
			);

			if (isClickInDropdown) return;

			// Check if click is outside sidebar and button
			const isClickOutside =
				contentRef.current &&
				!contentRef.current.contains(target) &&
				buttonRef.current &&
				!buttonRef.current.contains(target);

			if (isClickOutside) {
				setIsOpen(false);
				onClose?.();
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [isOpen, onClose]);

	// Escape key handler
	useEffect(() => {
		const handleEscapeKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				setIsOpen(false);
				onClose?.();
			}
		};

		document.addEventListener('keydown', handleEscapeKey);
		return () => document.removeEventListener('keydown', handleEscapeKey);
	}, [isOpen, onClose]);

	return {
		isOpen,
		setIsOpen,
		buttonRef,
		contentRef,
		handleToggle,
	};
};
