/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./resources/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "dark-border-start": "#4578a5",
                "dark-border-end": "#517090",
                "dark-bg-start": "#010106",
                "dark-bg-end": "#000000",
                "dark-grad-blue-start": "#4b75bc",
                "dark-grad-blue-end": "#0f2132",
                "dark-inset-start": "#2f497d",
                "dark-inset-end": "#182b54",
                "dark-text-white": "#e8ffff",
                "dark-text-yellow": "#f8e7ba",

                "box-green": "#42abad",
                "badge-gray": "#434a5b",
                "badge-gray-border": "#303849",
                "box-gray": "#1b1d2f",
                "box-gray-text": "#a9aaab",
                "grow-green-text": "#dbeaed",
                "grow-green-text-alt": "#b1ffe8",
                "grow-green-grad": "#05774e",
                "text-blue": "#24c4ef",
                caption: "#a8a8ac",

                "legendary-strong": "#ff8c29",
                "legendary-weak": "#532f14",
                "legendary-grad-start": "#97361a",
                "legendary-grad-end": "#371f10",

                "rare-strong": "#ad50fe",
                "rare-weak": "#452570",
                "rare-grad-start": "#3f2266",
                "rare-grad-end": "#1d1235",

                "standard-strong": "#3585d2",
                "standard-weak": "#204d80",
                "standard-grad-start": "#173356",
                "standard-grad-end": "#111d38",

                "blue-bg-start": "#090b1b",
                "blue-bg-end": "#0e1634",

                "btn-blue-border": "#587fac",
                "btn-blue-bg": "#1e2840",
                "btn-blue-text": "#afc8ff",

                "btn-yellow-border": "#aa9571",
                "btn-yellow-bg": "#2a364a",
                "btn-yellow-text": "#f9e4ad",

                "btn-red-border": "#dd564a",
                "btn-red-bg": "#252737",
                "btn-red-text": "#ff4746",

                "weapon-btn-bg": "#102231",
                "weapon-btn-border-1": "#dbe1e5",
                "weapon-btn-border-2": "#5d7d94",
                "weapon-btn-bg-hover": "#0e1b26",
                "weapon-btn-border-1-hover": "#b0a6a3",
                "weapon-btn-border-2-hover": "#fac843",

                "input-border": "#6d7a8e",
                "input-bg": "#101011",
                "input-label": "#20bde5",
                "input-placeholder": "#b4cfd6",

                "modal-tick": "#fefeff",
                "modal-border": "#61656e",
                "modal-bg": "#b1d1dc",
                "modal-content": "#697381",
                "modal-title": "#20cbf7",
                "modal-text": "#bbd9e3",
            },
        },
    },
    plugins: [],
};
