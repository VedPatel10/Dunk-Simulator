// Open program in new tab for best experience!
// Ved Patel
// Jan 30, 2022
// Computer Science, Grade 11

// Game area
let myCanvas = document.getElementById("myCanvas"),
  c = myCanvas.getContext("2d")
myCanvas.width = window.innerWidth / 1.6
myCanvas.height = window.innerHeight / 1.6

let gravity = 0.1
let airResistance = 0.935
let score = 0
let mode = "Rookie Mode"
var down = false
let gameOn = false



// playerTracker is used to track when you dunk. playerTracker[0] tracks if basketball is above basket. playerTracker[1] tracks if basketball is below basket. Moving to the left or right of a basket sets playerTracker[0] and playerTracker[1] to false. In order for a dunk to count, playerTracker[0] and playerTracker[1] must both be true 
let playerTracker = []

class Player {
  constructor() {
    this.position = {
      x: 50,
      y: 50
    }
    this.velocity = {
      x: 0,
      y: 1
    }
    this.radius = 7
    this.colour = 'orange'
  }

  // Method that draws the basketball in the canvas 
  draw() {
    c.beginPath()
    c.fillStyle = this.colour
    c.arc(this.position.x, this.position.y, this.radius, 0,
      Math.PI * 2)
    c.fill()
  }

  // Method that moves basketball
  update() {
    this.draw()

    // Max vertical velocity
    if (player.velocity.y < -7) {
      player.velocity.y = -6
    }
    // Max horizontal velocity
    if (player.velocity.x > 4) {
      player.velocity.x = 4
    }
    if (player.velocity.x < -4) {
      player.velocity.x = -4
    }

    // Make ball fall using gravity
    if (this.position.y + this.radius + this.velocity.y <= myCanvas.height) {
      this.velocity.y += gravity
    }
    // Prevents player from going above canvas
    if (this.position.y - player.radius <= 0) {
      this.position.y = 0
      this.velocity.y += Math.abs(this.velocity.y)
    }
    // Prevents player from going past left of canvas
    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius
      this.velocity.x = -this.velocity.x + 3
      keysPressed.left = false
    }
    // Prevents played from past right of canvas
    if (this.position.x + this.radius >= myCanvas.width) {
      this.position.x = myCanvas.width - this.radius
      this.velocity.x = -this.velocity.x - 3
      keysPressed.right = false
    }
    // Horizontal movement
    if (keysPressed.right == true) {
      player.velocity.x++

    }
    else if (keysPressed.left == true) {
      player.velocity.x--
    }

    this.position.y += this.velocity.y
    this.velocity.x *= airResistance
    this.position.x += this.velocity.x
  }
}

class Basket {
  constructor() {
    this.position = {
      // Baskets spawn at right side of canvas
      x: window.innerWidth,
      // Baskets spawn at random height in certain horizontal range
      // ((max height) - min height) + min height
      y: Math.random() * ((myCanvas.height - 70) - 100) + 100
    }
    this.velocity = {
      // Speed that baskets move horizontally (negative x velocity means they move left)
      x: -1.8,
      y: 0
    }
    this.width = 100
    this.height = 8
    this.wentThrough = false
  }

  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw()
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
  }
}

// The player object
let player = new Player()

// Array that holds all basket objects
let baskets = []

// Track horizontal movement
let keysPressed = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

// Reset function that is called when user clicks to play new game. Resets player, removes all baskets, resets score 
function initialize() {
  player = new Player()
  baskets = []
  score = 0
  mode = "Rookie Mode"
}

function spawnBaskets() {
  // Create new basket object every 2.5 seconds (only if user is currently playing!) 
  setInterval(() => {
    if (gameOn == true) {
      baskets.push(new Basket())
    }
  }, 2500)
}

// Function that changes score and mode
function drawScore() {
  c.font = "5vh verdana";
  c.fillStyle = "blue";
  c.fillText("Dunks: " + score, 10, myCanvas.height / 4.25);
  c.fillText(mode, 10, myCanvas.height / 8);
}


let animationId
function animates() {
  // animates() runs every frame
  animationId = requestAnimationFrame(animates)

  // Clear canvas every frame so player, baskets, and score can be drawn every frame
  c.clearRect(0, 0, myCanvas.width, myCanvas.height)

  // Draw player on canvas with movement
  player.update()
  drawScore()

  // Loss condition - if the basketball touches the ground
  if (player.position.y + player.radius >= myCanvas.height) {
    // This stops animates() from running every frame, everything stops moving
    cancelAnimationFrame(animationId)
    // Stops baskets from spawning every 2.5 seconds
    gameOn = false
  }

  // Movement and collision detection for each basket 
  baskets.forEach(basket => {
    basket.update()
    // BASKET COLLISION DETECTION (weird)

    // Horizontal range of basket
    if (player.position.x + player.radius >= basket.position.x && player.position.x - player.radius <= basket.position.x + basket.width) {
      // Above basket
      if (player.position.y + player.radius <= basket.position.y) {
        playerTracker[0] = true
        // Touching top side of basket
        if (player.position.y + player.radius + player.velocity.y >= basket.position.y) {
          // If touching rim
          if (player.position.x - player.radius <= basket.position.x + 20 || player.position.x + player.radius >= basket.position.x + basket.width - 20) {
            player.velocity.y = -2
          }
        }
      }
      // Below basket
      else if (player.position.y - player.radius >= basket.position.y + basket.height) {
        playerTracker[1] = true
        // Touching bottom of basket
        if (player.position.y - player.radius + player.velocity.y <= basket.position.y + basket.height) {
          player.velocity.y = 2
          down = true
        }
      }
    }

    // To the left of basket
    if (player.position.x + player.radius <= basket.position.x && player.position.x - player.radius >= basket.position.x - 100) {
      playerTracker[0] = false
      playerTracker[1] = false
      // In y-level of basket
      if (player.position.y - player.radius <= basket.position.y + basket.height && player.position.y + player.radius >= basket.position.y) {
        // If touching left side of basket
        if (player.position.x + player.radius + player.velocity.x >= basket.position.x) {
          keysPressed.right = false
          player.velocity.x = - player.velocity.x * 2
        }
      }
    }

    // To the right of basket
    if (player.position.x - player.radius >= basket.position.x + basket.width && player.position.x + player.radius <= basket.position.x + basket.width + 100) {
      playerTracker[0] = false
      playerTracker[1] = false
      // In y-level of basket
      if (player.position.y - player.radius <= basket.position.y + basket.height && player.position.y + player.radius >= basket.position.y) {
        // If touching right side of basket
        if (player.position.x - player.radius + player.velocity.x <= basket.position.x + basket.width) {
          keysPressed.left = false
          player.velocity.x = - player.velocity.x
        }
      }
    }

    // Increase score by 1 if ball went from above basket to below basket without going to the left or right of it (playerTracker array keeps track of this)
    // wentThrough prevents user from dunking on the same basket more than once to increase score
    if (playerTracker[0] == true && playerTracker[1] == true) {
      if (basket.wentThrough == false) score++
      basket.wentThrough = true
      playerTracker[0] = false
      playerTracker[1] = false
    }

    // Reach different scores to increase basket speed
    if (score > 20) {
      mode = "Hall of Fame"
      basket.velocity.x = -4.7
    }
    else if (score > 11) {
      mode = "NBA Mode"
      basket.velocity.x = -2.75
    }
    else if (score > 4) {
      mode = "Pro Mode"
      basket.velocity.x = -2.15
    }

    // Another lose condition - checks to see if the player didn't go through a basket and that basket is moves off of the canvas
    if (basket.position.x + basket.width < 0 && basket.wentThrough == false) {
      // console.log("missed this")

      // Stop everything from moving 
      cancelAnimationFrame(animationId)
      gameOn = false
    }

    // The setTimeout is used to get rid of flashing that would  happen to baskets when one gets removed from array
    // Removing baskets that are not on screen removes potential lag
    if (basket.position.x + basket.width < 0) {
      setTimeout(() => {
        baskets.shift()
      }, 0)
    }

  })

  // Make menu buttons show only if game is not being played
  if (gameOn == false) {
    if (score >= 21) {
      document.getElementById("startButton").innerHTML = "You Win!<br>Play Again"
    } else document.getElementById("startButton").innerHTML = "Play Again"
    document.getElementById("startButton").style.display = "block"
    document.getElementById("instructionsButton").style.display = "block"
  }
  else {
    document.getElementById("startButton").style.display = "none"
    document.getElementById("instructionsButton").style.display = "none"
    document.getElementById("infoPara").style.display = 'none'
  }
}

// Called whenever play button is clicked
function start() {
  gameOn = true
  initialize()
  animates()
  // spawnBaskets() will only be called once, since the text of the play button changes to 'Play Again' after the first play. If spawnBaskets() was called more than once, baskets would double every time 
  if (document.getElementById("startButton").innerHTML == "Play") {
    spawnBaskets()
  }
}

// Show instructions paragraph when instructions button is pressed
function instructions() {
  if (document.getElementById("infoPara").style.display = 'none') {
    document.getElementById("infoPara").style.display = 'block'
  }
}



window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 87:
      // console.log("Up")
      if (down) return;
      down = true;
      player.velocity.y -= 6
      break;
    case 65:
      // console.log("Left")
      keysPressed.left = true
      // player.velocity.x = -4
      break;
    case 68:
      // console.log("Right")
      // player.velocity.x = 4
      keysPressed.right = true
      break;
  }
})

window.addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 87:
      // console.log("Up")
      down = false;
      break;
    case 65:
      // console.log("Left")
      // player.velocity.x = 0
      keysPressed.left = false
      break;
    case 68:
      // console.log("Right")
      // player.velocity.x = 0
      keysPressed.right = false
      break;
  }
})

// EASTER EGG - press e to randoomize ball colour
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 69) {
    player.colour = `hsl(${Math.random() * 360}, 50%, 50%)`
  }
});
