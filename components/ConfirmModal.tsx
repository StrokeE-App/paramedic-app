'use client';

import {useEffect} from 'react';
import {ReactNode} from 'react';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	children?: ReactNode;
	disabled?: boolean;
}

export default function ConfirmModal({isOpen, onClose, onConfirm, title, children, disabled = false}: ConfirmModalProps) {
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div data-testid="modal-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div data-testid="modal-content" className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
				<h2 className="text-xl font-bold mb-4">{title}</h2>
				{children}
				<div className="flex justify-end space-x-4 mt-6">
					<button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
						Cancelar
					</button>
					<button
						onClick={onConfirm}
						disabled={disabled}
						className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
}
