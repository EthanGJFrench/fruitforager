export default function stopVideoOnModalClose() {

    const TUTORIAL_MODAL = document.getElementById("tutorialVideoModal")
    const TUTORIAL_VIDEO = document.getElementById("tutorialVideo")

    if (!TUTORIAL_MODAL || !TUTORIAL_VIDEO) {
        console.error("Tutorial modal or video not found")
        return
    }

    TUTORIAL_MODAL.addEventListener("hidden.bs.modal", () => {
        TUTORIAL_VIDEO.pause()
        TUTORIAL_VIDEO.currentTime = 0
    })
}