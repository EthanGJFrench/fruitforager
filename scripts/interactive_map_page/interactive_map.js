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
                maxZoom: 17,
                minZoom: 12,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <br> “FruitForager” &copy; 2026 by <a href="https://github.com/EthanGJFrench">Ethan French</a><br> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a>.',
            }).addTo(this.map)
        this.map.on("zoomend", () => { // add zoom event listener to the map
                this.renderTrees()
        })

        this.treeSelectMenu = new TreeSelectMenu()
        this.treeSelectMenu.treeFilterForm.addEventListener("change", () => { // renders tree options when form state changes
              this.renderTrees()
        })
        this.treeSelectMenu.treeFilterForm.addEventListener("reset", () => { // resets the form when
            setTimeout(() => {
                this.renderTrees()
            }, 0)
        })

        this.map.on('zoomend', () => { // TEMP!
            console.log('Zoom:', this.map.getZoom())
        })

        this.treeMarkers = [] // stores the information of markers currently rendered on the map  
        this.renderTrees() // render once on map creation - prevents bugs when refreshing the page with the treeselect options being selected
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
     * @return {object: tree GEOJSON, else console.error} retruns GeoJSON object with tree information, else console error if data cannot be fetched.
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

    renderTreeMarker(tree, zoom) {

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

    const clampedZoom = Math.max(12, Math.min(17, zoom))

    const lowerZoom = Math.floor(clampedZoom)
    const upperZoom = Math.ceil(clampedZoom)

    const lowerSize = MAP_ZOOM[lowerZoom]
    const upperSize = MAP_ZOOM[upperZoom]

    let size
    if (lowerZoom === upperZoom || upperSize === undefined) {
        size = lowerSize;
    } else {
        const t = clampedZoom - lowerZoom;
        size = lowerSize + (upperSize - lowerSize) * t
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

    addTreeToMap(tree) {
        const ZOOM = this.map.getZoom()
        const MARKER = this.renderTreeMarker(tree, ZOOM)
        MARKER.treeData = tree

        MARKER.addTo(this.map) // add marker to map
        this.treeMarkers.push(MARKER) // push marker to the list of markers currently rendered on the map
    }
    
    async renderTrees() {

        this.treeMarkers.forEach(marker => { // remove old markers before each render
            this.map.removeLayer(marker)
        }) 
        this.treeMarkers = [] // empty array of currently rendered markers

        const TREEFORMDATA = this.treeSelectMenu.getFormData() // get current form data

        if (!TREEFORMDATA) { // throw error if no form data
            console.error('No fruit trees selected!')
            return
        }

        const TREEFORMDATANORMALISED = TREEFORMDATA.map(treeOption => this.normaliseString(treeOption))

        const TREEDATA = await this.getGeoJsonPromise() // get and iterate through each tree in dataset
        TREEDATA.features.forEach(tree => {

            const TREECOMMONNAME = this.normaliseString(tree.properties.CommonName) // normalise the tree's CommonName value

            if (TREEFORMDATANORMALISED.includes(TREECOMMONNAME)) { // add tree to map if commonname exists in form data
                this.addTreeToMap(tree)
            }
        })
    }
}