// DOM elements
const menu = document.getElementById('menu');
const globeContainer = document.getElementById('globe-container');
const backBtn = document.getElementById('back-btn');
const planetContainer = document.getElementById('planet-container');
let globeInstance = null;
let autoRotate = document.getElementById('auto-rotate');
let autoRotateCheck = false;
const planetInfoPanel = document.getElementById('planet-info');

const infoIcon = document.getElementById('info-icon');
const searchBar = document.getElementById('search-bar')

let planetPanels = [];

// Class to handle creation of globe panels
class GlobePanel {
  constructor(name, texture, imageSrc) {
    this.name = name;
    this.texture = texture;
    this.imageSrc = imageSrc; // Update image source to point to planetFaces folder
  }

  // Method to create the HTML structure of the panel
  createPanel() {
    const panel = document.createElement('div');
    panel.classList.add('planet-panel');
    panel.setAttribute('data-name', this.name);

    const planetTitle = document.createElement('h2');
    planetTitle.textContent = this.name;
    panel.appendChild(planetTitle);

    const planetImage = document.createElement('img');
    planetImage.src = this.imageSrc; // Use the dynamically set image source
    planetImage.alt = this.name;
    panel.appendChild(planetImage);

    const planetButton = document.createElement('button');
    planetButton.textContent = `View ${this.name}`;
    panel.appendChild(planetButton);

    // Add event listener to the button
    planetButton.addEventListener('click', () => {
      showGlobe(this.texture);
      showPlanetInfo(this.name); // Show planet info when button is clicked
    });

    return panel;
  }
}

// Function to show the globe
function showGlobe(textureUrl) {
  menu.style.display = 'none';
  globeContainer.style.display = 'block';
  backBtn.style.display = 'block';
  planetInfoPanel.style.display = 'block'; // Show the info panel when a globe is selected
  createGlobe(textureUrl); // Create the globe with a specific texture
}

// Function to show the main menu
function showMenu() {
  menu.style.display = 'flex';
  globeContainer.style.display = 'none';
  backBtn.style.display = 'none';
  planetInfoPanel.style.display = 'none'; // Hide the info panel when returning to the menu
}


// Event listener for planet buttons in panels
function generatePanels(planets) {
  planetContainer.innerHTML = ''; // Clear previous panels
  planets.forEach(planet => {
    const globePanel = new GlobePanel(planet.Name,"textureMaps/" + planet.Name + ".jpg", "planetFaces/"+ planet.Name + "_face.jpg"); // Pass planet name and texture
    const panelElement = globePanel.createPanel();
    planetContainer.appendChild(panelElement); // Add the panel to the planet container
    planetPanels.push(panelElement);
  });
}


// Function to create a globe
function createGlobe(textureUrl) {
  globeContainer.innerHTML = '';

  globeInstance = Globe()
    (document.getElementById('globe-container')) // Globe container
    .globeImageUrl(textureUrl) // Set the texture for the selected globe
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png'); // Background stars
}


// Function to load JSON data
async function loadJsonData() {
  try {
    const response = await fetch('planets.json'); // Ensure the file path is correct

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const planets = await response.json(); // Parse JSON data
    generatePanels(planets); // Generate panels using the JSON data
  } catch (error) {
    console.error('Error loading JSON data:', error);
  }
}

// Function to show planet info
// Function to show planet info
function showPlanetInfo(planetName) {
  const planetInfo = document.getElementById('planet-info');
  const infoTitle = document.getElementById('info-title');
  const infoContent = document.getElementById('info-content');

  // Clear existing content
  infoContent.innerHTML = ''; // Clear previous content

  // Find the selected planet in the loaded data
  fetch('planets.json')
    .then(response => response.json())
    .then(planets => {
      const planetData = planets.find(planet => planet.Name === planetName);
      if (planetData) {
        infoTitle.textContent = planetData.Name;

        // Create a list of planet attributes
        const attributes = [
          { label: 'Type', value: planetData.Type },
          { label: 'Lightyears from Earth', value: planetData["Lightyears from Earth"] },
          { label: 'Discovered', value: planetData.Discovered },
          { label: 'Orbital Period (days)', value: planetData["Orbital Period (days)"] },
          { label: 'Our Sun Mass Comparison', value: planetData["Our Sun Mass Comparison"] },
          { label: 'Our Sun Radius Comparison', value: planetData["Our Sun Radius Comparison"] },
          { label: 'Fun Facts', value: planetData["Fun Facts"] },
          { label: 'Detection Method', value: planetData["Detection Method"] },
          { label: 'Observed By', value: planetData["Observed By"] },
          { label: 'More Info', value: `<a href="${planetData["Link for More Info"]}" target="_blank">Link</a>` }
        ];

        // Create and append each attribute as a paragraph
        attributes.forEach(attr => {
          const p = document.createElement('p');
          p.innerHTML = `<strong>${attr.label}:</strong> ${attr.value}`;
          infoContent.appendChild(p);
        });

        planetInfo.style.display = 'block'; // Show the planet info panel
      }
    });
}


searchBar.addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  let resultsFound = false;
  
  planetPanels.forEach(panel => {
    const planetName = panel.getAttribute('data-name').toLowerCase();
    if (planetName.includes(searchTerm)) {
      panel.style.display = 'block'; // Show matching panels
      resultsFound = true;
    } else {
      panel.style.display = 'none'; // Hide non-matching panels
    }
  });

  const noResultsMessage = document.getElementById('no-results');
  if (resultsFound) {
    noResultsMessage.style.display = 'none'; // Hide the message if results are found
  } else {
    noResultsMessage.style.display = 'block'; // Show the message if no results found
  }
});


// Event listener for the info icon to toggle the visibility of the // Event listener for the info icon to toggle the visibility of the planet info panel
infoIcon.addEventListener('click', () => {
  if (planetInfoPanel.classList.contains('collapsed')) {
    planetInfoPanel.classList.remove('collapsed'); // Expand the panel
  } else {
    planetInfoPanel.classList.add('collapsed'); // Collapse the panel
  }
});

// Event listener for back button
backBtn.addEventListener('click', showMenu);

// Event listener for auto-rotate toggle
autoRotate.addEventListener('change', function() {
  autoRotateCheck = this.checked;
});

// Load and generate the planet panels when the page loads
loadJsonData();
showMenu();
