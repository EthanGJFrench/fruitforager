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
     * Adds tree select functions to relevant DOM elements.
     */
    constructor() {
        // get DOM elements
        this.selectAllTrees = document.getElementById("selectAllTreesCheck")
        this.fruitOptions = document.querySelectorAll(".ff-fruit-option-check")
        this.treeFilterForm = document.getElementById("treeFilterForm")
        // add event listeners to DOM elements
        this.selectAllTrees.addEventListener("change", () => {
            this.toggleSelectAll()
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
     * @returns { string[], else null } Array of selected friut from the dropdown element, else null.
     */
    getFormData() {
        const FORMDATA = new FormData(this.treeFilterForm)
        const SELECTEDFRUIT = FORMDATA.getAll("fruit")
        if (SELECTEDFRUIT.length > 0 && Array.isArray(SELECTEDFRUIT)) {
            return SELECTEDFRUIT
        }
        else {
            return null
        }
    }
}