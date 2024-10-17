export function formatComma(value, minimumFractionDigits = 3) {
    value = value ? parseFloat(value) : 0;
    return value.toLocaleString("en-US", {
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: Math.max(2, minimumFractionDigits),
    });
}
export function sum(arr, prop) {
    return arr.reduce((accumulator, object) => {
        return accumulator + (prop ? +object[prop] : object);
    }, 0);
}

// export const speakReportNumber = (reportNumber) => {
//     const speech = new SpeechSynthesisUtterance(); // Create a new SpeechSynthesisUtterance instance
//     speech.text = `بلاغ رقم ${reportNumber}`; // Set the text to read
//     speech.lang = "ar-SA"; // Set the language to Arabic
//     speech.rate = 0.8; // Adjust the rate of speech if needed
//     speech.pitch = 1; // Adjust the pitch of the speech if needed
//     window.speechSynthesis.speak(speech); // Speak the text
// };

export const speakReportNumber = async (reportNumber, timeout = 1000) => {
    try {
        const reportAudio = new Audio(`/src/assets/report-number.mp3`); // Adjust path if needed
        const numberAudio = new Audio(`/src/assets/${reportNumber}.mp3`); // Adjust path if needed

        // Play "report-number" audio first
        await reportAudio.play();

        // Optional delay between the audios if needed
        await new Promise((resolve) => setTimeout(resolve, timeout));

        // Play the report number audio
        await numberAudio.play();
    } catch (error) {
        console.error("Error playing audio:", error);
    }
};

