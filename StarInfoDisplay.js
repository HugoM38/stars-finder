class StarInfoDisplay {
    constructor() {
      this.popupElement = document.getElementById('starPopup');
    }
    
  
    showPopup(starData) {
      // Ajout d'un bouton de fermeture
      const closeButton = document.createElement('button');
      closeButton.innerText = 'X';
      closeButton.id = 'closePopup';
      closeButton.addEventListener('click', () => {
        this.hidePopup();
      });

      // Ajout des données de l'étoile
      this.popupElement.innerHTML = `Name: ${starData.name}<br>
                                     Heat: ${starData.heat}<br>
                                     Brightness: ${starData.brightness}<br>
                                     Constellation: ${starData.constellation}`;
      // Ajout du bouton de fermeture
      this.popupElement.appendChild(closeButton);
      // Affichage de la pop-up
      this.popupElement.style.display = 'block';
      // placer la pop-up au niveau du clic de souris :
      this.popupElement.style.left = `${event.clientX + 100}px`;
      this.popupElement.style.top = `${event.clientY + 100}px`;

    }
  
    hidePopup() {
      this.popupElement.style.display = 'none';
    }

    setupCloseEvent() {
        window.addEventListener('click', (event) => {
            // Vérifie si l'événement de clic s'est produit en dehors de la pop-up
            if (!this.popupElement.contains(event.target)) {
                this.hidePopup();
            }
        });
    }
  }

  export default StarInfoDisplay;