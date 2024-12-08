let port;
let connectBtn;
let BAUD_ARDUINO = 9600;

let reference = 0;
let frequence = 0;

let X_freq = 100;
let Y_freq = 120;

function setup() {
  let div = createDiv();
  div.id('application');
  
  let titre = createElement("h1","Mesure de l'effet Doppler<br> avec des ultra sons ");
  titre.parent(div);
  
  let c = createCanvas(600, 400);
  c.parent(div);
  background(220);

  port = createSerial();
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_ARDUINO);
  }
  
  connectBtn = createButton('Connect to Arduino');  
  connectBtn.mousePressed(connectBtnClick);
  connectBtn.parent(div);
  

  let sendBtn = createButton('Fixer la fréquence de référence Fo ');  
  sendBtn.mousePressed(sendBtnClick);
  sendBtn.parent(div);

  textFont("Courier New");
  textSize(32);
  textStyle(BOLD);

}

function draw() {
  
  let str = port.readUntil("\n");
  if (str.length > 0) {
    afficherFrequence(str);
    frequence = parseFloat(str);
    afficherDecalageDoppler(frequence-reference);    
  }

  if (!port.opened()) {
    connectBtn.html('Connexion à Arduino');
  } else {
    connectBtn.html('Déconnexion');
  }
}

function afficherFrequence( f ){
  fill('black');
  text('Fréquence (Hz)', X_freq - 50, Y_freq - 50);
  afficherValeur(f, X_freq, Y_freq);
}

function afficherDecalageDoppler( Df ){
  fill('black');
  text('Décalage Doppler (Hz)', X_freq - 50, Y_freq - 50 + 150);
  afficherValeur(Df, X_freq, Y_freq + 150);
}


function afficherValeur( v ,x,y){
  let data = parseFloat(v).toFixed(0);
  fill(220);
  noStroke();
  rect(x,y- textAscent(data) ,200,textAscent(v)+textDescent(data));
  fill('yellow');
  noStroke();
  rect(x,y- textAscent(data) ,textWidth(data),textAscent(v)+textDescent(data));
  noFill();
  fill('black');
  text(data, x, y);  
}


function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', BAUD_ARDUINO);
  } else {
    port.close();
  }
}

function sendBtnClick() {
  reference = frequence;
}
