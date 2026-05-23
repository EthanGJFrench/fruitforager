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
        
        this.map = L.map('map', { zoomControl: false }).setView([-43.532, 172.636], 12) // create map
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // add OpenStreetMap Tiles
                maxZoom: 15,
                minZoom: 10,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <br> “FruitForager” &copy; 2026 by <a href="https://github.com/EthanGJFrench">Ethan French</a><br> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a>.',
            }).addTo(this.map)
        this.map.on("zoomend", () => { // add zoom event listener to the map
                this.renderTrees()
        })

        this.treeSelectMenu = new TreeSelectMenu() // tree select menu dom and functionality
        this.treeSelectMenu.treeFilterForm.addEventListener("change", () => {
              this.renderTrees()
        })

        this.treeMarkers = [] // stores the information of markers currently rendered on the map  

        this.renderTrees() // render once on instatiation - prevents bugs when refreshing the page with the treeselect options being selected
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
        } 
        
        catch (error) {
            console.error("Something went wrong - cannot get tree GeoJSON data!");
        }  
    }

    getTreeColor(treeType) {
        
        switch (treeType) {

            case "apple":
                return "red"

            case "apricot":
                return "orange"
                
            case "crabapple":
                return "crimson"

            case "chestnut":
                return "saddlebrown"

            case "cherry":
                return "deeppink"

            case "olive":
                return "olive"

            case "peach":
                return "blue"

            case "pear":
                return "yellowgreen"

            case "plum":
                return "darkviolet"

            default:
                return "grey"
        }
    }

    renderTreeMarker(tree, zoom) {

        const [LNG, LAT] = tree.geometry.coordinates 
        const TREECOMMONNAME = this.normaliseString(tree.properties.CommonName)

        // conditionally render markers based on map zoom
        if (zoom <= 11) { // far zoom
            return L.circleMarker([LAT, LNG], {
                radius: 2,
                color: this.getTreeColor(TREECOMMONNAME)
            })
        }

        if (zoom >= 11 && zoom < 14) { // mid zoom
            return L.circleMarker([LAT, LNG], {
                radius: 6,
                color: this.getTreeColor(TREECOMMONNAME)
            })
        }
    
        const ICON = L.icon({ // close zoom
            iconUrl: `../../assets/svgs/map_icons/${TREECOMMONNAME}.svg`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        })

        return L.marker([LAT, LNG], {
            icon: ICON
        })
    }

    addTreeToMap(tree) { 
        const ZOOM = this.map.getZoom()
        const MARKER = this.renderTreeMarker(tree, ZOOM)
        MARKER.treeData = tree

        MARKER.addTo(this.map) // add marker to map
        this.treeMarkers.push(MARKER) 
    }

    async renderTrees() {

        this.treeMarkers.forEach(marker => { // remove old markers before each render
            this.map.removeLayer(marker)
        })
        this.treeMarkers = []

        const TREEFORMDATA = this.treeSelectMenu.getFormData() // get current form data

        if (!TREEFORMDATA) { // throw error if no form data
            console.error('No fruit trees selected!')
            return
        }

        const TREEFORMDATANORMALISED = TREEFORMDATA.map(treeOption => this.normaliseString(treeOption))

        const TREEDATA = await this.getGeoJsonPromise() // get and go through each tree in database*
        TREEDATA.features.forEach(tree => { 

            const TREECOMMONNAME = this.normaliseString(tree.properties.CommonName) // normalise the tree's CommonName value

            if (TREEFORMDATANORMALISED.includes(TREECOMMONNAME)) { // add tree to map if commonname exists in form data
                this.addTreeToMap(tree)
            }
        })
    }
}