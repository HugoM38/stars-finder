import Stars from './stars.js';
import starPositions from './starPositions.json';
import planets from './planets.json';
import './style.css';
import StarInfoDisplay from './starInfoDisplay';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scaleDistance = 10000;
let stars;
var camera;

function absmagToBrightness(absmag) {
    return Math.max(0.1, (15 - absmag) / 15);
}

function calculateDistance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

function updateSceneWithFilteredStars(filteredStars) {
    // Nettoyer les étoiles existantes
    stars.clear(); // Vous devrez implémenter cette méthode dans votre classe Stars

    // Ajouter de nouvelles étoiles basées sur les étoiles filtrées
    filteredStars.forEach(star => {
        const { x, y, z, lum, absmag, con, proper, ci } = star;
        console.log(star);
        const name = proper || star.bf || star.hr;
        var size;
        var scaledX;
        var scaledY;
        var scaledZ;
        if (name == "Sol") {
            size = 0.22567;
            scaledX = 0;
            scaledY = 0;
            scaledZ = 0;
        } else {
            scaledX = x * scaleDistance;
            scaledY = y * scaleDistance;
            scaledZ = z * scaleDistance;
            size = 500;
        }
        const brightness = absmagToBrightness(absmag);

        stars.implementStars(scaledX, scaledY, scaledZ, getStarColorImage(ci), "sphere", {
            heat: spectralClassToTemperature(star.spect) + " Kelvins", // Utilisation de spect pour 'heat'
            size,
            // cut brightness 6 number after the dot :
            brightness: brightness.toFixed(6),
            constellation: con,
            name
        });
    });

    planets.forEach(planet => {

        const { coordinates, name, dist, image } = planet;
        var size = 0.22567;

        var scaledX = coordinates.x * 10000;
        var scaledY = coordinates.y * 10000;
        var scaledZ = coordinates.z * 10000;

        stars.implementPlanets(scaledX, scaledY, scaledZ, image, "sphere", {
            size,
            name
        });
    });

    // Rendre la scène à nouveau
    scene.render();
}

function spectralClassToTemperature(spectralClass) {
    const temperatureMap = {
        'O': 40000,
        'B': 20000,
        'A': 9000,
        'F': 7000,
        'G': 5500,
        'K': 4000,
        'M': 3000,
    };

    // Calculez la température en fonction de la classe spectrale, comme "A0V" par exemple :
    const spectralType = spectralClass.charAt(0);

    return temperatureMap[spectralType];
}

function filterStars(criteria, numberToDisplay, constellationValue) {

    let filteredStarPositions;

    switch (criteria) {
        case 'hottest':
            filteredStarPositions = starPositions.sort((a, b) => a.ci - b.ci).slice(0, numberToDisplay);
            break;
        case 'coldest':
            console.log(numberToDisplay);
            filteredStarPositions = starPositions.sort((a, b) => b.ci - a.ci).slice(0, numberToDisplay);
            break;
        case 'closest':
            filteredStarPositions = starPositions.sort((a, b) => calculateDistance(a, { x: 0, y: 0, z: 0 }) - calculateDistance(b, { x: 0, y: 0, z: 0 })).slice(0, numberToDisplay);
            console.log(filteredStarPositions);
            break;
        case 'showAll':
            filteredStarPositions = starPositions;
            break;
        case 'constellationsDropdown':
            filteredStarPositions = starPositions.filter(star => star.con === constellationValue);
            var targetStar = filteredStarPositions.sort((a, b) => a.absmag - b.absmag)[0]
            var x = parseFloat(targetStar.x) * scaleDistance;
            var y = parseFloat(targetStar.y) * scaleDistance;
            var z = parseFloat(targetStar.z) * scaleDistance;
            camera.setTarget(new BABYLON.Vector3(x, y, z));;
            console.log(filteredStarPositions);
            break;

        default:
            filteredStarPositions = starPositions;
            break;
    }
    updateSceneWithFilteredStars(filteredStarPositions);
}

function getStarColorImage(ci) {
    if (ci < 0) {
        return "https://i.imgur.com/AJ5pFUS.jpg"
    } else if (ci >= 0 && ci < 1) {
        return "https://i.imgur.com/exxVBKc.png"
    } else if (ci >= 1 && ci < 2) {
        return "https://i.imgur.com/eMNqEqC.png"
    } else if (ci >= 2 && ci < 3) {
        return "https://i.imgur.com/lCmwJRT.jpg"
    } else {
        return "https://i.imgur.com/C1FwjWU.png"
    }
}

const createScene = (starPositions) => {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();  // Changer la couleur de fond à noir
    // 4.7841
    camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(4.806667, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.minZ = 0; // Minimum range
    camera.minX = 0; // Minimum range
    camera.minY = 0; // Minimum range
    camera.maxZ = 10000000000;
    camera.maxX = 10000000000;
    camera.maxY = 10000000000;

    // Maximum range, augmentez cette valeur pour voir des objets plus éloignés

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 10;

    const starInfoDisplay = new StarInfoDisplay();


    stars = new Stars(scene, starInfoDisplay);
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 2;

    if (!Array.isArray(starPositions)) {
        console.error('starPositions is not an array:', starPositions);
        return;
    }

    starPositions.forEach(star => {

        const { x, y, z, lum, absmag, con, proper, ci } = star;
        const name = proper || star.bf || star.hr;
        var size;

        var scaledX;
        var scaledY;
        var scaledZ;

        if (name == "Sol") {
            size = 0.22567;
            scaledX = 0;
            scaledY = 0;
            scaledZ = 0;
        } else {
            scaledX = x * scaleDistance;
            scaledY = y * scaleDistance;
            scaledZ = z * scaleDistance;
            size = 500;
        }
        const brightness = absmagToBrightness(absmag);

        stars.implementStars(scaledX, scaledY, scaledZ, getStarColorImage(ci), "sphere", {
            heat: spectralClassToTemperature(star.spect) + " Kelvins", // Utilisation de spect pour 'heat'
            size,
            // cut brightness 6 number after the dot :
            brightness: brightness.toFixed(6),
            constellation: con,
            name
        });
    });

    planets.forEach(planet => {

        const { coordinates, name, dist, image } = planet;
        var size = 0.22567;

        var scaledX = coordinates.x * 10000;
        var scaledY = coordinates.y * 10000;
        var scaledZ = coordinates.z * 10000;

        stars.implementPlanets(scaledX, scaledY, scaledZ, image, "sphere", {
            size,
            name
        });
    });

    return scene;
};

document.getElementById('hottest').addEventListener('click', () => {
    const numberOfStars = document.getElementById('numberInput').value;
    filterStars('hottest', numberOfStars, null);
});
document.getElementById('coldest').addEventListener('click', () => {
    const numberOfStars = document.getElementById('numberInput').value;
    filterStars('coldest', numberOfStars, null);
});
document.getElementById('closest').addEventListener('click', () => {
    const numberOfStars = document.getElementById('numberInput').value;
    filterStars('closest', numberOfStars, null);
});
document.getElementById('showStars').addEventListener('click', () => {
    filterStars('showAll', null, null); // Utilisez 'number' comme critère et passez le nombre d'étoiles
});
document.getElementById('constellationsDropdown').addEventListener('change', function () {
    const selectedValue = this.value;
    console.log(selectedValue);
    filterStars('constellationsDropdown', null, selectedValue);
});
document.getElementById('planetsDropdown').addEventListener('change', function () {
    const selectedValue = this.value;
    console.log(selectedValue);
    if (selectedValue === "all") {
        camera.position = new BABYLON.Vector3(4.806667, 0, 0)
    } else {
        var planet = planets.filter(planet => planet.name === selectedValue)[0];
        console.log(planet);
        var scaledX = planet.coordinates.x * 10000;
        var scaledY = planet.coordinates.y * 10000;
        var scaledZ = planet.coordinates.z * 10000;

        camera.position = new BABYLON.Vector3(scaledX + 1, scaledY + 1, scaledZ + 1)
        camera.setTarget(new BABYLON.Vector3(scaledX, scaledY, scaledZ));
    }
});

// event listener pour fermer la popup
document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('starPopup').style.display = "none";
});

let closestStars = starPositions.sort((a, b) => calculateDistance(a, { x: 0, y: 0, z: 0 }) - calculateDistance(b, { x: 0, y: 0, z: 0 })).slice(0, 500);
const scene = createScene(closestStars);
engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
