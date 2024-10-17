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
                    "0%": { transform: "translateX(-100%)", color: "#fef08a" }, // Start off-screen left
                    "25%": { transform: "translateX(-25%)", color: "#fef08a" }, // Stays in the center
                    "50%": { transform: "translateX(0%)", color: "#FFF" }, // Stays in the center
                    "75%": { transform: "translateX(25%)", color: "#fef08a" }, // Stays in the center
                    "100%": { transform: "translateX(100%)", color: "#fef08a" }, // Ends off-screen right
                },
            },
            animation: {
                "slide-left-to-right":
                    "slide-left-to-right 5s ease-in-out infinite", // Adjusted duration for a slower effect
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
