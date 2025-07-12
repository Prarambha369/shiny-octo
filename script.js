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
        this.startBtn.addEventListener("click", () => this.startGame())
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

    handleInput() {
        if (this.gameState === "playing") {
            this.bird.velocity = this.bird.jumpPower
            this.sounds.jump()
            this.createParticles(this.bird.x, this.bird.y, "#FFD700", 5)
        }
    }

    startGame() {
        this.gameState = "playing"
        this.startScreen.classList.add("hidden")
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
