// ------------Génération de la carte --------------- 


//On vide le session storage
sessionStorage.clear() 
// Création de l'objet map et insertion dans l'élément HTML qui a l'id map
var map = L.map('map').setView([43.295269, 5.374084], 17)

        var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { 
            attribution: '© OpenStreetMap contributors',
            minZoom: 1,
            maxZoom: 20
        });
    
        map.addLayer(osmLayer);
//Si nom et prénom présents dans storage on les récupère pour préremplir le formulaire ----------------*/
if (localStorage.getItem('nomSauv')!==null && localStorage.getItem('prenomSauv')!==null){
    $('#nomUtilisateur').attr('value',localStorage.getItem('nomSauv'))
    $('#prenomUtilisateur').attr('value',localStorage.getItem('prenomSauv'))
}

// ------------Définition de l'objet formulaire et de ses méthodes--------------

var reservationForm ={

    testNom:document.getElementById("nomUtilisateur"),
    testPrenom:document.getElementById("prenomUtilisateur"),

    reservationTimer:function (){

            var button = document.getElementById('annuler')
            var  minLeft = 1200;
            var secLeft=60
                    //réinitialisation du compte à rebours
                    var timerID = setTimeout(function() { 
                        
                        sessionStorage.cancelled=true;
                        clearInterval(intervalID);
                        button.innerHTML = "<p>Réservation expirée</p>";                  
                    }, 1200000)

                    //mise en place de l'intervalle pour afficher la progression du temps
                    var intervalID = setInterval(function() {  
                        button.innerHTML = "<p>Annuler la réservation(" + parseInt(--minLeft/60) + " minutes" + " et "+ --secLeft + " secondes)</p>" 
                            if (secLeft===0){
                                //réinitialisation du décompte des secondes
                                secLeft=60
                            } 
                    }, 1000)


                    button.addEventListener('click', function() {
                        // On annule le compte à rebours
                        clearTimeout(timerID) 
                        sessionStorage.cancelled=true;
                        console.log(sessionStorage.getItem('cancelled'))
                        // Et l'intervalle
                        clearInterval(intervalID)
                        button.innerHTML = "<p>Réservation annulée</p>";
                        alert("La réservation a bien été annulée.")
                    })

                    $('#reserver').click(function(event){
                        // On annule le compte à rebours
                        clearTimeout(timerID) 
                        // Et l'intervalle
                        clearInterval(intervalID)
                        })                                   
                    },

    verifForm:function (){
            sessionStorage.cancelled=false;
        //on vérifie que les champs sont valides
        if (reservationForm.testPrenom.value.length>1 && reservationForm.testNom.value.length>1 && sessionStorage.getItem('signOk')!=null){ 
            //on affiche le bloc de compte à rebours
            $('#temps_restant').css('display','block')
            //on enlève le formulaire
            $('.reservation').css("display","none")
            //on lance le compte à rebours
            this.reservationTimer()
            //on sauvegarde les infos utilisateur en dans localStorage
            localStorage.nomSauv=reservationForm.testNom.value
            localStorage.prenomSauv=reservationForm.testPrenom.value        
            
            var recupNom=localStorage.getItem('nomSauv')+" "
            var recupPrenom=localStorage.getItem('prenomSauv')+" "
            
            $('#temps_restant span').html("<p>Merci "+recupPrenom+recupNom+" d'avoir réservé! Votre vélo vous attend à l'adresse <br>"+"<strong>"+ sessionStorage.getItem("adresseResa")+"</strong>")
            $('#temps_restant h2').html("<h2>Réservation</h2>")

            sessionStorage.positionResa=sessionStorage.getItem("positionMarqueur")
                if(sessionStorage.getItem("cancelled")!==true){
                //on enlève un vélo
                var resaEnCours=sessionStorage.getItem('veloDispo')-1           
                $('#velos_disponibles').html(" <p><strong>Vélos disponibles:</strong></p>"+resaEnCours+" <em>(un vélo en réservation)</em>")
                }
            //appel de la fonction pour effacer le canvas
            canvas.clearCanvas() 
            $("#erreur").html("")
        }

        else if(reservationForm.testPrenom.value.length<2 || reservationForm.testNom.value.length<2 ||  sessionStorage.getItem('signOk')==null){
            // si le champ est mal renseigné : message d'erreur
            $("#erreur").html("<strong>Tous les champs doivent être renseignés!</strong>")
        }   
      }
    }

//-----------------on charge et on traite les données JSON--------------------

var jsonContent= {
    //Depuis l'API JC DECAUX,
    urlContrat : 'https://api.jcdecaux.com/vls/v1/stations?contract=Marseille&apiKey=72032174311154c801c4746f6c7bd1c1fb8311be',
    recupInfos : new XMLHttpRequest(),
}

var station ={
    adresse:"",
    latitude:0,
    longitude:0,
    velosLibres:0,
    emplacementDispo:0,
    statut:""    
}

jsonContent.recupInfos.onload = function () {
    
    var donneesDynamiques = JSON.parse(this.responseText);
    
    // on parcoure le json et on génère les marqueurs 
    for (i=0;i<donneesDynamiques.length;i++){
        
        var marker = L.marker([donneesDynamiques[i].position.lat, donneesDynamiques[i].position.lng])
        marker.addTo(map)
        marker.bindPopup("<strong>Louez-moi!</strong><br>" + donneesDynamiques[i].address+"<br>").openPopup();
                
        //-----Ajout d'un évènement clic-------Récupération des infos du marqueur et affichage des infos stations------
              
        marker.addEventListener("click",function(){
        
             for (j=0;j<donneesDynamiques.length;j++){
                
             $("#infos_dynamiques").css('display','block')
                             
             station.adresse=donneesDynamiques[j].address
             station.latitude=donneesDynamiques[j].position.lat
             //mise à jour des infos objet station
             station.veloDispo=donneesDynamiques[j].available_bikes                 
             station.emplacementDispo=donneesDynamiques[j].available_bike_stands
             station.statut=donneesDynamiques[j].status
            
                // on récupère les infos du marqueur sélectionné via la latitude du json
                if (this._latlng.lat===station.latitude){
                    
                    sessionStorage.adresseResa=station.adresse
                    sessionStorage.veloDispo=station.veloDispo
                    sessionStorage.positionMarqueur=station.latitude
                    // On redéfinit la couleur noire si jamais on est passé sur un emplacement non disponible avant 
                    $('#points_attaches').css('color','black')
                    $('#velos_disponibles').css('color','black')
                    // et on affiche toutes les infos
                    $('#adresse').html("<p><i class=\"fas fa-map-marked-alt\"></i></p>"+"<strong>Adresse: </strong>"+station.adresse)
                    $('#points_attaches').html("<i class=\"fas fa-bicycle\"></i><p/><p><strong>Points d'attaches opérationnels: </strong>"+station.emplacementDispo)
                    $('#velos_disponibles').html("<strong>Vélos disponibles: </strong>"+station.veloDispo)            
                    $('#statut').html("<p><i class=\"fas fa-lock-open\"></i></p><strong>Statut de la station: </strong>"+station.statut+"<br/> <br/>")                     
                    // on vérifie que les champs du formulaire soient bien remplis et si oui on enlève un vélo et on affiche un message                     
                    $('#reserver').click(function(event){
                    //On verifie que le formulaire est bien rempli et on affiche le temps de réservation
                    reservationForm.verifForm()
                    //Vérification si signature Ok, on efface le booléen  
                    sessionStorage.removeItem('signOk') 
                    })
                    // Si l'on va sur un autre marqueur et que l'on revient, notre réservation est toujours affichée
                    if (sessionStorage.getItem("positionResa")===sessionStorage.getItem("positionMarqueur") && sessionStorage.getItem("cancelled")!==true){
                    var dejaReserve=sessionStorage.getItem('veloDispo')-1
                    $('#velos_disponibles').html(" <p><strong>Vélos disponibles:</strong></p>"+dejaReserve+"<em> (Vous avez déjà réservé un vélo ici!)</em>")
                    }
                    if (sessionStorage.getItem("positionResa")===sessionStorage.getItem("positionMarqueur") && sessionStorage.getItem("cancelled")==="true"){
                    var dejaReserve=sessionStorage.getItem('veloDispo')
                    $('#velos_disponibles').html(" <p><strong>Vélos disponibles:</strong></p>"+dejaReserve)
                    }

                    //On vérifie l'état de la station pour afficher ou non le bouton de résevation  
                    if (station.veloDispo>0 && station.emplacementDispo>0){
                        $('#bouton').html("<button type=\"button\" class=\"btn btn-success\"\">Réserver</button>")
                        $('#bouton').css('display','block')
                    }
                    else if (station.veloDispo==0){
                        $('#bouton').css('display','none')
                        $('#velos_disponibles').css('color','red')
                    } 
                    else if (station.emplacementDispo==0){
                        $('#bouton').css('display','none')
                        $('#points_attaches').css('color','red')
                     }
                    //on ferme le test de latitude
                 }   
             }                   
        })                     
    }       
}

jsonContent.recupInfos.open('GET', jsonContent.urlContrat, true);
jsonContent.recupInfos.send(null)
