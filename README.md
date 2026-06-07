
# FruitForager Prototype Iteration 2
**This project is the second iteritive prototype for the FruitForager interactive webmap application for BCDE213 Assessmnet#2.**

## Coding conventions used.
### html class prefixes
An html class with a prefix of `ff-` represents a custon class. `ff-` classes are placed in the end of the `class` attribute after other classes - such as Bootstrap and Leaflet classes.

### Custom errors
Custom errors created by (programatic, UI etc) all end with a `!`. Example; `console.error("Something went wrong!")`

## Current issues with project
**This section outlines design and technical aspects of this iteration that are flawed or incomplete and should be addressed in the next iteration**
- Improve the applicaiton branding and visual design.
    - Needs a real logo.
    - Needs a better map design - current iteration uses default leaflet assets.
- Modularise BStrap import by only importing components that have been implemented - current iteration imports the whole BStrap file.
- SCSS is disorginised and needs to be refined/ modularised.
- Current iteration is only styled for mobile devices. The app is not yet responsive.
- The filter tree element dropdown does not have an open or close animation.
- The small nav menu doesn't close when user clicks outside of it.
- Uses mock/fake tree geojson data created with AI.

## Use of mock data
This prototype uses tree mock data. The mock data matches the same geojson feature structure as found in the original Christchurch City Council tree dataset. Using mock data during development allowed application features such as map rendering, filtering, popup generation.

``` GeoJSON - Data analysis for mock data, with comments
{
"type": "FeatureCollection",
"name": "Tree",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
    { "type": "Feature", 
    "properties": { 
        "TreeID": 1,  
        "ServiceStatus": "Current", 
        "Ownership": "Private", // Important - I only want to show publically available trees 
        "LocationCertainty": "Approximate XY", 
        "AgeClass": "Mature", 
        "Protection": "Subdivision", 
        "TargetFrequency": "Perpetual Use", 
        "IDSRevisionNumber": null, 
        "Species": "Eucalyptus globulus (Maiden's Gum)",
        "Genus": "Eucalyptus", 
        "IsHybrid": "No", 
        "IsRare": "No", 
        "CommonName": "Maiden's Gum", // Common name will the primary property used to determine the type of fruit tree. 
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
        "geometry": { // Required for placing market on map.
            "type": "Point", 
            "coordinates": [ 172.570298970250491, -43.598559320163552 ] } }
    ]
}
```

## AI Disclosure:
**This section discloses where AI has been used in the project and what the prompt was:** 
- "ff-" naming convention was created with the assistance of ChatGPT using the prompt "Give me some industry-standard ways to seperate bootstrap classes from your own custom classes".
- The TreeSelectMenu getFormData() method was created with the assistance of ChatGPT using the prompt "what are the best ways to retrieve data from HTML forms using JS?"
- The mock data this prototype uses was created with ChatGPT using the prompt "Generate geojson with the following requirements - The geojson exists within the following GEOJSON format {GEOJSON EXAMPLE}: 
- The regex used to help normalise data by removing whitespace in the InteractiveMap class was created with ChatGPT using the prompt "Generate a regex for the JS .replace() method that removes all whitespace from a string".