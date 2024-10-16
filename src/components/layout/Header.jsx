import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components';
import { FaMoon } from 'react-icons/fa';
import { MdOutlineWbSunny } from 'react-icons/md';
import { logoBase64 } from '../../assets';

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
            src={logoBase64}
						alt="Logo"
						className="h-14 w-14 rounded-full"
					/> {/* Replace with your logo path */}
				</Link>
				<div className='flex justify-center items-center flex-col'>
				<h2 className='m-0'>مديرية أمن كفر الشيخ</h2>
				<p className='m-0'>قسم تكنولوجيا المعلومات</p>
				</div>
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