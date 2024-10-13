import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components';
import { FaMoon } from 'react-icons/fa';
import { MdOutlineWbSunny } from 'react-icons/md';

const Header = () => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';
		setDarkMode(savedDarkMode);
	}, []);


	const toggleDarkMode = () => {
		setDarkMode((prevMode) => {
			const newMode = !prevMode;
			localStorage.setItem('darkMode', newMode.toString());
			document.documentElement.classList.toggle('dark', newMode);
			return newMode;
		});
	};

	return (
		<header className="bg-primary text-white p-4 py-3 shadow-md flex items-center justify-between">
			<div className="flex items-center justify-start gap-4">
				<Link to="/" className="text-xl font-bold flex items-center">
					<img
						src="data:image/jpeg;base64,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"
						alt="Logo"
						className="h-14 w-14 rounded-full"
					/> {/* Replace with your logo path */}
				</Link>
				<h2 className='m-0'>مديرية أمن كفر الشيخ</h2>
			</div>

			<Button
				onClick={toggleDarkMode}
				className="btn-primary flex justify-center items-center"
			>
				{darkMode ? (
					<MdOutlineWbSunny className='text-yellow-500' />
				) : (
					<FaMoon />

				)}
			</Button>
		</header>
	);
};

export default Header;