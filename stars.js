class Stars {
    constructor(scene, starInfoDisplay) {
        this.scene = scene;
        this.starInfoDisplay = starInfoDisplay;
        this.starMeshes = []; // Ajout d'un tableau pour garder une référence aux maillages des étoiles
    }

    implementStars(x, y, z, texturePath, shape, attributes) {
        const { heat, size, brightness, constellation, name } = attributes;

        const material = new BABYLON.StandardMaterial("material", this.scene);
        material.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);
        material.emissiveTexture = material.diffuseTexture;
        material.emissiveColor = new BABYLON.Color3(brightness, brightness, brightness);
        material.emissiveIntensity = brightness;

        let starMesh;
        if (shape === "sphere") {
            starMesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: size }, this.scene);
        } else {
            console.warn(`Shape ${shape} not recognized, defaulting to sphere.`);
            starMesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: size }, this.scene);
        }

        this.starMeshes.push(starMesh);

        starMesh.material = material;
        starMesh.position = new BABYLON.Vector3(x, y, z);

        starMesh.actionManager = new BABYLON.ActionManager(this.scene);
        starMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            (evt) => {
                // Utilisation de starInfoDisplay pour afficher les informations
                this.starInfoDisplay.showPopup(evt.meshUnderPointer.metadata);
            }
        )
    );
        starMesh.metadata = { heat, size, brightness, constellation, name };


        // Ici, vous pouvez ajouter le nom et la constellation comme étiquette ou métadonnée au mesh.
        // ...

        return starMesh;
    }

    clear() {
        // Parcourez le tableau starMeshes et supprimez chaque maillage de la scène
        this.starMeshes.forEach(mesh => {
            this.scene.removeMesh(mesh); // Supprime le maillage de la scène
            mesh.dispose(); // Libère les ressources du maillage
        });
        this.starMeshes = []; // Réinitialise le tableau après avoir effacé les maillages
    }
}

export default Stars;