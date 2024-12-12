
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(200, 200, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#F50EB6";
        ctx.fill();
        ctx.closePath();
        var x = canvas.width / 2;
        var y = canvas.height - 30;
        var dx = 2;
        var dy = -2;
        var ballRadius = 10;
        var paddleHeight = 10;
        var paddleWidth = 100;
        var paddleX = (canvas.width - paddleWidth) / 2;
        var rightPressed = false;
        var leftPressed = false;
        var brickRowCount = 5;
        var brickColumnCount = 3;
        var brickWidth = 75;
        var brickHeight = 20;
        var brickPadding = 10;
        var brickOffsetTop = 30;
        var brickOffsetLeft = 30;

        var bricks = [];
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        var score = 0;
        var lives = 3;
        var backgroundColor = "#8d8787"; 
        var elementColor = "#F50EB6";    
        var gameStarted = false;

        document.getElementById("couleurback").addEventListener("input", function() {
            backgroundColor = this.value;
            canvas.style.backgroundColor = backgroundColor;
        });

        document.getElementById("couleurtitre").addEventListener("input", function() {
            elementColor = this.value;
            document.getElementById("montitre").style.color = elementColor;
            
        });



        document.getElementById("monbouton").addEventListener("click", function() {
            if (!gameStarted) {
                gameStarted = true; 
                draw(); 
            }
        });

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 10, 0, Math.PI * 2);
            ctx.fillStyle = elementColor;
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = elementColor;
            ctx.fill();
            ctx.closePath();
        }

        function drawBricks() {
            for (var c = 0; c < brickColumnCount; c++) {
                for (var r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status == 1) {
                        var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                        var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = elementColor;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function drawLives() {
            ctx.font = "16px Arial";
            ctx.fillStyle = elementColor;
            ctx.fillText("Vies: " + lives, canvas.width - 65, 20);
        }

        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = elementColor;
            ctx.fillText("Score: " + score, 8, 20);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            collisionDetection();
            drawScore();
            drawLives();

            if (y + dy < ballRadius) {
                dy = -dy;
            }
            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if (y + dy > canvas.height - ballRadius) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                } else {
                    lives--;
                    if (lives === 0) {
                        alert("GAME OVER");
                        document.location.reload();
                        return;
                    } else {
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 2;
                        dy = -2;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }

            x += dx;
            y += dy;

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 8;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 8;
            }

            if (gameStarted) {
                requestAnimationFrame(draw);
            }
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        function keyDownHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = true;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = false;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = false;
            }
        }

        function mouseMoveHandler(e) {
            var relativeX = e.clientX - canvas.offsetLeft;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
            }
        }

        function collisionDetection() {
            for (var c = 0; c < brickColumnCount; c++) {
                for (var r = 0; r < brickRowCount; r++) {
                    var b = bricks[c][r];
                    if (b.status == 1) {
                        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if (score == brickRowCount * brickColumnCount) {
                                alert("YOU WIN, CONGRATULATIONS!");
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }


// function setCookie(name, value, days) {
//     var expires = "";
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = "; expires=" + date.toUTCString();
//     }
//     document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// function getCookie(name) {
//     var nameEQ = name + "=";
//     var ca = document.cookie.split(';');
//     for (var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') c = c.substring(1, c.length);
//         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
//     }
//     return null;
// }

// function eraseCookie(name) {
//     document.cookie = name + "=; Max-Age=-99999999;";
// }

// // Variables globales pour les préférences
// var backgroundColor = getCookie("backgroundColor") || "#8d8787";
// var elementColor = getCookie("elementColor") || "#F50EB6";

// // Appliquer les couleurs sauvegardées au chargement
// window.onload = function () {
//     document.getElementById("couleurback").value = backgroundColor;
//     canvas.style.backgroundColor = backgroundColor;

//     document.getElementById("couleurtitre").value = elementColor;
//     document.getElementById("montitre").style.color = elementColor;
// };

// // Sauvegarder et appliquer les modifications des couleurs
// document.getElementById("couleurback").addEventListener("input", function () {
//     backgroundColor = this.value;
//     canvas.style.backgroundColor = backgroundColor;
//     setCookie("backgroundColor", backgroundColor, 7); // Sauvegarder pour 7 jours
// });

// document.getElementById("couleurtitre").addEventListener("input", function () {
//     elementColor = this.value;
//     document.getElementById("montitre").style.color = elementColor;
//     setCookie("elementColor", elementColor, 7); // Sauvegarder pour 7 jours
// });
var backgroundColor = localStorage.getItem("backgroundColor") || "#8d8787";
var elementColor = localStorage.getItem("elementColor") || "#F50EB6";

// Appliquer les couleurs sauvegardées au chargement
window.onload = function () {
    // Appliquer les préférences sauvegardées
    document.getElementById("couleurback").value = backgroundColor;
    canvas.style.backgroundColor = backgroundColor;

    document.getElementById("couleurtitre").value = elementColor;
    document.getElementById("montitre").style.color = elementColor;
};

// Sauvegarder et appliquer les modifications des couleurs
document.getElementById("couleurback").addEventListener("input", function () {
    backgroundColor = this.value;
    canvas.style.backgroundColor = backgroundColor;
    localStorage.setItem("backgroundColor", backgroundColor); // Sauvegarder dans Local Storage
});

document.getElementById("couleurtitre").addEventListener("input", function () {
    elementColor = this.value;
    document.getElementById("montitre").style.color = elementColor;
    localStorage.setItem("elementColor", elementColor); // Sauvegarder dans Local Storage
});