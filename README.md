
# FruitForager Prototype Iteration 2
**This project is the second iteritive prototype for the FruitForager interactive webmap application for BCDE213 Assessmnet#2.**

## Coding conventions used.
### html class prefixes
An html class with a prefix of `ff-` represents a custon class.   

### Current issues with project
**This section outlines design and technical aspects of this iteration that are flawed or incomplete and should be addressed in the next iteration**
- Improve the applicaiton branding and visual design.
    - Needs a real logo.
    - Needs a better map design - current iteration uses default leaflet assets.
- Modularise BStrap import by only importing components that have been implemented - current iteration imports the whole BStrap file.
- SCSS is disorginised and needs to be refined/ modularised.
- Current iteration is only styled mobile devices - not yet responsive.
- Need to add copyright information in the home-page footer. 
- The map tree select checkbox options are very small - it needs to be larger.
- The small nav menu doesn't close when user clicks outside of it.

# AI Disclosure:
**This section discloses where AI has been used in the project and what the prompt was:** 
- "ff-" naming convention was created with the assistance of ChatGPT using the prompt "Give me some industry-standard ways to seperate bootstrap classes from your own custom classes".
- The TreeSelectMenu getFormData() method was created with the assistance of ChatGPT using the prompt "what are the best ways to retrieve data from HTML forms using JS?"