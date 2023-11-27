class StarInfoDisplay {
    constructor() {
      this.popupElement = document.getElementById('starPopup');
    }
    
  
    showPopup(starData) {
      this.popupElement.innerHTML = `Name: ${starData.name}<br>
                                     Heat: ${starData.heat}<br>
                                     Size: ${starData.size}<br>
                                     Brightness: ${starData.brightness}<br>
                                     Constellation: ${starData.constellation}`;
                                     
      this.popupElement.style.display = 'block';
      
      const closeButton = document.createElement('button');
      closeButton.innerText = 'X';
      closeButton.addEventListener('click', () => {
        this.hidePopup();
      });
      
      this.popupElement.appendChild(closeButton);
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