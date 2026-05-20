/** 
 * Handles the fruit filter selection functionality.
 * 
 * @author: Ethan French
 * @version: 1.0
 */
export class TreeSelectMenu { 
    
    /**
     * Initalises the tree select menu.
     * 
     * Retrives the selectAllTrees checkbox DOM element.
     * Retrives all of the fruitOption checkbox DOM elements.
     * Adds toggleSelectAll() eventListenter to selectAllTrees checkbox DOM element. 
     */
    constructor() {
        // Get DOM elements
        this.selectAllTrees = document.getElementById("selectAllTreesCheck")
        this.fruitOptions = document.querySelectorAll(".ff-fruit-option-check")
        this.treeFilterForm = document.getElementById("treeFilterForm")

        // add event listeners to DOM elements
        this.selectAllTrees.addEventListener("change", () => {
            this.toggleSelectAll()
        })

        this.treeFilterForm.addEventListener("submit", (e) => {
            e.preventDefault() // prevent page from refreshing
            this.getFormData()
        })
    }

    /**
     * Toggles all fruit option checkboxes to make current state of selectAllTrees checkbox.
     */
    toggleSelectAll() {
        this.fruitOptions.forEach(fruitOptionCheckbox => {
            fruitOptionCheckbox.checked = this.selectAllTrees.checked
        });
    }

    /**
     * Gets select fruit filter values from the tree filter form.
     * 
     * @returns {strings[]} An array containing the selected fruit values.
     */
    getFormData() {
        const formData = new FormData(this.treeFilterForm)
        const selectedFruit = formData.getAll("fruit")

        console.log(selectedFruit) // temp
        return selectedFruit
    }
}