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
        this.map = L.map('map', { zoomControl: false }).setView([-43.532, 172.636], 12) // create map.
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // add OpenStreetMap Tiles.
                maxZoom: 17,
                minZoom: 12,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <br> “FruitForager” &copy; 2026 by <a href="https://github.com/EthanGJFrench">Ethan French</a><br> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a>.',
            }).addTo(this.map)

        this.map.on("zoomend", () => { // add zoom event listener to the map.
                this.renderTrees()
        })

        this.treeSelectMenu = new TreeSelectMenu()
        this.treeSelectMenu.treeFilterForm.addEventListener("change", () => { // renders trees when form state changes. 
              this.renderTrees()
        })
        this.treeSelectMenu.treeFilterForm.addEventListener("reset", () => { 
            setTimeout(() => {
                this.renderTrees()
            }, 0)
        })

        this.treeMarkers = [] // stores the information of markers currently rendered on the map.
        this.renderTrees() // render once on map creation - prevents bugs when refreshing the page with the treeselect options being selected.
    }


    /**
     * Normalises a string by removing all whitespace and transforming characters to lowercase.
     *  
     * @throws { console error } If string pram cannot be normalised (prevents other datatypes from being used).
     *  @param { string } the string to be normalised .
     */
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
     * Uses a fetch promise to get the GeoJSON data.
     * Console logs an error if the fetch fails.
     * 
     * @throws { console error } If data be fetch fails. 
     * @return { object: tree GEOJSON } retruns GeoJSON object with tree information.
     */
    async getGeoJsonPromise() {
        try {
            const TREE_GEOJSON = await fetch("./geojson/fruit_trees.geojson")
            return await TREE_GEOJSON.json()
        } 
        catch (error) {
            console.error("Something went wrong - cannot get tree data!")
        }  
    }

    /**
     * Creates the markers on the leaflet map and controls their size based on the user's map zoom.
     * 
     * @param { tree } The tree GeoJSON object to be rendered on the map.
     * @param { zoom } The leaflet zoom of the map.
     * 
     * @return { Leaflet tree marker }
     */
    createTreeMarker(tree, zoom) { 

        const [LNG, LAT] = tree.geometry.coordinates
        const TREECOMMONNAME = this.normaliseString(tree.properties.CommonName)

        const MARKER_POPUP_CONTENT = 
            `
            <h3>${tree.properties.CommonName}</h3>
            <p>${tree.properties.Species}</p>
            <p>Location: ${LAT}, ${LNG}</p>
            <p>Tree age: ${tree.properties.AgeClass}</p>
            <p>Tree height: ${tree.properties.Height}M</p>
            <a href="https://www.google.com/maps?q=${LAT},${LNG}" target="_blank">
                <button class="btn btn-primary bg-gradient">Take me there!</button>
            </a>
            `

        const MAP_ZOOM = {
            12: 10,
            13: 14,
            14: 20,
            15: 30,
            16: 38,
            17: 44
        }

        const CLAMPED_ZOOM = Math.max(12, Math.min(17, zoom))

        const LOWER_ZOOM = Math.floor(CLAMPED_ZOOM)
        const UPPER_ZOOM = Math.ceil(CLAMPED_ZOOM)

        const LOWER_SIZE = MAP_ZOOM[LOWER_ZOOM]
        const UPPER_SIZE = MAP_ZOOM[UPPER_ZOOM]

        let size
        if (LOWER_ZOOM === UPPER_ZOOM || UPPER_SIZE === undefined) {
            size = LOWER_SIZE;
        } else {
            const t = CLAMPED_ZOOM - LOWER_ZOOM;
            size = LOWER_SIZE + (UPPER_SIZE - LOWER_SIZE) * t
        }

        const ICON = L.divIcon({
            className: "ff-tree-marker",
            html: `
                <div class="tree-marker-wrapper">
                    <img src="./assets/svgs/map_icons/${TREECOMMONNAME}.svg" />
                </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        })

        const marker = L.marker([LAT, LNG], {
            icon: ICON
        })

        marker.bindPopup(MARKER_POPUP_CONTENT, {
            autoClose: false,
            closeOnClick: true
        })

        marker.on("click", () => {
            this.map.panTo(marker.getLatLng())

            setTimeout(() => {
                marker.openPopup()
            }, 100)
        })

        return marker
    }

    /**
     * Adds leaflet tree markers to the map.
     * 
     * @param {tree} tree GeoJSON to be rendered on the map.
     */
    addTreeToMap(tree) {
        const ZOOM = this.map.getZoom()
        const MARKER = this.createTreeMarker(tree, ZOOM)
        MARKER.treeData = tree

        MARKER.addTo(this.map) // add marker to map.
        this.treeMarkers.push(MARKER) // push marker to the list of markers currently rendered on the map.
    }
    
    /**
     * Gets the users from data and renders the trees on the map.
     * 
     * @returns if no form data
     */
    async renderTrees() {

        this.treeMarkers.forEach(marker => { // remove old markers before each render.
            this.map.removeLayer(marker)
        }) 
        this.treeMarkers = [] // empty array of currently rendered markers.

        const TREEFORMDATA = this.treeSelectMenu.getFormData() // get current form data.

        if (!TREEFORMDATA) { // throw error if no form data.
            console.error('No fruit trees selected!')
            return
        }

        const TREEFORMDATANORMALISED = TREEFORMDATA.map(treeOption => this.normaliseString(treeOption))

        const TREEDATA = await this.getGeoJsonPromise() // get and iterate through each tree in dataset.
        TREEDATA.features.forEach(tree => {

            const TREECOMMONNAME = this.normaliseString(tree.properties.CommonName) // normalise the tree's CommonName value.

            if (TREEFORMDATANORMALISED.includes(TREECOMMONNAME)) { // add tree to map if commonname exists in form data.
                this.addTreeToMap(tree)
            }
        })
    }
}