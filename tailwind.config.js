/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#002768",
                hoverPrimary: "#002768cc",
            },
            animation: {
                "ping-slow": "ping 3s linear infinite",
                "ping-fast": "ping 1s linear infinite",
            },
        },
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
};
