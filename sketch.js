let bps;
let outlierconst = 0.07;
let newr = []
let ravg = 9999;
let alpha = 255;
let secretfunction = true;
let ballcolor = true;
let show = true;
let oldx
let oldy;
let lastpicktime = 0;
let ballsHS = 0;
let reactionHS = 9999;
let bpsHS = 0;
let eatenHS = 0;
let maxepsHS = 0;
let PRESSURE = 60;
let ballcounter;
let timedif = 0;
let reactions = [];
let lasttime;
let hs_avg = 0;
let startTime;
let overall = 0;
let EPSRANGE = 5;
let W = 800;
let H = 800;
let BALLSIZE = 30;
let CURSORSIZE = 30;
let time;
let score;
let xpos = H/2;
let ypos = W/2;
let scorePressure = 1;
let newdist = 0;
let scorePrise = 35;
let highScore = 0;
let eps = 0;
let ingame = true;
let timecheck = 0;
let newTime = 0;
let balance = 0;
let bestEPS = 0;
let noCheese = false;

let timesEat = []
let costEat = []

let TARGETCOLOR;
let BACKGROUNDCOLOR;
let MOUSECOLOR;
let BLACK;

let eatsound;

let newCursor=true;

function gameSetup()
{ 
  ballcounter = 0;
  xpos = H/2;
  ypos = W/2;
  overall = 0;
  time = 0;
  newTime = 0;
  score = 100;
  timecheck = 0;
  ingame = true;
  scorePressure = 0;
  textFont('Georgia');
  eps = 0;
  noCheese = false;
  timesEat.splice(0,timesEat.lenght);
  costEat.splice(0,costEat.lenght);
  //while (reactions.length) { reactions.pop(); }
  reactions.length = 0;
  bestEPS = 0;
  lasttime = 0;
}


function preload()
{	
   if (getItem(0) != null)
   {
     highScore = getItem(0)/1000;
   }
   if (getItem(1) != null)
   {
    hs_avg = getItem(1)/1000;
   }
  if (getItem(2) != null)
   {
    eatenHS = getItem(2)/1000;
   }
  if (getItem(3) != null)
   {
    maxepsHS = getItem(3)/1000;
   }
  if (getItem(4) != null)
   {
    bpsHS = getItem(4)/1000;
    /* if (bpsHS !== bpsHS) //NAN check
     {
       bpsHS = 0;
     }*/
 
   }
  if (getItem(5) != null)
   {
    reactionHS = int(getItem(5));
   }
  if (getItem(6) != null)
   {
    ballsHS = getItem(6)/1000;   
   }

  eatsound = loadSound("idk.wav");
}

let cnv;
let ctx;
function setup() {
  frameRate(1000);
  TARGETCOLOR = color(255,0,0);
  BACKGROUNDCOLOR = color(7,7,7);
  MOUSECOLOR = color(255,255,255);
  BLACK = color(0,0,0);
	
console.log('new2');
  createCanvas(W, H);
  cnv = document.getElementById('defaultCanvas0');
  ctx = cnv.getContext('2d', { 
  desynchronized: true,
  preserveDrawingBuffer: true
});

	document.oncontextmenu = function() { return false; }
  document.onmousedown   = function() { return false; }
  cursor('cursor.cur', 32, 32);//noCursor();
  textSize(30);
  textAlign(CENTER,CENTER);
  
  gameSetup();
}

function draw() {
 if (ingame) //game
 { 
   ingame = !checkIfLose();
   timeAndPressure(noCheese);
   textThings(); 
   makeEpsBalance();
   makeBalls();
   checkCollision();
 }
 else //gameover
 {
   background(BLACK);
   setHighScores();
   makeGraph();
   gameOverText();
   
}
  
  
  function makeGraph()
  {
    
         let max_of_array = Math.max.apply(Math, reactions);
         let min_of_array = Math.min.apply(Math, reactions);
         let xup = W/20;
         let yup = H/20;
         let height = H/3;
         let width = W-W/20-W/20;
         let step = width/reactions.length;
         //fill(10,100,0);
         //rect(xup, yup, width, height);
         fill(0,255,200);
         verticalthing = 7;
         
         let dist = max_of_array-min_of_array;
         for (let j = 0; j<verticalthing;j++)
         {
           textSize(20);
           text((min_of_array+j*(dist/verticalthing)).toFixed(0),W/25,((verticalthing-j)/verticalthing)*height + 20);
         }
    
         textSize(30);
         let last = 0;
         strokeWeight(3);
         stroke(250,150,200);
    	for (let i=0; i<reactions.length; i++) 
        {
          let balanced_i = map(reactions[i], min_of_array, max_of_array, 0, H/3);
          if (i>0)
          {
		    line(i*step + xup, last, (i+1)*step+xup, height+yup - balanced_i);
          }
		  last = height+yup - balanced_i;
	    }
         strokeWeight(1);
         stroke(0,0,0);
  }
function timeAndPressure(noCheese)
{
   if (noCheese)
   { 
     newTime = (performance.now() - startTime)/1000;
     hunger(newTime);
   }
}
  
function setHighScores()
{
  
  if (newTime > highScore)
   {
     highScore = newTime;
     storeItem(0, 1000*highScore);
   }
   if ((overall/newTime) > hs_avg)
   {
     hs_avg = (overall/newTime);
     storeItem(1, 1000*hs_avg);
   }
   if (overall > eatenHS)
   {
     eatenHS = overall;
     storeItem(2, 1000*eatenHS);
   }
   if (bestEPS > maxepsHS)
   {
     maxepsHS = bestEPS;
     storeItem(3, 1000*maxepsHS);
   }
   
  
  
   newr.length = 0;
   for (let i = 0;i<=reactions.length-1;i++)
   {
      newr.push(reactions[i]);
   }
  
   newr.sort();
   let outliers = int((ballcounter*outlierconst));
   let sum = 0;
  
   for (let i = outliers; i<=ballcounter-outliers-1;i++)
   {
        sum+=newr[i];
   }
   ravg = int(sum/(ballcounter-2*outliers));
   if(ravg == 0)
   {
     ravg = 9999;
   }
  
   bps = 1/(ravg/1000);
  
  if(newTime > 2 && ballcounter > 2)
     {
     if (bps > bpsHS)
     {

         bpsHS = bps; 
         storeItem(4, 1000*bpsHS);
     }
   }
  
   if (ravg < reactionHS)
   {
     reactionHS = ravg;
     storeItem(5, reactionHS);
   }
  
  
  if (ballcounter > ballsHS)
  {
    ballsHS = ballcounter;
    storeItem(6, 1000*ballsHS);
  }
}

  
function gameOverText()
{
   
  
 
  
   fill(255,0,50);
   textSize(55);
   textStyle(BOLD);
   text("GAME OVER", W/2, H/2);   
   textSize(25);
   
   let heightlevel = 22;
   
   let placeleft = 14;
   textAlign(LEFT,CENTER);
   textStyle(BOLD);
   fill(250,150,200);
  
   text("Stats" ,W/placeleft,H-(H/heightlevel)*9);
   text("try C B R S keys",W/placeleft, H-(H/heightlevel)*1);
   textStyle(ITALIC);
   fill(0,255,200);
   text("Time" ,W/placeleft,H-(H/heightlevel)*8);
   text("Average balls/s" ,W/placeleft,H-(H/heightlevel)*7);
   text("Average reaction", W/placeleft, H-(H/heightlevel)*6);
   text("Balls eaten", W/placeleft, H-(H/heightlevel)*5);
   text("Scores eaten", W/placeleft, H-(H/heightlevel)*4);
   text("Maximum eat/s", W/placeleft, H-(H/heightlevel)*3);
   text("Average eat/s", W/placeleft, H-(H/heightlevel)*2);
   textAlign(CENTER,CENTER);
   
   let placemiddle = 2;
   textStyle(BOLD);
   fill(250,150,200);
   text("Now",W/placemiddle,H-(H/heightlevel)*9);
   fill(0,255,200);
   textStyle(NORMAL);
   text((newTime).toFixed(2),W/placemiddle,H-(H/heightlevel)*8); 
   text(bps.toFixed(2),W/placemiddle,H-(H/heightlevel)*7);
   text(ravg, W/placemiddle, H-(H/heightlevel)*6);
   text(ballcounter, W/placemiddle, H-(H/heightlevel)*5);
   text(overall.toFixed(0), W/placemiddle, H-(H/heightlevel)*4);
   text(bestEPS.toFixed(0), W/placemiddle, H-(H/heightlevel)*3);
   text((overall/newTime).toFixed(2), W/placemiddle, H-(H/heightlevel)*2);
  
   let placeright = 8;
   textStyle(BOLD);
   fill(250,150,200);
   text("Highscore",W-W/placeright,H-(H/heightlevel)*9);
   textStyle(NORMAL);
   fill(0,255,200);
   text(highScore.toFixed(2),W-W/placeright,H-(H/heightlevel)*8);
   text(bpsHS.toFixed(2),W-W/placeright,H-(H/heightlevel)*7);
   text(reactionHS, W-W/placeright, H-(H/heightlevel)*6);
   text(ballsHS, W-W/placeright, H-(H/heightlevel)*5);
   text(eatenHS.toFixed(0), W-W/placeright,H-(H/heightlevel)*4);
   text(maxepsHS.toFixed(0), W-W/placeright,H-(H/heightlevel)*3); 
   text(hs_avg.toFixed(2), W-W/placeright,H-(H/heightlevel)*2); 
   //textAlign(CENTER,CENTER);
  
   textStyle(BOLD);
   fill(250,150,200);
   textSize(20);
   
   text("Press H to reset HS",W-W/placeright,H-(H/heightlevel)*1);
   text("Click anywhere to play",W-W/placemiddle,H-(H/heightlevel)*1);
 }
}

function checkIfLose()
{
  return (score < 0);
}

function hunger(frametime)
{
   timedif = frametime - lasttime;
   lasttime = frametime;
   
   scorePressure = PRESSURE*log(1+frametime);
   score -= timedif * scorePressure;
}

function textThings()
{
 
 background(BACKGROUNDCOLOR); 
 
 fill(BLACK);
 rect(W/6,H/6,W-W/3,H-H/3);
  if(show)
  {
    
    
    if (!ballcolor)
    {
      alpha = 100;
    }
    else
    {
      alpha = 255;
    }
   fill(200,255,0, alpha);
   textSize(20);
   
   	text("P", W/4,H/12)
   	text("E", W/2+W/4,H/12);
   
   textSize(25);
   text(scorePressure.toFixed(0),W/4,H/12+H/20);
   text(eps.toFixed(0), W/2+W/4, H/12+H/20);
   fill(0,255,230, alpha);
   textSize(30);
   textStyle(BOLD);
   text("BallSheet by dphdmn",W/2,H-H/12);
   textSize(25);
   fill(250,150,200, alpha);
   text("v6.8 no right click",W/2,H-H/25);
   
   fill(200-balance,balance*3+150,0, alpha);
   text(balance.toFixed(0),W/2,H-H/7);
   fill(300-score,score*2,0, alpha);
   textSize(40);
   text(int(score), W/2, H/12);
    
   if (reactions.length>0)
   {
     textSize(17);
     let r = reactions[reactions.length-1]
     fill(3*r/20,150-r/20,0, alpha);
     text(int(r),W/2, H/12+H/18);
     textSize(40);
   }
  }
  
if (secretfunction)
   {	
	 fill(0,255,230, alpha);
	 ellipse(W/20,H/20, W/16, W/16); 
	 fill(0,0,0);
	 textStyle(BOLD);
	 text("R",W/20, H/20); 

	 fill(0,255,230, alpha);
	 ellipse(W-W/20,H/20, W/16, W/16); 
	 fill(0,0,0);
	 textStyle(BOLD);
	 text("S",W-W/20, H/20); 
   }
}

function makeEpsBalance()
{
 eps = getEps();
 if (eps > bestEPS)
 {
   bestEPS = eps;
 }  
   
 balance = eps-scorePressure;
}

function makeBalls()
{
  fill(MOUSECOLOR);
 if (!newCursor) {ellipse(mouseX, mouseY, CURSORSIZE, CURSORSIZE);}
  if (show && ballcolor)
  {
    fill(200-balance,balance*3+150,0);
  }
  else
  {
    fill(250,150,200);
  }
  ellipse(xpos, ypos, BALLSIZE, BALLSIZE);
}

function checkCollision()
{
  if (dist(mouseX, mouseY, xpos, ypos) < BALLSIZE/2 + CURSORSIZE/2) 
  {
   oldx = xpos;
   oldy = ypos;
    
   do
   {
     xpos = random(W/6+BALLSIZE,W-W/6-BALLSIZE);
     ypos = random(H/6+BALLSIZE+30,H-H/6-BALLSIZE-30);
   } while(
     !valueInCircle(xpos, ypos, oldx, oldy, W/2 - W/8)
     ||
     valueInCircle(xpos, ypos, oldx, oldy, W/8)
   );
    
   newdist = int(dist(oldx,oldy,xpos,ypos))/10; 
  
   if (!noCheese)
   {     
     startTime = performance.now();
     noCheese=true;
     
   }
   else
   {
     let r = 1000*(newTime-lastpicktime).toFixed(3)
    reactions.push(r);
     
    let cost = scorePrise;
     if (r < 100)
     {
       cost = cost * (r/100);
     }
    ballcounter++;
    score+= cost;
    timesEat.push(newTime);
    costEat.push(cost);
    overall += cost;
     
   }
  lastpicktime = newTime;
  eatsound.play();
  }
}

function valueInCircle(xvalue, yvalue, x, y, R)
{
  return (sqrt(abs(xvalue-x)*(abs(xvalue-x)) + (abs(yvalue-y)*abs(yvalue-y)))<R);    
}

function getEps()
{
  let sum = 0;
  
  for (let i = 0; i<=timesEat.length-1; i++)
  {
    if (timesEat[i] + EPSRANGE < newTime || timesEat[i] > newTime)
    {
      timesEat.splice(i, 1);
      costEat.splice(i, 1);
    }
  }  
  for (let j = 0; j<timesEat.length-1;j++)
  {
    sum+= costEat[j];
  }
  
  return sum/EPSRANGE;
}

function mousePressed()
{
  if (ingame)
  {
    if (dist(mouseX, mouseY, W/20, H/20) < W/32)
    {
      score=-1;
    }
    if (dist(mouseX, mouseY, W-W/20,H/20) < W/32)
    {
        show = !show;
    }
        
        
  }
  else
  {
    gameSetup();
  }
}
function checkCur(){
	if (newCursor){
		 cursor('cursor.cur', 32, 32);
	}
	else{
	noCursor();
	}
}
function keyPressed() {
  if (key === ' ' || key === 'r' || key === 'к') {
    score=-1; 
    setTimeout(mousePressed, 10);
  }
  if (key === 'h' || key === 'р')
  {
    for (let i = 0; i<=6; i++)
    {
     storeItem(i,0);
    }
    storeItem(5,9999);
    
   highScore = 0;
   bpsHS = 0;
   reactionHS = 9999;
   ballsHS = 0;
   maxepsHS = 0;
   eatenHS = 0;
   hs_avg = 0;
    /*
   if (!ingame)
   {
     gameOverText();
   }*/
  }
	if (key === 'o'){
	newCursor=!newCursor;
		checkCur();
	}
  if (key === 's' || key === 'ы')
  {
    show = !show;
  }
  if( key === 'b' || key === 'B' || key === 'и' || key === 'И')
  {
	  secretfunction = !secretfunction;
  }
  if (key === 'c' || key === 'C' || key === 'с' || key === 'С')
  {
    ballcolor = !ballcolor;
  }
  
}
