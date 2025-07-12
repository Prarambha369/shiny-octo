class FlappyBirdGame {
    constructor() {
        this.canvas = document.getElementById("gameCanvas")
        this.ctx = this.canvas.getContext("2d")
        this.gameState = "start" // start, playing, gameOver
        this.soundEnabled = true

        // Set canvas dimensions to fill the window
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        // Game objects
        this.bird = {
            x: 100,
            y: this.canvas.height / 2,
            width: 40,
            height: 30,
            velocity: 0,
            gravity: 0.25, // Further reduced gravity
            jumpPower: -7, // Further reduced jump power
            rotation: 0,
            wingPhase: 0,
        }

        this.pipes = []
        this.particles = []
        this.clouds = []
        this.score = 0
        this.highScore = localStorage.getItem("flappyHighScore") || 0

        // Visual effects
        this.backgroundOffset = 0
        this.pipeGap = 180 // Made easier
        this.pipeWidth = 45 // Made pipes narrower, from 60 to 45
        this.pipeSpeed = 1.5 // Made easier

        this.initializeElements()
        this.createSounds()
        this.generateClouds()
        this.bindEvents()
        this.updateUI()
        this.gameLoop()

        // Handle window resizing
        window.onresize = () => this.resizeCanvas()
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        // Adjust bird position if it goes off screen after resize
        if (this.bird.y + this.bird.height > this.canvas.height) {
            this.bird.y = this.canvas.height - this.bird.height
        }
    }

    initializeElements() {
        this.scoreElement = document.getElementById("score")
        this.highScoreElement = document.getElementById("highScore")
        this.startScreen = document.getElementById("startScreen")
        this.gameOverScreen = document.getElementById("gameOverScreen")
        this.startBtn = document.getElementById("startBtn")
        this.restartBtn = document.getElementById("restartBtn")
        this.muteBtn = document.getElementById("muteBtn")
        this.finalScoreElement = document.getElementById("finalScore")
        this.finalHighScoreElement = document.getElementById("finalHighScore")
    }

    createSounds() {
        // Create audio context for sound effects
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

        this.sounds = {
            jump: this.createSound(800, 0.1, "sine"),
            score: this.createSound(1200, 0.2, "square"),
            gameOver: this.createSound(200, 0.5, "sawtooth"),
        }
    }

    createSound(frequency, duration, type = "sine") {
        return () => {
            if (!this.soundEnabled) return

            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
            oscillator.type = type

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

            oscillator.start(this.audioContext.currentTime)
            oscillator.stop(this.audioContext.currentTime + duration)
        }
    }

    generateClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height / 3) + 50, // Clouds in upper third
                size: Math.random() * 30 + 20,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.3 + 0.1,
            })
        }
    }

    bindEvents() {
        this.startBtn.addEventListener("click", () => this.handleCountdownStart())
        this.restartBtn.addEventListener("click", () => this.restartGame())
        this.muteBtn.addEventListener("click", () => this.toggleSound())

        document.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                e.preventDefault()
                this.handleInput()
            }
        })

        this.canvas.addEventListener("click", () => this.handleInput())
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault()
            this.handleInput()
        })
    }

    handleCountdownStart() {
        // Hide start screen, show countdown
        this.startScreen.classList.add("hidden")
        const countdownOverlay = document.getElementById("countdownOverlay")
        const countdownContent = document.getElementById("countdownContent")
        countdownOverlay.style.display = "flex"
        let count = 5
        countdownContent.textContent = count
        countdownContent.style.animation = "none"
        void countdownContent.offsetWidth // force reflow for animation
        countdownContent.style.animation = null
        const tick = () => {
            if (count > 1) {
                count--
                countdownContent.textContent = count
                countdownContent.style.animation = "none"
                void countdownContent.offsetWidth
                countdownContent.style.animation = null
                setTimeout(tick, 1000)
            } else {
                countdownContent.textContent = "Start!"
                countdownContent.style.animation = "none"
                void countdownContent.offsetWidth
                countdownContent.style.animation = null
                setTimeout(() => {
                    countdownOverlay.style.display = "none"
                    this.startGame()
                }, 800)
            }
        }
        setTimeout(tick, 1000)
    }

    handleInput() {
        if (this.gameState === "playing") {
            this.bird.velocity = this.bird.jumpPower
            this.sounds.jump()
            this.createParticles(this.bird.x, this.bird.y, "#FFD700", 5)
        }
    }

    startGame() {
        this.gameState = "playing"
        this.resetGame()
    }

    restartGame() {
        this.gameState = "playing"
        this.gameOverScreen.classList.add("hidden")
        this.resetGame()
    }

    resetGame() {
        this.bird.y = this.canvas.height / 2 // Reset to middle
        this.bird.velocity = 0
        this.bird.rotation = 0
        this.pipes = []
        this.particles = []
        this.score = 0
        this.updateUI()
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled
        this.muteBtn.textContent = this.soundEnabled ? "🔊" : "🔇"
    }

    updateUI() {
        this.scoreElement.textContent = this.score
        this.highScoreElement.textContent = this.highScore
    }

    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                color: color,
                size: Math.random() * 4 + 2,
            })
        }
    }

    updateBird() {
        if (this.gameState !== "playing") return

        this.bird.velocity += this.bird.gravity
        this.bird.y += this.bird.velocity

        // Bird rotation based on velocity
        this.bird.rotation = Math.min(Math.max(this.bird.velocity * 0.03, -0.5), 0.5) // Reduced from 0.1 to 0.03 for less dramatic rotation

        // Wing flapping animation
        this.bird.wingPhase += 0.3

        // Check boundaries
        if (this.bird.y < 0 || this.bird.y + this.bird.height > this.canvas.height) {
            this.gameOver()
        }
    }

    updatePipes() {
        if (this.gameState !== "playing") return

        // Generate new pipes
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 250) {
            // Adjusted spacing
            const minGapY = 50
            const maxGapY = this.canvas.height - this.pipeGap - 50
            const gapY = Math.random() * (maxGapY - minGapY) + minGapY
            this.pipes.push({
                x: this.canvas.width,
                topHeight: gapY,
                bottomY: gapY + this.pipeGap,
                scored: false,
                hue: Math.random() * 360,
            })
        }

        // Update pipe positions
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i]
            pipe.x -= this.pipeSpeed

            // Check for scoring
            if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.scored = true
                this.score++
                this.sounds.score()
                this.createParticles(this.bird.x, this.bird.y, "#00FF00", 8)
                this.updateUI()

                if (this.score > this.highScore) {
                    this.highScore = this.score
                    localStorage.setItem("flappyHighScore", this.highScore)
                }
            }

            // Remove off-screen pipes
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1)
            }

            // Collision detection
            if (this.checkCollision(pipe)) {
                this.gameOver()
            }
        }
    }

    checkCollision(pipe) {
        const birdLeft = this.bird.x
        const birdRight = this.bird.x + this.bird.width
        const birdTop = this.bird.y
        const birdBottom = this.bird.y + this.bird.height

        const pipeLeft = pipe.x
        const pipeRight = pipe.x + this.pipeWidth

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
                return true
            }
        }

        return false
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i]
            particle.x += particle.vx
            particle.y += particle.vy
            particle.life -= particle.decay
            particle.vy += 0.1 // gravity

            if (particle.life <= 0) {
                this.particles.splice(i, 1)
            }
        }
    }

    updateClouds() {
        this.clouds.forEach((cloud) => {
            cloud.x -= cloud.speed
            if (cloud.x + cloud.size < 0) {
                cloud.x = this.canvas.width + cloud.size
                cloud.y = Math.random() * (this.canvas.height / 3) + 50 // Keep clouds in upper third
            }
        })
    }

    gameOver() {
        if (this.gameState === "gameOver") return

        this.gameState = "gameOver"
        this.sounds.gameOver()
        this.createParticles(this.bird.x, this.bird.y, "#FF0000", 15)

        this.finalScoreElement.textContent = this.score
        this.finalHighScoreElement.textContent = this.highScore

        setTimeout(() => {
            this.gameOverScreen.classList.remove("hidden")
        }, 500)
    }

    drawBackground() {
        // Animated gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
        gradient.addColorStop(0, "#87CEEB")
        gradient.addColorStop(0.7, "#98FB98")
        gradient.addColorStop(1, "#90EE90")

        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw clouds
        this.clouds.forEach((cloud) => {
            this.ctx.save()
            this.ctx.globalAlpha = cloud.opacity
            this.ctx.fillStyle = "white"
            this.ctx.beginPath()
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2)
            this.ctx.arc(cloud.x + cloud.size * 0.5, cloud.y, cloud.size * 0.8, 0, Math.PI * 2)
            this.ctx.arc(cloud.x - cloud.size * 0.5, cloud.y, cloud.size * 0.8, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.restore()
        })
    }

    drawBird() {
        this.ctx.save()
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2)
        this.ctx.rotate(this.bird.rotation)

        // Bird body - more oval, vibrant orange
        const bodyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 25)
        bodyGradient.addColorStop(0, "#FF8C00") // Darker orange
        bodyGradient.addColorStop(0.7, "#FFA500") // Medium orange
        bodyGradient.addColorStop(1, "#FFD700") // Lighter orange

        this.ctx.fillStyle = bodyGradient
        this.ctx.beginPath()
        this.ctx.ellipse(0, 0, this.bird.width / 2 + 5, this.bird.height / 2 + 2, 0, 0, Math.PI * 2) // Slightly larger, more oval
        this.ctx.fill()

        // Wing animation - more distinct red
        const wingOffset = Math.sin(this.bird.wingPhase) * 7 // Increased wing flap motion
        this.ctx.fillStyle = "#FF4500" // Brighter red
        this.ctx.beginPath()
        this.ctx.ellipse(-10, wingOffset, 10, 15, 0, 0, Math.PI * 2) // Larger, more pronounced wing
        this.ctx.fill()

        // Eye - simplified
        this.ctx.fillStyle = "white"
        this.ctx.beginPath()
        this.ctx.arc(10, -5, 5, 0, Math.PI * 2) // Slightly larger eye
        this.ctx.fill()

        this.ctx.fillStyle = "black"
        this.ctx.beginPath()
        this.ctx.arc(12, -5, 2.5, 0, Math.PI * 2) // Smaller pupil
        this.ctx.fill()

        // Beak - sharper
        this.ctx.fillStyle = "#FFD700" // Yellowish beak
        this.ctx.beginPath()
        this.ctx.moveTo(15, 0)
        this.ctx.lineTo(25, -3)
        this.ctx.lineTo(25, 3)
        this.ctx.closePath()
        this.ctx.fill()

        this.ctx.restore()
    }

    drawPipes() {
        this.pipes.forEach((pipe) => {
            const gradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + this.pipeWidth, 0)
            gradient.addColorStop(0, `hsl(${pipe.hue}, 70%, 50%)`)
            gradient.addColorStop(0.5, `hsl(${pipe.hue}, 70%, 60%)`)
            gradient.addColorStop(1, `hsl(${pipe.hue}, 70%, 40%)`)

            this.ctx.fillStyle = gradient

            // Top pipe body
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight)

            // Top pipe cap - simplified
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 25, this.pipeWidth + 10, 25) // Wider and taller cap

            // Bottom pipe body
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY)

            // Bottom pipe cap - simplified
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 25) // Wider and taller cap

            // Pipe highlights - subtle
            this.ctx.fillStyle = `hsl(${pipe.hue}, 70%, 75%)` // Lighter highlight
            this.ctx.fillRect(pipe.x + 3, 0, 3, pipe.topHeight) // Thinner highlight
            this.ctx.fillRect(pipe.x + 3, pipe.bottomY, 3, this.canvas.height - pipe.bottomY) // Thinner highlight
        })
    }

    drawParticles() {
        this.particles.forEach((particle) => {
            this.ctx.save()
            this.ctx.globalAlpha = particle.life
            this.ctx.fillStyle = particle.color
            this.ctx.beginPath()
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.restore()
        })
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawBackground()
        this.drawPipes()
        this.drawBird()
        this.drawParticles()
    }

    gameLoop() {
        this.updateBird()
        this.updatePipes()
        this.updateParticles()
        this.updateClouds()
        this.render()

        requestAnimationFrame(() => this.gameLoop())
    }
}

// Hide loading screen when game is ready
window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loadingScreen")
    if (loadingScreen) loadingScreen.style.display = "none"
    new FlappyBirdGame()
})