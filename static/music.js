const cards = document.querySelectorAll(".card");

let currentAudio = null;

cards.forEach(card => {

    const musicPath = card.dataset.music;

    if (!musicPath) return;

    const audio = new Audio(musicPath);

    // Précharge la musique
    audio.preload = "auto";

    // Commence à charger immédiatement
    audio.load();

    card.addEventListener("mouseenter", () => {

        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = audio;

        audio.currentTime = 0;

        audio.play().catch(error => {
            console.log("Lecture impossible :", error);
        });
    });

    card.addEventListener("mouseleave", () => {

        audio.pause();
        audio.currentTime = 0;

        if (currentAudio === audio) {
            currentAudio = null;
        }
    });
});