'use client';

import React, {useState, useRef, useEffect} from 'react';

interface Option {
	id: string;
	name: string;
}

interface SearchableSelectProps {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	label: string;
	placeholder?: string;
	disabled?: boolean;
}

export default function SearchableSelect({options, value, onChange, label, placeholder = 'Buscar...', disabled = false}: SearchableSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()));

	const selectedOption = options.find((option) => option.id === value);

	return (
		<div className="relative" ref={wrapperRef}>
			<label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
			<div className={`relative border border-gray-300 rounded-md shadow-sm ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
				<div
					className={`flex items-center justify-between p-2 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
					onClick={() => !disabled && setIsOpen(!isOpen)}
				>
					<span className="block truncate">{selectedOption ? selectedOption.name : placeholder}</span>
					<svg
						className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180 text-customRed fill-customRed' : ''}`}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</div>

				{isOpen && (
					<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
						<div className="p-2">
							<input
								type="text"
								className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
								placeholder={placeholder}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
						<div className="max-h-60 overflow-auto">
							{filteredOptions.length === 0 ? (
								<div className="px-4 py-2 text-gray-500">No se encontraron resultados</div>
							) : (
								filteredOptions.map((option) => (
									<div
										key={option.id}
										className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${value === option.id ? 'bg-red-50' : ''}`}
										onClick={() => {
											onChange(option.id);
											setIsOpen(false);
										}}
									>
										{option.name}
									</div>
								))
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
