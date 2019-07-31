//le casse brique du monde de houck

var lancer = document.getElementById("lancer");

var canvas = document.getElementById("myCanvas"); //reference canvas
var ctx = canvas.getContext("2d"); //stockage du rendu 2d

//varable de position de la balle
var x = canvas.width / 2; //position x de la ballle
var y = canvas.height - 55; //position y de la balle

//variable pour la construction de la balle
var ballRadius = 10; //rayon de la balle
var ballColor = "blue";

//variable pour le mouvement de la balle
var dx = 3; //variation de la position en x
var dy = -3; //variation de la position en y

//variable pour la construction du paddle
var paddleHeight = 10; //hauteur du paddle
var paddleWidth = 150; // largeur du paddle

//variable pour la position du paddle
var paddleX = (canvas.width - paddleWidth) / 2

//variable pour les commandes du paddle
var rightPressed = false;
var leftPressed = false;

//variable de creation du champ de briques 
var brickRowCount = 7; // nombre de ligne de briques
var brickColumnCount = 10; //nombres de colone de briques
var brickWidth = 75; //largeur des briques
var brickHeight = 20; //hauteur des briques
var brickPadding = 10; //ecartement entre les briques
var brickOffsetTop = 30; //ecart avec le haut de la toile
var brickOffsetLeft = 30; //ecart avec la gauche de la toile

//creation du tableau a 2 dimensions
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "purple";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//variable de score
var score = 0;

function drawBall() //dessine une balle
{
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() //dessine un paddle
{
    ctx.beginPath();
    ctx.rect(paddleX, (canvas.height - (paddleHeight + 30)), paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function draw() //boucle qui redessine la scene avec les modifs(moteur)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();

    //condition if pour gerer le changement de direction lors de l arrivé sur les bords (le rebond)
    if (y + dy < ballRadius) {
        dy = -dy;
        ballColor = "red";
    } else if (y + dy > canvas.height - (ballRadius + 30)) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            ballColor = "white"
        } else {
            alert("GAME OVER");
            document.location.reload();
        }
    }
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
        ballColor = "yellow";
    }
    drawPaddle();

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 10;
        //console.log("droite ");
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 10;
        //console.log("gauche")
    }
    x += dx;
    y += dy;
    drawBricks();
    collisionDetection();
    drawscore();
    
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
} //action lorsque la touche est pressé

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
} //action lorsque l on relache la touche
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++; //incremente le score a chaque collision
                    ballColor = "blue";
                    //condition lorsqu il n y a plus de brique a cassé: on gagne
                    if (score == brickRowCount * brickColumnCount) {
                        alert("Félicitaion, vous avez gagnez !!!");
                        document.location.reload();
                        clearInterval(interval); //fin de jeu dans chrome
                    }
                }
            }

        }
    }
}

function drawscore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("Score: " + score, 8, 20);
    
}

function lanceur() {
    setInterval(draw, 10);
}

//appelle la fonction draw toutes les 10 millisecondes

//todo: amelioration affichage (tableau de score)
// ajouter un nombre de vie
// rendre la direction un peu plus aleatoire au changement de direction
// creer des niveaux taille du paddle, vitesse de balle , taille de balle , nombre de balle.... 
