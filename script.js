const imgContainer = document.getElementById('image');
const loader = document.getElementById('loader');

let ready = false; // when the page first loads, we want it to be false.
let imagesLoaded = 0; // number of images loaded.
let totalImages = 0; // total images loaded in the page, when the page is done loading.
let photoArray = [];

// Unsplash API
const count=30;
const apiKey = 'M8JpRkSVxjZ-zZaahr437coBGU2ZxQnPxIr4rRVuAs8';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

function imageLoaded()
{
    console.log('Image Loaded');
    imagesLoaded++; // each time an image loads, the counter increases.
    console.log(imagesLoaded);
    if(imagesLoaded === totalImages)
    {
        ready = true;
        loader.hidden = true; // hide the loader when images are loaded.
        console.log('ready = ', ready); // once the number of images loaded = total number of images, we will log the value of ready.
    }
}



//Helper function  to set attributes on DOM elements i.e setting a function so that we dont have to repeat setAttribute function.
function setAttributes(element , attributes)    // element is the item and img element
{
    for ( const key in attributes){      // to loop through each of the attribute we are going to set by assigning key ( href, target, src, alt, title) in attributes ( object containing both key:value) we want to set.
        element.setAttribute(key, attributes[key]);
         
    }
}
// Create Elements for links and photos and add that to DOM
function display()
{
    imagesLoaded = 0;   // we need to set our imagesLoaded value to 0 everytime we are running this function display() so that imagesLoaded = 30
    totalImages = photoArray.length; // number of objects within the array.
    console.log('totalImages = ', totalImages);
    // Run functions for each object in Photos array (photos[])
    photoArray.forEach((photo) => {
            const item = document.createElement('a'); // create blank anchor element
            setAttributes(item, {
                href: photo.links.html,
                target: '_blank'
            });
            // create <img> for photo
            const img = document.createElement('img'); // creating image element.
            setAttributes(img, {
                src: photo.urls.regular,
                alt: photo.description,
                title: photo.alt_description
            });
            // Adding event listeners to check when each image has finished loading.
            img.addEventListener('load', imageLoaded);  // when image will be loaded, call the imageLoaded() function defined above.

            // Put <img> inside the <a> element, then put both inside our image container element
            item.appendChild(img); // item is the parent element and img is the child.
            imgContainer.appendChild(item); // img-container parent elemnt of item. ( img-container -> item -> img)
        });
}
// For each element in the array of Photos received from Unsplash api, we are going to run this function. We are going to create an item, create an img,
// put img into our item and then in container.


// Get Photos from Unsplash API
async function getPhotos()
{
    try {
        const response = await fetch(apiUrl);   // fetch from the url and wait for a response.
        photoArray = await response.json();   // store the response in data as json.
        display();
    } catch (error) {
        // Log error
    }
}

// Check to see if scrolling near bottom of the page loads more images.
window.addEventListener('scroll', ()=>{
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight-1000 && ready)  //window.innerHeight -> total height of the browser window. window.scrollY -> dist from top of the page, the user has scrolled. We need to subtract 1000px from the offsetHeight( height of everything in the body, including what is not within the view, i.e, the height of the whole page.) to trigger the scroll event before the bottom of the page is reached and set ready = true.
    {
        ready = false; // we will set ready= false once this statement runs so that it will be ready again, imagesLoaded = totalimages.
        getPhotos();
        console.log('Load More.....'); 
    }
})

// On page load call this function.
getPhotos();