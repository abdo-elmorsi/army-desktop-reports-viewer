export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#002768",
                hoverPrimary: "#002768cc",
            },
            keyframes: {
                "slide-left-to-right": {
                    "0%": { transform: "translateX(-220%)" }, // Start off-screen left
                    // "20%": { transform: "translateX(-50%)" },  // Moves quickly to near the center
                    "50%": { transform: "translateX(0%)" },    // Stays in the center
                    // "80%": { transform: "translateX(50%)" },    // Moves out of the center
                    "100%": { transform: "translateX(220%)" },  // Ends off-screen right
                },
            },
            animation: {
                "slide-left-to-right": "slide-left-to-right 5s ease-in-out infinite", // Adjusted duration for a slower effect
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
