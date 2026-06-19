

# FruitForager interactive web-map application for BCDE213 assessmnet #2

## Coding conventions used.
### html class prefixes
An html class with a prefix of `ff-` represents a custon class. `ff-` classes are placed in the end of the `class` attribute after other classes - such as Bootstrap and Leaflet classes.

### Error naming conventions
Custom programmatic or frontend error messages will follow a consistent naming convention by ending with an exclamation mark (`!`). This helps clearly distinguish custom application errors from standard browser, framework, or system-generated errors.

## Use of mock data
This application uses mock tree data. The mock data matches the same geojson feature structure as found in the original Christchurch City Council tree dataset. Using mock data during development allows application features such as map rendering, filtering, popup generation. 

``` GeoJSON example from CCC trees dataset w/ annotations
{
"type": "FeatureCollection",
"name": "Tree",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
    { "type": "Feature", 
    "properties": { 
        "TreeID": 1,  
        "ServiceStatus": "Current", 
        "Ownership": "Private", ---Important - I only want to show publically available trees--- 
        "LocationCertainty": "Approximate XY", 
        "AgeClass": "Mature", ---Important - only want to show mature trees---
        "Protection": "Subdivision", 
        "TargetFrequency": "Perpetual Use", 
        "IDSRevisionNumber": null, 
        "Species": "Eucalyptus globulus (Maiden's Gum)",
        "Genus": "Eucalyptus", 
        "IsHybrid": "No", 
        "IsRare": "No", 
        "CommonName": "Maiden's Gum",
        "BotanicName": "globulus", 
        "Variety": null, 
        "Cultivar": null, 
        "SubSpecies": null, 
        "AccessionNumber": null, 
        "PlantedDate": null, 
        "ObservationDate": 
        "2000-06-21T12:00:00Z", 
        "DiameterAtBreastHeight": 1.1, 
        "Height": 18.0,
        "CrownSpread": 12.0, 
        "AssetLongDescription": null, 
        "Comment": null, 
        "SiteName": null, 
        "Photo": "<table><tr><td></td></tr></table>", 
        "SAPInternalReference": "IE000000000011209303", 
        "IDSCATID": null, 
        "ContractorExternalReference": null, 
        "CreateDate": null, 
        "LastEditDate": "2023-02-16T22:47:26Z" }, 
        "geometry": {
            "type": "Point", 
            "coordinates": [ 172.570298970250491, -43.598559320163552 ] } }
    ]
}
```

## AI Disclosure:
**This section discloses where AI has been used in the project and what the prompt**
- The "ff-" naming convention was created with the assistance of ChatGPT using the prompt "Give me some industry-standard ways to separate bootstrap classes from your own custom classes."
- The TreeSelectMenu getFormData() method was created with the assistance of ChatGPT using the prompt "what are the best ways to retrieve data from HTML forms using JS?"
- The regex used to help normalise data by removing whitespace in the InteractiveMap class was created with ChatGPT using the prompt "Generate a regex for the JS .replace() method that removes all whitespace from a string".
- The renderTreeMarker() function was refactored with the assistance of chat gpt using the prompt: "I am using leaflet to create a map that marks the location of fruit trees on a map. My current solution changes the marker size based on the map zoom (larger markers when zoomed, smaller markers when zoomed out). The current issue is the all markers are destoryed when the size is changed. This is inefficent and makes the map crash. How can I render the markers once but dynamically change the size? here is my current solution for reference: 
`
    renderTreeMarker(tree, zoom) {
        const [LNG, LAT] = tree.geometry.coordinates 
        const TREECOMMONNAME = this.normaliseString(tree.properties.CommonName)

        // conditionally render markers based on map zoom
        if (zoom <= 13) {
            return L.circleMarker([LAT, LNG], {
                radius: 1,
                color: this.getTreeColor(TREECOMMONNAME)
            })
        }

        if (zoom === 14) {
            return L.circleMarker([LAT, LNG], {
                radius: 2,
                color: this.getTreeColor(TREECOMMONNAME)
            })
        }
        
        // Render interactive icon marker when zoomed in
        const MARKER_ICON = `./assets/svgs/map_icons/${TREECOMMONNAME}.svg`
        const MARKER_POPUP_CONTENT = 
        `
        <h3>${tree.properties.CommonName}</h3>
        <p>Location: ${LAT}, ${LNG}</p>
        <p>Tree age: ${tree.properties.AgeClass}</p>
        <p>Tree height: ${tree.properties.Height}M</p>
        <a href="https://www.google.com/maps?q=${LAT}, ${LNG}" target="_blank">
            <button class="btn btn-primary bg-gradient">Take me there!</button>
        </a>
        `
        if (zoom === 15) {
            const ICON = L.icon({
                iconUrl: MARKER_ICON,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                className: "ff-tree-marker-icon"
            })
            
            let marker = L.marker([LAT, LNG], {
                icon: ICON
            })
            
            marker.bindPopup(MARKER_POPUP_CONTENT, { // add tree popup information
                autoClose: false,
                closeOnClick: false
            })
            marker.on("click", () => {
                this.map.panTo(marker.getLatLng())
                setTimeout(() => { // prevent the popup from opening before the map has panned which causes the popup to close
                    marker.openPopup()
                }, 100)
            })
            
            return marker
        }

        if (zoom === 16) {
            const ICON = L.icon({ // close zoom
                iconUrl: MARKER_ICON,
                iconSize: [36, 36],
                iconAnchor: [18, 18],
                className: "ff-tree-marker-icon"
            })

            let marker = L.marker([LAT, LNG], {
                icon: ICON
            })

            marker.bindPopup(MARKER_POPUP_CONTENT, { // add tree popup information
                closeOnClick: false
            })
            marker.on("click", () => {
                this.map.panTo(marker.getLatLng())
                setTimeout(() => { // prevent the popup from opening before the map has panned which causes the popup to close
                    marker.openPopup()
                }, 100)
            })
            
            return marker
        }

        if (zoom === 17) {
            const ICON = L.icon({ // close zoom
                iconUrl: `./assets/svgs/map_icons/${TREECOMMONNAME}.svg`,
                iconSize: [44, 44],
                iconAnchor: [21, 21],
                className: "ff-tree-marker-icon"
            })

            let marker = L.marker([LAT, LNG], {
                icon: ICON
            })

            marker.bindPopup(MARKER_POPUP_CONTENT, { // add tree popup information
                autoClose: false,
                closeOnClick: false
            })
            marker.on("click", () => {
                this.map.panTo(marker.getLatLng())
                setTimeout(() => { // prevent the popup from opening before the map has panned which causes the popup to close
                    marker.openPopup()
                }, 100)
            })

            return marker
        }
    }
`"