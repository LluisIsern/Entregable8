// Variables
var idLletra = 0;
var intents = 0;
var paraula = '';
var jugant = false;

var partidesTotals = 0;
var partidesGuanyades = 0;
var millorsIntents = 0;
var millorTemps = 0;
var segons = 0;

// Escollir paraula aleatòria per endevinar
var paraulaSecreta = triarParaula();
console.log(paraulaSecreta);

// Events
// Events de teclat en pantalla
tecles = document.getElementsByClassName('tecla');
for (let i = 0; i < tecles.length; i++) {
    if (tecles[i].id == 'teclaenter'){
        tecles[i].addEventListener('click', function() {enviaParaula()});
    } else if (tecles[i].id == 'teclaborrar'){
        tecles[i].addEventListener('click', function() {esborraLletra()});
    } else {
        let lletra = tecles[i].textContent;
        tecles[i].addEventListener('click', function() {teclat(lletra)});
    }
}

// Events de teclat
window.addEventListener('keydown', event => {
    if (/^[a-zA-ZçÇ]$/.test(event.key)){
        teclat(event.key.toUpperCase());
    }

    if (event.key == 'Backspace') {
        esborraLletra();
    }

    if (event.key == 'Enter') {
        enviaParaula();
    }
})

// Event per comprovar el formulari inicial
document.getElementById('envia').addEventListener('click', comprovaLogin);

// Event de mostrar estadístiques
document.getElementById('stats').addEventListener('click', mostraStats);

// Event de mostrar ajuda
document.getElementById('ajuda').addEventListener('click', mostraAjuda);

// Event de reiniciar
document.getElementById('reiniciar').addEventListener('click', reiniciar);

// Cronòmetre
setInterval(function() {
    segons++;
}, 1000);


// Funcions
// Funció per comprovar formulari
function comprovaLogin() {
    var error = '';

    nom = document.getElementById('nom').value;
    var nomOK = (nom != '');
    if (!nomOK){
        error += 'El camp nom no pot estar buit<br>';
    } 

    cognom = document.getElementById('cognom').value;
    var cognomOK = (cognom != '');
    if (!cognomOK){
        error += 'El camp cognom no pot estar buit<br>';
    }

    correu = document.getElementById('correu').value;
    var correuTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var correuOK = correuTest.test(correu);
    if (!correuOK){
        error += 'El correu ha de tenir el format string@string.string<br>';
    }

    telefon = document.getElementById('telefon').value;
    var telefonTest = /^[6-9][0-9]{8}$/;
    var telefonOK = telefonTest.test(telefon);

    if (!telefonOK){
        error += 'El telèfon ha de tenir 9 dígits i començar per 6, 7, 8, o 9';
    }

    if (error != ''){
        Swal.fire({
            title: 'Error',
            html: error,
            icon: 'error'
        });
    } else {
        document.getElementsByClassName('formulari')[0].style.display = 'none';
        document.getElementsByClassName('barrasuperior')[0].style.visibility = 'visible';
        document.getElementsByClassName('tauler')[0].style.visibility = 'visible';
        document.getElementsByClassName('teclat')[0].style.visibility = 'visible';
        jugant = true;
    }
    
}

// Funció de premer tecla
function teclat(lletra) {
    
    if (jugant){

        // Només escribim lletra si no hem completat la paraula
        if (idLletra < 5){
            // Posem la lletra corresponent a la casella
            document.getElementById('lletra' + (intents*10+idLletra)).textContent = lletra;
            // Augmentem id de lletra per passar a la següent casella
            idLletra++;

            // Guardem la lletra a la paraula
            paraula += lletra;
        }
    }
}

// Funció per triar paraula aleatòria
function triarParaula() {
    // Numero entre 0 i 11031
    return dic[Math.floor(Math.random() * 11032)].toUpperCase();
}

// Funció per comprovar la paraula introduida per l'usuari
function enviaParaula() {

    if (jugant && !swal.isVisible()) {
        // Si la paraula està completa la comprovem, si no donem un error
        if (idLletra == 5){

            // Mirem que la paraula sigui al diccionari, sino donem error
            if (dic.includes(paraula.toLowerCase())) {
                // Comprovar si la paraula coincideix, pintar quadres verd/groc segons les lletres encertades
                for (let i = 0; i < paraula.length; i++) {

                    document.getElementById('lletra' + (intents*10+i)).style.backgroundColor = 'lightgray';

                    if (paraulaSecreta.includes(document.getElementById("lletra" + (intents*10+i)).textContent)) {
                        document.getElementById('lletra' + (intents*10+i)).style.backgroundColor = 'yellow';
                    }

                    if (paraula.charAt(i) == paraulaSecreta.charAt(i)) {
                        document.getElementById('lletra' + (intents*10+i)).style.backgroundColor = 'green';
                    }
                }

                comprovarVictoria();

            } else {
                setTimeout(function() {
                    Swal.fire({
                        title: 'Error',
                        html: 'La paraula no és al diccionari',
                        icon: 'error'
                    });
                }, 10);
            }
            
            
        } else {
            setTimeout(function() {
                Swal.fire({
                    title: 'Error',
                    html: 'Completa la paraula',
                    icon: 'error'
                });
            }, 10);
            
        }
    }
}

// Funció per esborrar lletra de la paraula
function esborraLletra() {

    if (jugant) {
        // Si hi ha lletres, baixem l'id de la lletra i esborrem l'última casella
        if (idLletra > 0){
            idLletra--;
            document.getElementById('lletra' + (intents*10+idLletra)).textContent = '';
            // Esborrar lletra de la variable paraula
            paraula = paraula.slice(0, -1);
        }
    }
}

// Funció per comprovar si hem guanyat o perdut la partida després de fer un intent
function comprovarVictoria() {
    // Si endevinem paraula, guanyem la partida
    if (paraula == paraulaSecreta) {
        jugant = false;
        if (intents < millorsIntents || partidesTotals == 0) {
            millorsIntents = (intents+1);
        }
        if (segons < millorTemps || partidesTotals == 0) {
            millorTemps = segons;
        }
        partidesTotals++;
        partidesGuanyades++;
        setTimeout(function() {
            Swal.fire({
                title: 'Felicitats!',
                html: 'Has encertat la paraula!<br>Has necessitat ' + (intents+1) + ' intents<br>Has trigat ' + segons + ' segons',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }, 10);

    // Si fallem i no queden vides, perdem la partida
    } else if (intents >= 5) {
        jugant = false;
        partidesTotals++;
        setTimeout(function() {
            Swal.fire({
                title: 'Llàstima...',
                html: 'No has pogut encertar la paraula<br>La paraula era ' + paraulaSecreta,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }, 10);
        
    
    // Si fallem i queden vides, seguim jugant
    } else {
        paraula = '';
        intents++;
        idLletra = 0;
    }
}

// Funció per reiniciar la partida
function reiniciar() {
    // Buidar tauler
    var caselles = document.getElementsByClassName('lletra');
    for (var i = 0; i < caselles.length; i++) {
        caselles[i].textContent = '';
        caselles[i].style.backgroundColor = '';
    }

    // Nova paraula
    paraulaSecreta = triarParaula();
    console.log(paraulaSecreta);

    // Reiniciar variables
    idLletra = 0;
    intents = 0;
    paraula = '';
    // Si estavem en mig d'una partida sumem 1 partida
    if (jugant) {
        partidesTotals++;
    } 
    jugant = true;
    segons = 0;

    // Aixo es per evitar que es quedi el boto marcat despres de clicarlo i que al donarli a enter per enviar la paraula es reinicii la partida
    document.getElementById('reiniciar').blur();
}

// Funció per mostrar estadístiques
function mostraStats() {
    Swal.fire({
        title: 'Estadístiques',
        html: 'Nom: ' + document.getElementById("nom").value + '<br>Partides totals: ' + partidesTotals + '<br>Partides guanyades: ' + partidesGuanyades + '<br>Millor partida: ' + millorsIntents + ' intents<br>Partida més ràpida: ' + millorTemps + ' segons',
        confirmButtonText: 'Tanca'
    });

}

// Funció que mostra l'ajuda
function mostraAjuda() {
    var ajuda = '<div><h2>Wordle català</h2><h3>Com jugar</h3><p>Endevinar el Wordle en sis intents o menys.</p><p>Cada conjectura ha de ser una paraula vàlida de cinc lletres. Premeu el botó Enter per enviar la vostra conjectura.</p><p>Després de suposar, les rajoles canviaran de color per indicar quines lletres de la vostra paraula són correctes o gairebé correctes.</p><div><h2>Exemples </h2><div><img src="1.png"/></div><p><b>C</b> està a la paraula i en la ubicació correcta! </p><div><img src="2.png"/></div><p><b>T</b> està a la paraula, però no a la ubicació correcta. </p><div><img src="3.png"/></div><p><b>I</b> no està present a la paraula que esteu intentant endevinar. </p></div></div>';
    Swal.fire({
        html: ajuda,
        confirmButtonText: 'Tanca'
    });
}