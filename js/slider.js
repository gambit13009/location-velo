var flecheGauche = $('#left')
var flecheDroite = $('#right')

//-----------------------Initialisation de l'objet diapo ------------------------
var diapo={

 nbreSlide:$('.step').length,
 nbreNav:1,
 slideVisible: $('.step:first-child')
,
// méthode pour afficher la couleur du numéro de la diapo 
checkSpan:function(){
    
        $('span').css('background-color','black')
        $('#'+this.nbreNav).css('background-color','red')             
},     
    
initDiapo:function(){
    // initialisation du positionnement des diapos  
    $('.step').css('transform','translateX(100%)')
    $('.step:first-child').css('transform','translateX(0)')         
    
        // affichage du numéro des diapos 
        for (i=1;i<=this.nbreSlide;i++){
            $('nav').append("<span id="+i+">" + i + "</span>")            
                if (i===this.nbreNav){$('#'+i).css('background-color','red')}
        }
},
    
// transformation des slides vers la droite    
gotoSlideRight:function(numero){
    
    this.slideVisible.css ('transform','translateX(-100%)')
    this.slideVisible=$('#slide'+(numero+1))
    this.slideVisible.css ('transform','translateX(0)')           
    this.nbreNav=numero+1
    
    this.checkSpan()
 
        //  si on est à la dernière slide, on revient à la première
        if(this.nbreNav===this.nbreSlide+1){
                $('.step').css('transform','translateX(100%)')
                this.nbreNav=1
                this.slideVisible=$('#slide'+(this.nbreNav))        
                this.slideVisible.css ('transform','translateX(0)')
                this.checkSpan()
        }    
},

// transformation des slides vers la gauche
gotoSlideLeft:function(numero){
    
    this.slideVisible.css ('transform','translateX(100%)')
    this.slideVisible=$('#slide'+(numero-1))
    this.slideVisible.css ('transform','translateX(0)')         
    this.nbreNav=numero-1
    this.checkSpan()
    
            // si on est à la première slide, on va à la dernière
            if(this.nbreNav===0){
               $('.step').css('transform','translateX(-100%)')
               this.nbreNav=4
               this.slideVisible=$('#slide'+(this.nbreNav))       
               this.slideVisible.css ('transform','translateX(0)')
               this.checkSpan()
           }      
  }
}

//--------------initialisation du diapo au lancement de la page-------------

diapo.initDiapo()  

// lancement de la lecture automatique
var sliderAuto=setInterval("diapo.gotoSlideRight(diapo.nbreNav)", 5000); 

// fonctionnement du bouton play
$('#play_diapo').click(function(){
    $('#pause_diapo').css('color','rgba(0,0,0,0.6)')
    clearInterval(sliderAuto)
    sliderAuto=setInterval("diapo.gotoSlideRight(diapo.nbreNav)", 5000)   
})

//fonctionnement du bouton pause
$('#pause_diapo').click(function(){
    clearInterval(sliderAuto)       
    $('#pause_diapo').css('color','red')

})



//-----------------------Ajout des évènements clavier -----------------------

document.addEventListener("keydown",function(e){
                            // fonctionnement fleche gauche
                            if (e.keyCode===37){
                                clearInterval(sliderAuto)
                                diapo.gotoSlideLeft(diapo.nbreNav)
                                flecheGauche.css('background-color','blue')   
                                $('#pause_diapo').css('color','red')
                            }
                            // fonctionnement fleche droite
                            else if (e.keyCode===39){
                                clearInterval(sliderAuto)
                                diapo.gotoSlideRight(diapo.nbreNav)         
                                flecheDroite.css('background-color','blue')
                            }
                          })
// modifie la couleur des boutons de navigation avec la navigation au clavier
document.addEventListener("keyup",function(e){
                            if (e.keyCode===37){
                                flecheGauche.css('background-color','#59A9FF')      
                            }
                            else if (e.keyCode===39){
                                flecheDroite.css('background-color','#59A9FF')
                            }
})

//-----------------------Ajout des évènements de la souris-------------------------

flecheDroite.click(function(){diapo.gotoSlideRight(diapo.nbreNav)})
flecheGauche.click(function(){diapo.gotoSlideLeft(diapo.nbreNav)})
