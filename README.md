# Stream One Interactive Front End Project
 
## Single Page Web Application - PET STOP.

The purpose of the appliciation is to enable pet owners to quickly and easily locate pet services, or "Pet Stops", by location.

The main aims of the application are: 

1. To allow the user to search pre-defined pet services for any given location in the UK and Ireland.
2. Based upon the location entered, retrieve company location details, contact details, website links and reviews for any user selected company.
3. To be user friendly and simple to use.
4. To display the information in a clear and concise manner.

## Demo

A demo of the site is available at https://darchard1984.github.io/stream-one-interactive-front-end/index.html

## Getting Started/Deployment

* If you wish to run this site locally, please clone or download this repo. You can then run index.html or open index.html in your browser.
* If you wish to deploy a live version of this site, then you will need to create your own Github repo. Navigate to settings and enable Github Pages by setting the Source to master branch.
* If you wish to view the site via GitHub Pages, please copy the above URL into your browser. 

## Built With 

**HTML, CSS, SASS/SCSS, FLEXBOX, JAVASCRIPT, jQUERY, FONT-AWESOME, GOOGLE-FONTS, GOOGLE-MAPS/PLACES API, PHOTOSHOP, BALSAMIQ.**

## UX Design

Details of the UX design and research process is available in the repo "documentation" folder. The documents show how I approached the design of the site using the 5 layers approach. (Strategy, Structure,Scope, Skeleton, Surface). 

## Build Approach

1. I built the site using a Mobile First Approach much like the first project. However, unlike the first project in Stream-One. I decided not to use Bootstrap this time. I wanted to expand my knowledge of CSS and build everything from scratch, using Flexbox as the grid system for the project. 
2. I wanted the application to have a fun theme and be visually engaging from the outset. Choosing the right background image for the application became really important. Once in place, I could concentrate on building a skeleton for the application around the image, ready for data to be pulled into. 
3. The Google Places API is called to retreive data according to user input. The user has a choice of 6 Pet Stops to choose from, along with a location of their choosing. Data is populated dynamically below the landing page. Information includes company name, address, website, phone number, overall rating and reviews if available. 
4. I have tried to code the application defensively as possible. Taking into account user error when making decisions on functionality. 
5. All button styles, modal styles and colour schemes are my own. The main photo is from the online resource px-here.com and is a free to use asset.

The aim in eliminating Bootstrap usage was to push myself to write entirely my own CSS, using SASS/SCSS to achieve this. When approaching JavaScript, I decided to use vanilla JS to code as much of the "functional" aspects of the application (API calls etc) as possible. Then use jQuery to implement JS UI events and effects. The aim was to combine the two and get a handle on both approaches to client side scripting. 

I used http://pleeease.io/play/ to generate vendor prefixes once the coding of the appplication was complete. This allowed me to concentrate on writing clean SCSS until the end of the project and ready for submission/deployment.

## Testing

Manual and technical testing of the site was undertaken and passed. 

1. Chrome/Firefox dev tools was used throughout to test responsiveness and function.
2. Testing the site across different devices in real world scenarios. Mobiles, Tablets, Laptops, and Desktops.
3. Giving the applcation to third party users to get feedback, and see if they could "break" the application.
4. W3C code validator to pass HTML, CSS and JS.
5. I tested the application across multiple desktop browsers including Firefox, Chrome, Opera and Safari and all is well with these browsers. However, I am aware of some styling issues with IE and Edge.

## Authors

**Dafydd Archard** - this site was created as part of Code Institute's Web Development Online Full-Stack Course in February 2018.

## Acknowledgments

1. jQuery
2. http://pleeease.io/play/
3. w3c Validator service
4. Google Fonts
5. https://pxhere.com/
6. Font-awesome
7. Stack Overflow
8. Google Maps - Places API






