import Stars from './stars.js';
import starPositions from './starPositions.json';
import './style.css';
import StarInfoDisplay from './starInfoDisplay';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scaleDistance = 10000;
let stars;

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
    filteredStars.forEach(position => {
        const { x, y, z, lum, absmag, con, proper, ci } = position;
        const name = proper || position.bf || position.hr;
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
            heat: position.vx, // Utilisation d'une donnée représentative pour 'heat'
            size,
            brightness,
            constellation: con,
            name
        });
    });

    // Rendre la scène à nouveau
    scene.render();
}

function filterStars(criteria, point = { x: 0, y: 0, z: 0 }) {

    let filteredStarPositions;

    switch (criteria) {
        case 'hottest':
            filteredStarPositions = starPositions.sort((a, b) => b.heat - a.heat).slice(0, 50);
            break;
        case 'brightest':
            filteredStarPositions = starPositions.sort((a, b) => b.brightness - a.brightness).slice(0, 50);
            break;
        case 'biggest':
            filteredStarPositions = starPositions.sort((a, b) => b.size - a.size).slice(0, 50);
            break;
        case 'closest':
            filteredStarPositions = starPositions.sort((a, b) => calculateDistance(a, point) - calculateDistance(b, point)).slice(0, 50);
            break;
        case 'number':
            const numberToDisplay = parseInt(point, 10); // Renommez la variable pour plus de clarté
            filteredStarPositions = starPositions.slice(0, numberToDisplay);
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
    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(4.806667, 0, 0), scene);
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

    starPositions.forEach(position => {

        const { x, y, z, lum, absmag, con, proper, ci } = position;
        const name = proper || position.bf || position.hr;
        var size;
        if (name == "Sol") {
            size = 0.22567;
        } else {
            size = 500;
        }
        const brightness = absmagToBrightness(absmag);

        const scaledX = x * scaleDistance;
        const scaledY = y * scaleDistance;
        const scaledZ = z * scaleDistance;

        stars.implementStars(scaledX, scaledY, scaledZ, getStarColorImage(ci), "sphere", {
            heat: position.vx, // Utilisation d'une donnée représentative pour 'heat'
            size,
            brightness,
            constellation: con,
            name
        });
    });
    return scene;
};

document.getElementById('hottest').addEventListener('click', () => filterStars('hottest'));
document.getElementById('brightest').addEventListener('click', () => filterStars('brightest'));
document.getElementById('biggest').addEventListener('click', () => filterStars('biggest'));
document.getElementById('closest').addEventListener('click', () => filterStars('closest', { x: 0, y: 0, z: 0 })); // Ajout de cet événement
document.getElementById('showStars').addEventListener('click', () => {
    const numberOfStars = document.getElementById('numberInput').value;
    filterStars('number', numberOfStars); // Utilisez 'number' comme critère et passez le nombre d'étoiles
});

  // event listener pour fermer la popup
  document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('starPopup').style.display = "none";
});

let closestStars = starPositions.sort((a, b) => calculateDistance(a, { x: 0, y: 0, z: 0 }) - calculateDistance(b, { x: 0, y: 0, z: 0 })).slice(0, 500);
const scene = createScene(closestStars);
engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
