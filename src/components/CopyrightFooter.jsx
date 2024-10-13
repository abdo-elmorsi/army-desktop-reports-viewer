import React from 'react';

const CopyrightFooter = () => {
	const openExternalLink = (event) => {
		event.preventDefault();
		window.ipcRenderer.invoke('open-external-link', 'https://elmorsi.vercel.app');
	};

	return (
		<p className="fixed text-xs bottom-1 left-2 rtl:left-auto rtl:right-2 dark:text-white">
			© Copyright:{' '}
			<a
				href="#"
				onClick={openExternalLink}
				className="text-primary hover:underline pointer-events-auto" // Ensure the link is clickable
			>
				Abdo
			</a>{' '}
			2024
		</p>
	);
};

export default CopyrightFooter;
