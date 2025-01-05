export function StrokeeLogo() {
	return (
		<div className="flex flex-col items-center gap-2">
			<svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-red-600" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
					fill="currentColor"
				/>
				<path d="M15 7H13V11H9V7H7V17H9V13H13V17H15V7Z" fill="currentColor" />
			</svg>
			<h1 className="text-red-600 text-2xl font-bold tracking-wider">STROKEE</h1>
		</div>
	);
}
