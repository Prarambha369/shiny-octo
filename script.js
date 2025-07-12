window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loadingScreen")
    const spriteSelectOverlay = document.getElementById("spriteSelectOverlay")
    const octoBtn = document.getElementById("octoBtn")
    const birdBtn = document.getElementById("birdBtn")
    const shinycotoBtn = document.getElementById("shinycotoBtn")
    const octoPreviewCanvas = document.getElementById("octoPreviewCanvas")
    const birdPreviewCanvas = document.getElementById("birdPreviewCanvas")
    const shinycotoPreviewCanvas = document.getElementById("shinycotoPreviewCanvas")
    let selectedSprite = localStorage.getItem("selectedSprite") || "octo"
    let gameInstance = null

    function drawPreview(ctx, spriteType) {
        ctx.clearRect(0, 0, 40, 40)
        ctx.save()
        ctx.translate(20, 20)
        if (spriteType === "bird") {
            let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 15)
            grad.addColorStop(0, "#FF8C00")
            grad.addColorStop(0.7, "#FFA500")
            grad.addColorStop(1, "#FFD700")
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.save()
            ctx.rotate(-0.3)
            ctx.fillStyle = "#FF4500"
            ctx.beginPath()
            ctx.ellipse(-7, 6, 7, 7, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
            ctx.fillStyle = "white"
            ctx.beginPath()
            ctx.arc(7, -3, 3, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "black"
            ctx.beginPath()
            ctx.arc(8, -3, 1.2, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "#FFD700"
            ctx.beginPath()
            ctx.moveTo(12, 0)
            ctx.lineTo(17, -2)
            ctx.lineTo(17, 2)
            ctx.closePath()
            ctx.fill()
        } else if (spriteType === "octo") {
            let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 15)
            grad.addColorStop(0, "#a18fff")
            grad.addColorStop(0.7, "#5b4fff")
            grad.addColorStop(1, "#00eaff")
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.ellipse(0, 0, 13, 13, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = "#00eaff"
            ctx.lineWidth = 2
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath()
                ctx.moveTo(i * 3, 8)
                ctx.lineTo(i * 3, 18)
                ctx.stroke()
            }
            ctx.fillStyle = "white"
            ctx.beginPath()
            ctx.arc(5, -4, 3, 0, Math.PI * 2)
            ctx.arc(-5, -4, 3, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "#222"
            ctx.beginPath()
            ctx.arc(5, -4, 1.2, 0, Math.PI * 2)
            ctx.arc(-5, -4, 1.2, 0, Math.PI * 2)
            ctx.fill()
        } else if (spriteType === "shinycoto") {
            let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 16)
            grad.addColorStop(0, "#f7eaff")
            grad.addColorStop(0.5, "#b6a0ff")
            grad.addColorStop(0.8, "#7ee3ff")
            grad.addColorStop(1, "#5e17eb")
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.ellipse(0, 0, 14, 14, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = "#7ee3ff"
            ctx.lineWidth = 2
            for (let i = -2.5; i <= 2.5; i+=1.25) {
                ctx.beginPath()
                ctx.moveTo(i * 3, 9)
                ctx.lineTo(i * 3, 18)
                ctx.stroke()
            }
            ctx.fillStyle = "white"
            ctx.beginPath()
            ctx.arc(6, -5, 2.5, 0, Math.PI * 2)
            ctx.arc(-6, -5, 2.5, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "#3d2e85"
            ctx.beginPath()
            ctx.arc(6, -5, 1, 0, Math.PI * 2)
            ctx.arc(-6, -5, 1, 0, Math.PI * 2)
            ctx.fill()
            ctx.globalAlpha = 0.7
            ctx.fillStyle = "#fff"
            ctx.beginPath()
            ctx.arc(0, -10, 2, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.restore()
    }
    if (octoPreviewCanvas) drawPreview(octoPreviewCanvas.getContext("2d"), "octo")
    if (birdPreviewCanvas) drawPreview(birdPreviewCanvas.getContext("2d"), "bird")
    if (shinycotoPreviewCanvas) drawPreview(shinycotoPreviewCanvas.getContext("2d"), "shinycoto")

    function showSpriteSelect() {
        spriteSelectOverlay.style.display = "flex"
    }
    function hideSpriteSelect() {
        spriteSelectOverlay.style.display = "none"
    }
    function selectSprite(sprite) {
        selectedSprite = sprite
        localStorage.setItem("selectedSprite", sprite)
        if (sprite === "octo") {
            octoBtn.classList.add("selected")
            birdBtn.classList.remove("selected")
            shinycotoBtn.classList.remove("selected")
        } else if (sprite === "bird") {
            octoBtn.classList.remove("selected")
            birdBtn.classList.add("selected")
            shinycotoBtn.classList.remove("selected")
        } else if (sprite === "shinycoto") {
            octoBtn.classList.remove("selected")
            birdBtn.classList.remove("selected")
            shinycotoBtn.classList.add("selected")
        }
    }
    function destroyGameInstance() {
        if (gameInstance && typeof gameInstance.destroy === "function") {
            gameInstance.destroy()
        }
        gameInstance = null
    }
    octoBtn.onclick = () => {
        selectSprite("octo")
        hideSpriteSelect()
        if (loadingScreen) loadingScreen.style.display = "none"
        destroyGameInstance()
        gameInstance = new FlappyBirdGame("octo")
        setTimeout(() => gameInstance.handleCountdownStart(), 100)
    }
    birdBtn.onclick = () => {
        selectSprite("bird")
        hideSpriteSelect()
        if (loadingScreen) loadingScreen.style.display = "none"
        destroyGameInstance()
        gameInstance = new FlappyBirdGame("bird")
        setTimeout(() => gameInstance.handleCountdownStart(), 100)
    }
    shinycotoBtn.onclick = () => {
        selectSprite("shinycoto")
        hideSpriteSelect()
        if (loadingScreen) loadingScreen.style.display = "none"
        destroyGameInstance()
        gameInstance = new FlappyBirdGame("shinycoto")
        setTimeout(() => gameInstance.handleCountdownStart(), 100)
    }
    selectSprite(selectedSprite)
    showSpriteSelect()
})

class FlappyBirdGame {
    constructor(spriteType = "octo") {
        this.spriteType = spriteType
        this.canvas = document.getElementById("gameCanvas")
        this.ctx = this.canvas.getContext("2d")
        this.gameState = "start"
        this.soundEnabled = true

        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.bird = {
            x: 100,
            y: this.canvas.height / 2,
            width: 40,
            height: 30,
            velocity: 0,
            gravity: 0.25,
            jumpPower: -7,
            rotation: 0,
            wingPhase: 0,
        }

        this.pipes = []
        this.particles = []
        this.clouds = []
        this.score = 0
        this.highScore = parseInt(localStorage.getItem("flappyHighScore") || "0", 10)

        this.backgroundOffset = 0
        this.pipeGap = 180
        this.pipeWidth = 45
        this.pipeSpeed = 1.5

        this.mainMenuBtn = document.getElementById("mainMenuBtn")
        if (this.mainMenuBtn) {
            this.mainMenuBtn.onclick = () => {
                this.gameOverScreen.classList.add("hidden")
                document.getElementById("spriteSelectOverlay").style.display = "flex"
            }
        }

        this.initializeElements()
        this.createSounds()
        this.generateClouds()
        this.boundKeydown = this.handleKeydown.bind(this)
        this.boundCanvasClick = this.handleCanvasClick.bind(this)
        this.boundCanvasTouch = this.handleCanvasTouch.bind(this)
        this.bindEvents()
        this.updateUI()
        this.gameLoop()

        window.onresize = () => this.resizeCanvas()
        this._destroyed = false

        this.redFlash = 0 // 0: no flash, 1: full flash
        this._justFlapped = false
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
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
                y: Math.random() * (this.canvas.height / 3) + 50,
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
        document.addEventListener("keydown", this.boundKeydown)
        this.canvas.addEventListener("click", this.boundCanvasClick)
        this.canvas.addEventListener("touchstart", this.boundCanvasTouch)
    }

    unbindEvents() {
        document.removeEventListener("keydown", this.boundKeydown)
        this.canvas.removeEventListener("click", this.boundCanvasClick)
        this.canvas.removeEventListener("touchstart", this.boundCanvasTouch)
    }

    handleKeydown(e) {
        if (e.code === "ArrowUp" || e.key === "ArrowUp" || e.keyCode === 38) {
            e.preventDefault()
            // Prevent accidental game over if space is pressed immediately after mouse/touch
            if (this._justFlapped) {
                this._justFlapped = false
                return
            }
            if (this.gameState === "playing") {
                this.handleInput()
            } else if (this.gameState === "gameOver") {
                this.restartGame()
            } else if (this.gameState === "start") {
                this.handleCountdownStart()
            }
        }
    }

    handleCanvasClick() {
        if (this.gameState === "playing") {
            this.handleInput()
            this._justFlapped = true
            setTimeout(() => { this._justFlapped = false }, 120)
        }
    }

    handleCanvasTouch(e) {
        e.preventDefault()
        if (this.gameState === "playing") {
            this.handleInput()
            this._justFlapped = true
            setTimeout(() => { this._justFlapped = false }, 120)
        }
    }

    handleCountdownStart() {
        this.startScreen.classList.add("hidden")
        this.gameOverScreen.classList.add("hidden")
        this.gameState = "countdown"
        this.resetGame()
        setTimeout(() => {
            const countdownOverlay = document.getElementById("countdownOverlay")
            const countdownContent = document.getElementById("countdownContent")
            countdownOverlay.style.display = "flex"
            let count = 5
            countdownContent.textContent = count
            countdownContent.style.animation = "none"
            void countdownContent.offsetWidth
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
        }, 250)
    }

    startGame() {
        this.gameState = "playing"
        this.startScreen.classList.add("hidden")
        this.gameOverScreen.classList.add("hidden")
        this.canvas.focus && this.canvas.focus()
    }

    restartGame() {
        this.gameOverScreen.classList.add("hidden")
        this.startScreen.classList.add("hidden")
        this.gameState = "countdown"
        this.resetGame()
        setTimeout(() => {
            const countdownOverlay = document.getElementById("countdownOverlay")
            const countdownContent = document.getElementById("countdownContent")
            countdownOverlay.style.display = "flex"
            let count = 5
            countdownContent.textContent = count
            countdownContent.style.animation = "none"
            void countdownContent.offsetWidth
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
        }, 250)
    }

    resetGame() {
        this.bird.y = this.canvas.height / 2
        this.bird.velocity = 0
        this.bird.rotation = 0
        this.pipes = []
        this.particles = []
        this.score = 0
        this.updateUI()
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled
        this.muteBtn.textContent = this.soundEnabled ? "" : ""
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

    handleInput() {
        if (this.gameState === "playing") {
            this.bird.velocity = this.bird.jumpPower
            if (this.spriteType === "bird") {
                this.sounds.jump()
                this.createParticles(this.bird.x, this.bird.y, "#FFD700", 5)
            } else if (this.spriteType === "octo") {
                this.sounds.jump()
                this.createParticles(this.bird.x, this.bird.y, "#00eaff", 7)
            } else if (this.spriteType === "shinycoto") {
                this.sounds.jump()
                this.createParticles(this.bird.x, this.bird.y, "#a18fff", 10)
            }
        }
    }

    updateBird() {
        if (this.gameState !== "playing") return

        this.bird.velocity += this.bird.gravity
        this.bird.y += this.bird.velocity

        this.bird.rotation = Math.min(Math.max(this.bird.velocity * 0.03, -0.5), 0.5)

        this.bird.wingPhase += 0.3

        if (this.bird.y < 0 || this.bird.y + this.bird.height > this.canvas.height) {
            this.gameOver()
        }
    }

    updatePipes() {
        if (this.gameState !== "playing") return

        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 250) {
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

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i]
            pipe.x -= this.pipeSpeed

            if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.scored = true
                this.score++
                if (this.spriteType === "bird") {
                    this.sounds.score()
                    this.createParticles(this.bird.x, this.bird.y, "#00FF00", 8)
                } else if (this.spriteType === "octo") {
                    this.sounds.score()
                    this.createParticles(this.bird.x, this.bird.y, "#a18fff", 10)
                } else if (this.spriteType === "shinycoto") {
                    this.sounds.score()
                    this.createParticles(this.bird.x, this.bird.y, "#a18fff", 12)
                }
                this.updateUI()

                if (this.score > this.highScore) {
                    this.highScore = this.score
                    localStorage.setItem("flappyHighScore", this.highScore)
                }
            }

            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1)
            }

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
            particle.vy += 0.1

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
                cloud.y = Math.random() * (this.canvas.height / 3) + 50
            }
        })
    }

    gameOver() {
        if (this.gameState === "gameOver") return
        this.gameState = "gameOver"
        this.finalScoreElement.textContent = this.score
        this.finalHighScoreElement.textContent = this.highScore
        if (this.spriteType === "bird") {
            this.redFlash = 1
            setTimeout(() => {
                this.redFlash = 0
                this.gameOverScreen.classList.remove("hidden")
            }, 250)
        } else if (this.spriteType === "octo") {
            this.redFlash = 1
            setTimeout(() => {
                this.redFlash = 0
                this.gameOverScreen.classList.remove("hidden")
            }, 250)
            this.createParticles(this.bird.x, this.bird.y + this.bird.height / 2, "#a18fff", 25)
        } else if (this.spriteType === "shinycoto") {
            this.redFlash = 1
            setTimeout(() => {
                this.redFlash = 0
                this.gameOverScreen.classList.remove("hidden")
            }, 250)
            this.createParticles(this.bird.x, this.bird.y + this.bird.height / 2, "#a18fff", 30)
        }
    }

    drawBackground() {
        if (this.spriteType === "bird") {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
            gradient.addColorStop(0, "#87CEEB") // light blue
            gradient.addColorStop(0.5, "#b9eaff") // pale blue
            gradient.addColorStop(0.8, "#ffeedd") // warm near ground
            gradient.addColorStop(1, "#a7d28d") // soft green for ground
            this.ctx.fillStyle = gradient
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

            this.ctx.save()
            this.ctx.globalAlpha = 0.55
            this.ctx.beginPath()
            this.ctx.arc(this.canvas.width - 120, 100, 60, 0, Math.PI * 2)
            this.ctx.fillStyle = "#fffad1"
            this.ctx.fill()
            this.ctx.restore()

            this.ctx.save()
            this.ctx.globalAlpha = 0.16
            this.ctx.fillStyle = "#7ac36a"
            this.ctx.beginPath()
            this.ctx.moveTo(0, this.canvas.height - 100)
            for (let x = 0; x <= this.canvas.width; x += 80) {
                this.ctx.lineTo(x, this.canvas.height - 110 - Math.sin(x / 180) * 30)
            }
            this.ctx.lineTo(this.canvas.width, this.canvas.height)
            this.ctx.lineTo(0, this.canvas.height)
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.restore()

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
        } else if (this.spriteType === "octo") {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
            gradient.addColorStop(0, "#0f224e") // deep blue top
            gradient.addColorStop(0.4, "#1976a5") // mid blue
            gradient.addColorStop(0.7, "#36c1e6") // turquoise
            gradient.addColorStop(1, "#e0b87b") // seabed sand
            this.ctx.fillStyle = gradient
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

            this.ctx.save()
            this.ctx.globalAlpha = 0.6
            this.ctx.fillStyle = "#e0b87b"
            this.ctx.beginPath()
            this.ctx.moveTo(0, this.canvas.height - 40)
            for (let x = 0; x <= this.canvas.width; x += 60) {
                this.ctx.lineTo(x, this.canvas.height - 30 - Math.sin(x / 90 + Date.now() / 1800) * 8)
            }
            this.ctx.lineTo(this.canvas.width, this.canvas.height)
            this.ctx.lineTo(0, this.canvas.height)
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.restore()

            for (let i = 0; i < 8; i++) {
                const x = (i + 1) * this.canvas.width / 10
                this.ctx.save()
                this.ctx.strokeStyle = i % 2 === 0 ? "#47b36a" : "#388e3c"
                this.ctx.lineWidth = 6
                this.ctx.globalAlpha = 0.45
                this.ctx.beginPath()
                this.ctx.moveTo(x, this.canvas.height - 38)
                for (let y = 0; y < 28; y += 7) {
                    this.ctx.lineTo(x + Math.sin(Date.now() / 800 + i + y) * 6, this.canvas.height - 38 - y)
                }
                this.ctx.stroke()
                this.ctx.restore()
            }

            for (let i = 0; i < 12; i++) {
                const bx = (this.canvas.width / 12) * i + Math.sin(Date.now() / 900 + i) * 14
                const by = (Date.now() / 1.9 + i * 110) % (this.canvas.height - 60)
                this.ctx.save()
                this.ctx.globalAlpha = 0.13 + 0.08 * Math.sin(Date.now() / 700 + i)
                this.ctx.fillStyle = "#fff"
                this.ctx.beginPath()
                this.ctx.arc(bx, this.canvas.height - by - 50, 10 + Math.sin(i) * 2, 0, Math.PI * 2)
                this.ctx.fill()
                this.ctx.restore()
            }

            for (let i = 0; i < 4; i++) {
                const fx = (Date.now() / (i % 2 === 0 ? 2.5 : 3.2) + i * 400) % (this.canvas.width + 60) - 30
                const fy = this.canvas.height - 120 - i * 32 + Math.sin(Date.now() / 900 + i) * 6
                this.ctx.save()
                this.ctx.globalAlpha = 0.7
                this.ctx.translate(fx, fy)
                this.ctx.scale(1.1 - i * 0.13, 1.1 - i * 0.11)
                this.ctx.beginPath()
                this.ctx.ellipse(0, 0, 20, 9, 0, 0, Math.PI * 2)
                this.ctx.fillStyle = i % 2 === 0 ? "#ffb347" : "#4ecdc4"
                this.ctx.fill()
                this.ctx.beginPath()
                this.ctx.moveTo(-20, 0)
                this.ctx.lineTo(-28, -7)
                this.ctx.lineTo(-28, 7)
                this.ctx.closePath()
                this.ctx.fillStyle = i % 2 === 0 ? "#e17009" : "#167e8c"
                this.ctx.fill()
                this.ctx.beginPath()
                this.ctx.arc(10, -2, 2, 0, Math.PI * 2)
                this.ctx.fillStyle = "#333"
                this.ctx.fill()
                this.ctx.restore()
            }
        } else if (this.spriteType === "shinycoto") {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
            gradient.addColorStop(0, "#0f224e") // deep blue top
            gradient.addColorStop(0.4, "#1976a5") // mid blue
            gradient.addColorStop(0.7, "#36c1e6") // turquoise
            gradient.addColorStop(1, "#e0b87b") // seabed sand
            this.ctx.fillStyle = gradient
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

            this.ctx.save()
            this.ctx.globalAlpha = 0.6
            this.ctx.fillStyle = "#e0b87b"
            this.ctx.beginPath()
            this.ctx.moveTo(0, this.canvas.height - 40)
            for (let x = 0; x <= this.canvas.width; x += 60) {
                this.ctx.lineTo(x, this.canvas.height - 30 - Math.sin(x / 90 + Date.now() / 1800) * 8)
            }
            this.ctx.lineTo(this.canvas.width, this.canvas.height)
            this.ctx.lineTo(0, this.canvas.height)
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.restore()

            for (let i = 0; i < 8; i++) {
                const x = (i + 1) * this.canvas.width / 10
                this.ctx.save()
                this.ctx.strokeStyle = i % 2 === 0 ? "#47b36a" : "#388e3c"
                this.ctx.lineWidth = 6
                this.ctx.globalAlpha = 0.45
                this.ctx.beginPath()
                this.ctx.moveTo(x, this.canvas.height - 38)
                for (let y = 0; y < 28; y += 7) {
                    this.ctx.lineTo(x + Math.sin(Date.now() / 800 + i + y) * 6, this.canvas.height - 38 - y)
                }
                this.ctx.stroke()
                this.ctx.restore()
            }

            for (let i = 0; i < 12; i++) {
                const bx = (this.canvas.width / 12) * i + Math.sin(Date.now() / 900 + i) * 14
                const by = (Date.now() / 1.9 + i * 110) % (this.canvas.height - 60)
                this.ctx.save()
                this.ctx.globalAlpha = 0.13 + 0.08 * Math.sin(Date.now() / 700 + i)
                this.ctx.fillStyle = "#fff"
                this.ctx.beginPath()
                this.ctx.arc(bx, this.canvas.height - by - 50, 10 + Math.sin(i) * 2, 0, Math.PI * 2)
                this.ctx.fill()
                this.ctx.restore()
            }

            for (let i = 0; i < 4; i++) {
                const fx = (Date.now() / (i % 2 === 0 ? 2.5 : 3.2) + i * 400) % (this.canvas.width + 60) - 30
                const fy = this.canvas.height - 120 - i * 32 + Math.sin(Date.now() / 900 + i) * 6
                this.ctx.save()
                this.ctx.globalAlpha = 0.7
                this.ctx.translate(fx, fy)
                this.ctx.scale(1.1 - i * 0.13, 1.1 - i * 0.11)
                this.ctx.beginPath()
                this.ctx.ellipse(0, 0, 20, 9, 0, 0, Math.PI * 2)
                this.ctx.fillStyle = i % 2 === 0 ? "#ffb347" : "#4ecdc4"
                this.ctx.fill()
                this.ctx.beginPath()
                this.ctx.moveTo(-20, 0)
                this.ctx.lineTo(-28, -7)
                this.ctx.lineTo(-28, 7)
                this.ctx.closePath()
                this.ctx.fillStyle = i % 2 === 0 ? "#e17009" : "#167e8c"
                this.ctx.fill()
                this.ctx.beginPath()
                this.ctx.arc(10, -2, 2, 0, Math.PI * 2)
                this.ctx.fillStyle = "#333"
                this.ctx.fill()
                this.ctx.restore()
            }
        }
    }

    drawBird() {
        if (this.spriteType === "bird") {
            this.ctx.save()
            this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2)
            this.ctx.rotate(this.bird.rotation)
            const bodyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 25)
            bodyGradient.addColorStop(0, "#FF8C00")
            bodyGradient.addColorStop(0.7, "#FFA500")
            bodyGradient.addColorStop(1, "#FFD700")
            this.ctx.fillStyle = bodyGradient
            this.ctx.beginPath()
            this.ctx.ellipse(0, 0, this.bird.width / 2 + 5, this.bird.height / 2 + 2, 0, 0, Math.PI * 2)
            this.ctx.fill()
            const flap = Math.sin(this.bird.wingPhase * 1.6) * 10
            this.ctx.save()
            this.ctx.rotate(-0.3 + flap * 0.02)
            this.ctx.fillStyle = "#FF4500"
            this.ctx.beginPath()
            this.ctx.ellipse(-10, 8 + flap, 10, 15, 0, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.restore()
            const blink = Math.abs(Math.sin(Date.now() / 500 + this.bird.x)) < 0.12 ? 0.1 : 1
            this.ctx.fillStyle = "white"
            this.ctx.beginPath()
            this.ctx.arc(10, -5, 5, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.fillStyle = "black"
            this.ctx.beginPath()
            this.ctx.ellipse(12, -5, 2.5, 2.5 * blink, 0, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.fillStyle = "#FFD700"
            this.ctx.beginPath()
            this.ctx.moveTo(15, 0)
            this.ctx.lineTo(25, -3)
            this.ctx.lineTo(25, 3)
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.restore()
        } else if (this.spriteType === "octo") {
            this.ctx.save()
            this.ctx.globalAlpha = 1
            this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2)
            this.ctx.rotate(this.bird.rotation)
            const bodyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 25)
            bodyGradient.addColorStop(0, "#a18fff")
            bodyGradient.addColorStop(0.6, "#5b4fff")
            bodyGradient.addColorStop(0.85, "#00eaff")
            bodyGradient.addColorStop(1, "#3d2e85")
            this.ctx.fillStyle = bodyGradient
            this.ctx.beginPath()
            this.ctx.ellipse(0, 0, this.bird.width / 2 + 7, this.bird.height / 2 + 7, 0, 0, Math.PI * 2)
            this.ctx.fill()
            for (let i = 0; i < 5; i++) {
                const angle = (-0.6 + i * 0.3)
                const tentacleLength = 18 + Math.sin(this.bird.wingPhase * 1.5 + i + Date.now() / 400) * 6
                this.ctx.save()
                this.ctx.rotate(angle)
                this.ctx.beginPath()
                this.ctx.moveTo(0, 10)
                this.ctx.quadraticCurveTo(5, 20, 0, tentacleLength + 15)
                this.ctx.strokeStyle = `rgba(0,234,255,${0.5 + 0.2 * Math.sin(this.bird.wingPhase + i)})`
                this.ctx.lineWidth = 4
                this.ctx.shadowColor = "#00eaff"
                this.ctx.shadowBlur = 6
                this.ctx.stroke()
                this.ctx.restore()
            }
            this.ctx.shadowBlur = 0
            const blink = Math.abs(Math.sin(Date.now() / 500 + this.bird.x)) < 0.14 ? 0.1 : 1
            this.ctx.fillStyle = "white"
            this.ctx.beginPath()
            this.ctx.arc(10, -5, 6, 0, Math.PI * 2)
            this.ctx.arc(-10, -5, 6, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.fillStyle = "#222"
            this.ctx.beginPath()
            this.ctx.arc(12, -5, 2.5, 2.5 * blink, 0, 0, Math.PI * 2)
            this.ctx.arc(-8, -5, 2.5, 2.5 * blink, 0, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.save()
            this.ctx.globalAlpha = 0.7
            this.ctx.strokeStyle = "#fff"
            this.ctx.lineWidth = 2
            this.ctx.beginPath()
            this.ctx.arc(0, 6, 7, 0.2 * Math.PI, 0.8 * Math.PI)
            this.ctx.stroke()
            this.ctx.restore()
            for (let i = 0; i < 2; i++) {
                const bubbleX = 18 + Math.sin(this.bird.wingPhase + i) * 8
                const bubbleY = -18 - Math.cos(this.bird.wingPhase + i) * 6 - (i * 12)
                this.ctx.save()
                this.ctx.globalAlpha = 0.18 + 0.07 * Math.sin(Date.now() / 600 + i)
                this.ctx.fillStyle = "#fff"
                this.ctx.beginPath()
                this.ctx.arc(bubbleX, bubbleY, 4 + i * 2, 0, Math.PI * 2)
                this.ctx.fill()
                this.ctx.restore()
            }
            this.ctx.restore()
        } else if (this.spriteType === "shinycoto") {
            this.ctx.save()
            this.ctx.globalAlpha = 1
            this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2)
            this.ctx.rotate(this.bird.rotation)
            const shinyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 28)
            shinyGradient.addColorStop(0, "#f7eaff")
            shinyGradient.addColorStop(0.5, "#b6a0ff")
            shinyGradient.addColorStop(0.8, "#7ee3ff")
            shinyGradient.addColorStop(1, "#5e17eb")
            this.ctx.fillStyle = shinyGradient
            this.ctx.beginPath()
            this.ctx.ellipse(0, 0, this.bird.width / 2 + 8, this.bird.height / 2 + 8, 0, 0, Math.PI * 2)
            this.ctx.fill()
            for (let i = 0; i < 6; i++) {
                const angle = (-0.8 + i * 0.32)
                const tentacleLength = 19 + Math.sin(this.bird.wingPhase * 1.7 + i + Date.now() / 410) * 7
                this.ctx.save()
                this.ctx.rotate(angle)
                this.ctx.beginPath()
                this.ctx.moveTo(0, 12)
                this.ctx.quadraticCurveTo(8, 22, 0, tentacleLength + 18)
                this.ctx.strokeStyle = `rgba(126,227,255,${0.7 + 0.2 * Math.sin(this.bird.wingPhase + i)})`
                this.ctx.lineWidth = 4
                this.ctx.shadowColor = "#fff"
                this.ctx.shadowBlur = 10
                this.ctx.stroke()
                this.ctx.restore()
            }
            this.ctx.shadowBlur = 0
            const blink = Math.abs(Math.sin(Date.now() / 500 + this.bird.x)) < 0.13 ? 0.1 : 1
            this.ctx.fillStyle = "white"
            this.ctx.beginPath()
            this.ctx.arc(9, -6, 2.5, 0, Math.PI * 2)
            this.ctx.arc(-9, -6, 2.5, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.fillStyle = "#3d2e85"
            this.ctx.beginPath()
            this.ctx.ellipse(11, -6, 1, 1 * blink, 0, 0, Math.PI * 2)
            this.ctx.ellipse(-7, -6, 1, 1 * blink, 0, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.save()
            this.ctx.globalAlpha = 0.7
            this.ctx.strokeStyle = "#fff"
            this.ctx.lineWidth = 2
            this.ctx.beginPath()
            this.ctx.arc(0, 7, 8, 0.2 * Math.PI, 0.8 * Math.PI)
            this.ctx.stroke()
            this.ctx.restore()
            for (let i = 0; i < 8; i++) {
                const sparkleAngle = (Math.PI * 2) * (i / 8) + Date.now() / 800
                const sx = Math.cos(sparkleAngle) * 18
                const sy = Math.sin(sparkleAngle) * 13
                this.ctx.save()
                this.ctx.globalAlpha = 0.25 + 0.25 * Math.sin(Date.now() / 300 + i)
                this.ctx.fillStyle = "#fff"
                this.ctx.beginPath()
                this.ctx.arc(sx, sy, 2 + Math.sin(Date.now() / (200 + i * 30)) * 0.7, 0, Math.PI * 2)
                this.ctx.fill()
                this.ctx.restore()
            }
            this.ctx.restore()
        }
    }

    drawPipes() {
        this.pipes.forEach((pipe) => {
            const gradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + this.pipeWidth, 0)
            gradient.addColorStop(0, `hsl(${pipe.hue}, 70%, 50%)`)
            gradient.addColorStop(0.5, `hsl(${pipe.hue}, 70%, 60%)`)
            gradient.addColorStop(1, `hsl(${pipe.hue}, 70%, 40%)`)

            this.ctx.fillStyle = gradient

            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight)

            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 25, this.pipeWidth + 10, 25)

            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY)

            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 25)

            this.ctx.fillStyle = `hsl(${pipe.hue}, 70%, 75%)`
            this.ctx.fillRect(pipe.x + 3, 0, 3, pipe.topHeight)
            this.ctx.fillRect(pipe.x + 3, pipe.bottomY, 3, this.canvas.height - pipe.bottomY)
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
        if (this.redFlash > 0) {
            this.ctx.save()
            this.ctx.globalAlpha = 0.45 * this.redFlash
            this.ctx.fillStyle = "#ff2d2d"
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.restore()
        }
    }

    gameLoop() {
        if (this.gameState !== "gameOver") {
            this.updateBird()
            this.updatePipes()
            this.updateParticles()
            this.updateClouds()
        }
        this.render()
        requestAnimationFrame(() => this.gameLoop())
    }

    destroy() {
        this._destroyed = true
        this.unbindEvents()
    }
}