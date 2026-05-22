import { TreeSelectMenu } from "./tree_select_menu.js";

/**
 * Handles the Interactive Map functionality.
 * 
 * @author: Ethan French
 * @version: 1.0
 */
export default class InteractiveMap {
    
    /**
     * Initalises the InteractiveMap.
     * 
     * Retrives the selectAllTrees checkbox DOM element.
     * Retrives all of the fruitOption checkbox DOM elements.
     * Adds toggleSelectAll() eventListenter to selectAllTrees checkbox DOM element.
     */
    constructor() {

        this.map = L.map('map', { zoomControl: false }).setView([-43.532, 172.636], 12);
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 15,
                minZoom: 10,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <br> “FruitForager” &copy; 2026 by <a href="https://github.com/EthanGJFrench">Ethan French</a><br> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a>.',
            }).addTo(this.map)
        
        this.treeSelectMenu = new TreeSelectMenu()
        this.treeSelectMenu.treeFilterForm.addEventListener("submit", (e) => {
            e.preventDefault()
            this.renderTrees()
            // select dropdown when submitted
            const DROPDOWN_BUTTON = document.getElementById("treeFilterDropdownBtn")
            const DROPDOWN = bootstrap.Dropdown.getOrCreateInstance(DROPDOWN_BUTTON)
            DROPDOWN.hide();
        })

        this.treeMarkers = []
    }

    normaliseString(string) {
        try {
            return string.replace(/\s+/g, "").toLowerCase()
        }
        catch (error) {
            console.error(`Cannot normalise ${string} of type ${typeof string}`)
        }
    }

    /**
     * Gets the JSON data from tree GeoJSON file. 
     * 
     * Uses a fetch promise to get the GeoJSON data.
     * Console logs an error if the fetch fails.
     * 
     * @returns {object, else console.error} retruns GeoJSON object with tree information, else console error if data cannot be fetched.
     */
    async getGeoJsonPromise() {
        try {
            const TREE_GEOJSON = await fetch("./geojson/tree_mock_data.geojson");
            return await TREE_GEOJSON.json();
        } catch (error) {
            console.error("Something went wrong - cannot get tree GeoJSON data!");
        }
    }

    addTreeToMap(tree) {
        const [LNG, LAT] = tree.geometry.coordinates; // get tree cordernates

        const MARKER = L.circleMarker([LAT, LNG], { // add marker to the map
            radius: 1,
        }).addTo(this.map)

        this.treeMarkers.push(MARKER) // add marker to list list of markers
    }

    async renderTrees() {
    
        this.treeMarkers.forEach(marker => { // remove existing markers before redrawing map
            this.map.removeLayer(marker)
        })
        
        const TREEFORMDATA = this.treeSelectMenu.getFormData() // get the tree select form data
        
        if (!TREEFORMDATA) { // if there is no form data -> show user an error and return
            console.error('No fruit trees selected!')
            return
        }

        const TREEFORMDATANORMALISED = TREEFORMDATA.map(treeOption => treeOption.replace(/\s+/g, "").toLowerCase()) // normalise the data by removing white space and changing all characters to lowercase
        const TREEDATA = await this.getGeoJsonPromise()

        TREEDATA.features.forEach(tree => { // Check each tree normalised CommonName property and add tree to map if it exist in formdata
            const TREECOMMONNAME = tree.properties.CommonName.replace(/\s+/g, "").toLowerCase()  
            if (TREEFORMDATANORMALISED.includes(TREECOMMONNAME)) {
                this.addTreeToMap(tree)
            }
        })
    }
}