const https = require('https');
const path = require('path');
const ImageGrid = require('./Components/ImageGrid');

function fetchPageHTML(username, pageNum, callback) {
  https.get(`https://vsco.co/${username}/images/${pageNum}`, res => {
    let data = '';
    // The data is received in chunks rather than all at once, so we need to
    // concatenate all the bits
    res.on('data', chunk => data += chunk);
    // Return the data when request is done
    res.on('end', () => {
      if (typeof callback === 'function') callback(data);
    });
    // Return an error if any occurs
  }).on("error", err => {
    if (typeof callback === 'function') callback(new Error(err));
  });
}

function getNamesFromFile(fileName) {
  // Fetch specified file with require to parse as json
  const pathName = path.join(__dirname, fileName);
  const usernames = require(pathName);
  return usernames.names;
}

function extractImageIDs(data, pageNum, limit = 0) {
  // At the end of each page, there is an array containing all ids of each picture
  // on the page. Use regex to filter this out from all page content, then access
  // capture group 1 of the regex to only get the array.
  // TL;DR: Get an array of the ids of all the images on the page
  const imgIDsReg = new RegExp(`\\"medias\\":\\{\\"${pageNum}\\":(\\[.*?\\])`);
  let result = JSON.parse(data.match(imgIDsReg)[1]);

  // If there is a limit to how many ids should be returned, get that amount
  // of elements and return the result.
  return limit > 0 ? result.slice(0, limit) : result;
}

function extractObjFromStrUsingStartindex(pageText, startIndex) {
  // On the page there is an object with the key "images", which contains info
  // about all the images. Now we loop through the page text one character at
  // a time, to find the matching "}" end bracket of the object.
  // TL;DR: Return the "images" object from current page
  let currentIndex = startIndex;
  let isObjectFound = false;
  let unmatchedBrackets = 0;

  while (!isObjectFound) {
    let char = pageText[currentIndex];

    if (char === '{') unmatchedBrackets += 1;
    else if (char === '}') unmatchedBrackets -= 1;

    if (unmatchedBrackets === 0) isObjectFound = true

    currentIndex += 1
  }

  return pageText.slice(startIndex, currentIndex);
}

function extractObjsFromStrUsingID(objStr, IDArr) {
  // The objStr is an object with key "images", where every image is stored in
  // an object with their id used as a key. So, get every image from "images"
  // using the array of image id's
  const obj = JSON.parse(objStr);
  const imagesDataArr = [];

  for (let id of IDArr) {
    imagesDataArr.push({
      'id': id,
      'data': obj['images'][id]
    });
  }

  return imagesDataArr;
}

function main() {
  // Later versions may include support for loading images from multiple pages
  let currentPage = 1;

  // There should be a cap, or else too many images are loaded at once and
  // slows down the whole process
  const maxImagesPerUser = 10;

  // Usernames will be stored in a separate json file to easily make any
  // updates to its content
  const usernames = getNamesFromFile('usernames.json');

  // maxImagesPerUser is extracted for every user specified in usernames.json
  for (let name of usernames) {
    // For every user we need to get the page content to work with
    fetchPageHTML(name, currentPage, pageText => {
      // Based on the response, we process the page text or inform about any error
      if (pageText instanceof Error) {
        throw new Error(pageText);
      } else {
        // Startindex will include the search value, so to exclude it so that
        // result starts with "{", we add search value length to startindex.
        // "entities" is a unique key in VSCO's data where info for all images is
        const searchValue = '"entities":';
        const match = pageText.match(new RegExp(searchValue));
        const startIndex = match.index + searchValue.length;
        const imagesWrapperObj = extractObjFromStrUsingStartindex(pageText, startIndex);

        // Get the array of unique image ID's from current page
        const imageIDs = extractImageIDs(pageText, currentPage, maxImagesPerUser);

        // Extract all data for each image based on the image ID's gathered
        const imagesData = extractObjsFromStrUsingID(imagesWrapperObj, imageIDs);

        // For every batch of images (from each username) we update the DOM to keep
        // the user from waiting until entire script is done executing
        ImageGrid.render(imagesData);
      }
    });
  }
}

// Call the main function when script is loaded
main();