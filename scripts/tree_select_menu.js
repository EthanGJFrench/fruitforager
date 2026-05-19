export class TreeSelectMenu {
    constructor() {
        this.selectAllTrees = document.getElementById("selectAllTreesCheck")
        this.fruitOptions = document.querySelectorAll(".ff-fruit-option-check")

        this.selectAllTrees.addEventListener("change", () => {
            this.toggleSelectAll()
        })
    }

    toggleSelectAll() {
        this.fruitOptions.forEach(fruitOptionCheckbox => {
            fruitOptionCheckbox.checked = this.selectAllTrees.checked
        });
    }
}