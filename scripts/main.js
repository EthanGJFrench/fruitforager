import InteractiveMap from "./interactive_map_page/interactive_map.js" 
import stopVideoOnModalClose from "./modal.js" 

try { 
    stopVideoOnModalClose()
    
} catch (error) {}

try { 
    let map = new InteractiveMap() 
} 
catch (error) {}