void setup() {
  size(600, 600);
  noStroke();
  textSize(30);
  textAlign(CENTER,CENTER);
}
int score = 0;
float xpos = 0;
float ypos = 0;
void draw() {
  score--;
 background(126);
 text("Score:" + score, 300, 50);
  ellipse(mouseX, mouseY, 30, 30);
  ellipse(xpos, ypos, 30, 30);
  if (mouseX > xpos-15 & mouseX < xpos+15 & mouseY > ypos-15 & mouseY < ypos+15) {
   xpos = random(0,600);
 ypos = random(0,600);
 score+=100;
 println(score);
  }
}
