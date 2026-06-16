
# FruitForager HighFidelity
**FruitForager interactive web-map application for BCDE213 assessmnet #2.**

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
        "Species": "Eucalyptus globulus (Maiden's Gum)", ---Important attribute required to find correct trees---
        "Genus": "Eucalyptus", ---Important attribute required to find correct trees--- 
        "IsHybrid": "No", 
        "IsRare": "No", 
        "CommonName": "Maiden's Gum", ---Important attribute required to find correct trees--- 
        "BotanicName": "globulus", ---Important attribute required to find correct trees---
        "Variety": null, 
        "Cultivar": null, 
        "SubSpecies": null, 
        "AccessionNumber": null, 
        "PlantedDate": null, 
        "ObservationDate": 
        "2000-06-21T12:00:00Z", 
        "DiameterAtBreastHeight": 1.1, 
        "Height": 18.0, ---Want to display this info in tree marker popup---
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
        "geometry": { ---Required for placing market on map - specifically the coordinates---.
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