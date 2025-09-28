// Game State Management
class LoveQuestGame {
    constructor() {
      this.currentLevel = 0
      this.timelineProgress = 0
      this.quizProgress = 0
      this.collectionProgress = 0
      this.isPlaying = false
  
      // Quiz data
      this.quizData = [
        {
          question: "Where was our first date?",
          options: ["The crazy musty ass office", "The 'would-have-been' workspace", "The beginning of our beginning"],
          correct: 0,
          feedback:
            "Yes! That office where you kissed me for the first time and I couldn't stop staring at your smile. ☕💕",
          polaroid: {
            image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=150&fit=crop&crop=center",
            caption: "First Date"
          }
        },
        {
          question: "What's my favorite thing about you?",
          options: ["That pussayyyy", "You", "Your eyes"],
          correct: 1,
          feedback: "And that's right! It's one of the million reasons I fell for you. 💖",
          polaroid: {
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop&crop=center",
            caption: "You"
          }
        },
        {
          question: "Which song reminds you of us?",
          options: ["Perfect by Ed Sheeran", "Love Story by Indila", "To My Future Wife By Jon Bellion"],
          correct: 2,
          feedback: "Every time I hear it, I think of our slow dance in your living room. 🎵💃",
          polaroid: {
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop&crop=center",
            caption: "Our Song"
          }
        },
        {
          question: "What's our inside joke?",
          options: ["We don't have one yet", "We can tell jokes", "My dad jokes"],
          correct: 0,
          feedback: "Wrong!!! We don't have one yet",
          polaroid: {
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200&h=150&fit=crop&crop=center",
            caption: "Inside Jokes"
          }
        },
        {
          question: "What do we always look forward to?",
          options: ["Our late-night calls", "Bear hugs", "Adventures"],
          correct: 1,
          feedback: "We have had some but the best to come are still in the future.",
          polaroid: {
            image: "polaroid5.jpg",
            caption: "Missing You"
          }
        },
      ]
  
      // Collection messages
      this.loveMessages = [
        "You make me laugh every day",
        "Your smile lights up my world",
        "I love how you care about others",
        "You make me want to be better",
        "Your hugs feel like home",
        "You believe in me when I don't",
        "Your laugh is my favorite sound",
        "You see beauty in everything",
        "You make ordinary moments magical",
        "Your heart is pure gold",
        "You inspire me to dream bigger",
        "With you, I'm completely myself",
      ]
  
      this.currentQuiz = 0
      this.collectedMessages = []
  
      this.sparkleInterval = null
      this.touchDevice = "ontouchstart" in window
  
      this.init()
    }
  
    init() {
      try {
        this.setupEventListeners()
        this.loadProgress()
        this.createSparkleEffect()
        
        // Try to initialize particles, but don't let it break the app
        try {
          this.initParticles()
        } catch (error) {
          console.log("Particles initialization failed:", error)
        }

        // Hide loading screen after a delay - this should always work
        setTimeout(() => {
          console.log("Hiding loading screen...")
          const loadingScreen = document.getElementById("loading-screen")
          if (loadingScreen) {
            loadingScreen.style.opacity = "0"
            setTimeout(() => {
              loadingScreen.style.display = "none"
              console.log("Loading screen hidden")
            }, 500)
          }
        }, 2000)
        
        // Force hide loading screen after 5 seconds as backup
        setTimeout(() => {
          console.log("Force hiding loading screen as backup...")
          const loadingScreen = document.getElementById("loading-screen")
          if (loadingScreen && loadingScreen.style.display !== "none") {
            loadingScreen.style.display = "none"
            const landing = document.getElementById("landing")
            if (landing) {
              landing.classList.add("active")
            }
          }
        }, 5000)
      } catch (error) {
        console.error("Initialization error:", error)
        // Force hide loading screen even if there's an error
        setTimeout(() => {
          const loadingScreen = document.getElementById("loading-screen")
          if (loadingScreen) {
            loadingScreen.style.display = "none"
          }
        }, 3000)
      }
    }
  
    createSparkleEffect() {
      const createSparkle = (x, y) => {
        const sparkle = document.createElement("div")
        sparkle.className = "sparkle"
        sparkle.style.left = x + "px"
        sparkle.style.top = y + "px"
        sparkle.style.animationDelay = Math.random() * 0.5 + "s"
  
        document.body.appendChild(sparkle)
  
        setTimeout(() => {
          sparkle.remove()
        }, 1500)
      }
  
      // Add sparkles on click/touch
      document.addEventListener(this.touchDevice ? "touchstart" : "click", (e) => {
        const x = this.touchDevice ? e.touches[0].clientX : e.clientX
        const y = this.touchDevice ? e.touches[0].clientY : e.clientY
  
        // Create multiple sparkles
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            createSparkle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20)
          }, i * 100)
        }
      })
    }
  
    setupEventListeners() {
      // Start button
      const startBtn = document.getElementById("start-btn")
      if (startBtn) {
        startBtn.addEventListener("click", () => {
          this.startGame()
        })
      }

      // Music toggle
      const musicToggle = document.getElementById("music-toggle")
      if (musicToggle) {
        musicToggle.addEventListener("click", () => {
          this.toggleMusic()
        })
      }

      // Level navigation buttons
      const level1Next = document.getElementById("level1-next")
      if (level1Next) {
        level1Next.addEventListener("click", () => {
          this.goToLevel(2)
        })
      }

      const level2Next = document.getElementById("level2-next")
      if (level2Next) {
        level2Next.addEventListener("click", () => {
          this.goToLevel(3)
        })
      }

      const level3Next = document.getElementById("level3-next")
      if (level3Next) {
        level3Next.addEventListener("click", () => {
          this.goToLevel(4)
        })
      }

      // Final buttons
      const yesBtn = document.getElementById("yes-btn")
      if (yesBtn) {
        yesBtn.addEventListener("click", () => {
          this.handleYesResponse()
        })
      }

      const noBtn = document.getElementById("no-btn")
      if (noBtn) {
        noBtn.addEventListener("click", () => {
          this.handleNoResponse()
        })
      }

      // Share button
      const shareBtn = document.getElementById("share-btn")
      if (shareBtn) {
        shareBtn.addEventListener("click", () => {
          this.shareStory()
        })
      }

      // Timeline interaction - disabled for static display
      // this.setupTimelineInteraction()

      // Quiz interaction
      this.setupQuizInteraction()

      // Collection game
      this.setupCollectionGame()
    }
  
    initParticles() {
      try {
        const particlesJS = window.particlesJS
        if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
          particlesJS("particles-js", {
            particles: {
              number: { value: 50 },
              color: { value: "#f8b5c1" },
              shape: { type: "circle" },
              opacity: { value: 0.6 },
              size: { value: 3 },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
              },
            },
            retina_detect: true,
          })
        }
      } catch (error) {
        console.log("Particles.js failed to initialize:", error)
      }
    }
  
    startGame() {
      const gsap = window.gsap
      if (gsap) {
        gsap.to("#landing", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            this.goToLevel(1)
          },
        })
      } else {
        // Fallback without GSAP
        const landing = document.getElementById("landing")
        if (landing) {
          landing.style.opacity = "0"
          setTimeout(() => {
            this.goToLevel(1)
          }, 500)
        }
      }
    }
  
    goToLevel(level) {
      // Hide all screens
      document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.remove("active")
      })
  
      // Show target screen
      const targetScreen = document.getElementById(
        level === 1 ? "level1" : level === 2 ? "level2" : level === 3 ? "level3" : "final",
      )
  
      targetScreen.classList.add("active")
  
      // Initialize level-specific content
      switch (level) {
        case 1:
          this.initTimeline()
          break
        case 2:
          this.initQuiz()
          break
        case 3:
          this.initCollection()
          break
        case 4:
          this.initFinal()
          break
      }
  
      this.currentLevel = level
      this.saveProgress()
    }
  
    setupTimelineInteraction() {
      try {
        const timelineItems = document.querySelectorAll(".timeline-item")
        let revealedCount = 0
  
      const revealNext = () => {
        if (revealedCount < timelineItems.length) {
          const item = timelineItems[revealedCount]
          const gsap = window.gsap
          
          if (gsap) {
            gsap.to(item, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "back.out(1.7)",
              delay: 0.3,
            })
          } else {
            // Fallback without GSAP
            setTimeout(() => {
              item.style.opacity = "1"
              item.style.transform = "translateY(0px)"
            }, 300)
          }
          
          item.classList.add("revealed")
          revealedCount++

          // Update progress
          const progress = (revealedCount / timelineItems.length) * 100
          document.getElementById("timeline-progress").style.width = progress + "%"

          if (revealedCount === timelineItems.length) {
            document.getElementById("level1-next").disabled = false
            if (gsap) {
              gsap.to("#level1-next", {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                delay: 0.5,
              })
            } else {
              // Fallback without GSAP
              setTimeout(() => {
                const nextBtn = document.getElementById("level1-next")
                if (nextBtn) {
                  nextBtn.style.opacity = "1"
                  nextBtn.style.transform = "scale(1)"
                }
              }, 500)
            }
          }
        }
      }
  
      // Auto-reveal timeline items with delay
      setTimeout(() => {
        const interval = setInterval(() => {
          revealNext()
          if (revealedCount >= timelineItems.length) {
            clearInterval(interval)
          }
        }, 2000)
      }, 500)
      
      // Backup: ensure all timeline items are visible after 10 seconds
      setTimeout(() => {
        timelineItems.forEach((item, index) => {
          if (!item.classList.contains("revealed")) {
            item.style.opacity = "1"
            item.style.transform = "translateY(0px)"
            item.classList.add("revealed")
          }
        })
        // Enable next button
        const nextBtn = document.getElementById("level1-next")
        if (nextBtn) {
          nextBtn.disabled = false
          nextBtn.style.opacity = "1"
          nextBtn.style.transform = "scale(1)"
        }
        // Update progress
        document.getElementById("timeline-progress").style.width = "100%"
      }, 10000)
      } catch (error) {
        console.log("Timeline interaction setup failed:", error)
      }
    }
  
    initTimeline() {
      console.log("Initializing timeline...")
      // Show all timeline items immediately as static content
      const timelineItems = document.querySelectorAll(".timeline-item")
      
      console.log("Found timeline items:", timelineItems.length)
      
      timelineItems.forEach((item, index) => {
        item.classList.add("revealed")
        // Make sure items are visible
        item.style.opacity = "1"
        item.style.transform = "translateY(0px)"
        console.log(`Timeline item ${index} made visible`)
      })

      // Set progress to 100% and enable next button immediately
      document.getElementById("timeline-progress").style.width = "100%"
      const nextBtn = document.getElementById("level1-next")
      if (nextBtn) {
        nextBtn.disabled = false
        nextBtn.style.opacity = "1"
        nextBtn.style.transform = "scale(1)"
      }
      
      console.log("Timeline initialization complete - all items visible")
    }
  
    setupQuizInteraction() {
      try {
        const options = document.querySelectorAll(".quiz-option")
        options.forEach((option) => {
          option.addEventListener("click", (e) => {
            this.handleQuizAnswer(Number.parseInt(e.target.dataset.answer))
          })
        })
      } catch (error) {
        console.log("Quiz interaction setup failed:", error)
      }
    }
  
    initQuiz() {
      this.currentQuiz = 0
      this.loadQuizQuestion()
      document.getElementById("level2-next").disabled = true
    }
  
    loadQuizQuestion() {
      const quiz = this.quizData[this.currentQuiz]
      document.getElementById("question-text").textContent = quiz.question
      document.getElementById("quiz-current").textContent = this.currentQuiz + 1
      document.getElementById("quiz-total").textContent = this.quizData.length

      // Update polaroid with error handling
      try {
        const polaroidIcon = document.getElementById("polaroid-icon")
        const polaroidCaption = document.getElementById("polaroid-caption")
        const polaroidImage = document.getElementById("polaroid-image")
        const polaroidContainer = document.getElementById("quiz-polaroid")
        
        if (polaroidIcon && polaroidCaption && polaroidImage && polaroidContainer && quiz.polaroid) {
          // Hide the icon and show the image
          polaroidIcon.style.display = "none"
          polaroidCaption.textContent = quiz.polaroid.caption
          
          // Create or update the image element
          let imgElement = polaroidImage.querySelector("img")
          if (!imgElement) {
            imgElement = document.createElement("img")
            polaroidImage.appendChild(imgElement)
          }
          imgElement.src = quiz.polaroid.image
          imgElement.alt = quiz.polaroid.caption
          imgElement.style.width = "100%"
          imgElement.style.height = "100%"
          imgElement.style.objectFit = "cover"
          imgElement.style.borderRadius = "2px"

          // Add random rotation to polaroid for authentic yearbook feel
          const randomRotation = (Math.random() - 0.5) * 8 // Random rotation between -4 and 4 degrees
          polaroidContainer.style.transform = `rotate(${randomRotation}deg)`

          // Add entrance animation for polaroid
          const gsap = window.gsap
          if (gsap) {
            gsap.fromTo(polaroidContainer, 
              { 
                opacity: 0, 
                scale: 0.8, 
                rotation: randomRotation + 10 
              },
              { 
                opacity: 1, 
                scale: 1, 
                rotation: randomRotation,
                duration: 0.6, 
                ease: "back.out(1.7)",
                delay: 0.2
              }
            )
          }

          // Add sparkle effect around polaroid
          this.createPolaroidSparkles(polaroidContainer)
        }
      } catch (error) {
        console.log("Polaroid update failed:", error)
      }

      const options = document.querySelectorAll(".quiz-option")
      options.forEach((option, index) => {
        option.textContent = quiz.options[index]
        option.classList.remove("selected")
        option.disabled = false
      })

      document.getElementById("quiz-feedback").classList.remove("show")
    }
  
    handleQuizAnswer(answerIndex) {
      const quiz = this.quizData[this.currentQuiz]
      const options = document.querySelectorAll(".quiz-option")
  
      // Disable all options
      options.forEach((option) => (option.disabled = true))
  
      // Highlight selected answer
      options[answerIndex].classList.add("selected")
  
      // Show feedback
      const feedback = document.getElementById("quiz-feedback")
      feedback.innerHTML = `<p>${quiz.feedback}</p>`
      feedback.classList.add("show")
  
      // Move to next question or complete quiz
      setTimeout(() => {
        this.currentQuiz++
        if (this.currentQuiz < this.quizData.length) {
          this.loadQuizQuestion()
        } else {
          // Quiz completed
          feedback.innerHTML = "<h3>Perfect! You know us so well! 💕</h3><p>Ready for the next challenge?</p>"
          document.getElementById("level2-next").disabled = false
        }
      }, 3000)
    }
  
    setupCollectionGame() {
      try {
        // Will be initialized when level 3 starts
        console.log("Collection game setup complete")
      } catch (error) {
        console.log("Collection game setup failed:", error)
      }
    }
  
    initCollection() {
      this.collectedMessages = []
      document.getElementById("collected-count").textContent = "0"
      document.getElementById("total-count").textContent = this.loveMessages.length
      document.getElementById("collected-messages").innerHTML = ""
      document.getElementById("level3-next").disabled = true
  
      this.spawnHearts()
    }
  
    spawnHearts() {
      const container = document.getElementById("collection-area")
      const messages = [...this.loveMessages]
  
      const spawnHeart = () => {
        if (messages.length === 0) return
  
        const heart = document.createElement("div")
        heart.className = "floating-heart"
        heart.innerHTML = '<i class="fas fa-heart"></i>'
  
        // Random position
        const x = Math.random() * (container.offsetWidth - 40)
        const y = Math.random() * (container.offsetHeight - 40)
  
        heart.style.left = x + "px"
        heart.style.top = y + "px"
  
        const messageIndex = Math.floor(Math.random() * messages.length)
        const message = messages.splice(messageIndex, 1)[0]
  
        heart.addEventListener("click", () => {
          this.collectMessage(message, heart)
        })
  
        container.appendChild(heart)
  
        // Remove heart after 5 seconds if not clicked
        setTimeout(() => {
          if (heart.parentNode) {
            heart.remove()
            // Respawn if messages remaining
            if (messages.length > 0) {
              setTimeout(spawnHeart, 1000)
            }
          }
        }, 5000)
      }
  
      // Spawn hearts at intervals
      const spawnInterval = setInterval(() => {
        if (messages.length > 0 && this.collectedMessages.length < this.loveMessages.length) {
          spawnHeart()
        } else {
          clearInterval(spawnInterval)
        }
      }, 2000)
  
      // Initial spawn
      spawnHeart()
    }
  
    collectMessage(message, heartElement) {
      const gsap = window.gsap
  
      // Create celebration particles
      this.createCelebrationParticles(heartElement.getBoundingClientRect())
  
      gsap.to(heartElement, {
        scale: 2,
        opacity: 0,
        rotation: 360,
        duration: 0.5,
        ease: "back.in(1.7)",
        onComplete: () => {
          heartElement.remove()
        },
      })
  
      // Add to collected messages
      this.collectedMessages.push(message)
      document.getElementById("collected-count").textContent = this.collectedMessages.length
  
      // Create message card
      const messageCard = document.createElement("div")
      messageCard.className = "message-card"
      messageCard.innerHTML = `<p>"${message}"</p>`
  
      document.getElementById("collected-messages").appendChild(messageCard)
  
      // Animate message card appearance
      setTimeout(() => {
        messageCard.classList.add("revealed")
      }, 100)
  
      // Check if collection is complete
      if (this.collectedMessages.length === this.loveMessages.length) {
        document.getElementById("level3-next").disabled = false
  
        // Celebration effect
        const confetti = window.confetti // Declare confetti variable
        if (typeof confetti !== "undefined") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      }
    }
  
    initFinal() {
      // Reset final screen
      document.querySelector(".final-content").style.display = "block"
      document.getElementById("celebration").classList.add("hidden")
    }
  
    handleYesResponse() {
      // Hide question content
      const gsap = window.gsap // Declare gsap variable
      gsap.to(".final-content", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => {
          document.querySelector(".final-content").style.display = "none"
          document.getElementById("celebration").classList.remove("hidden")
  
          // Multiple celebration effects
          this.triggerFireworks()
          this.createFloatingHearts()
  
          const confetti = window.confetti
          if (typeof confetti !== "undefined") {
            // Enhanced confetti sequence
            const duration = 5000
            const end = Date.now() + duration
            const colors = ["#f8b5c1", "#d63384", "#ffd700", "#ff69b4"]
            ;(function frame() {
              confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
              })
              confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
              })
  
              // Center burst
              if (Math.random() < 0.3) {
                confetti({
                  particleCount: 100,
                  spread: 180,
                  origin: { y: 0.6 },
                  colors: colors,
                })
              }
  
              if (Date.now() < end) {
                requestAnimationFrame(frame)
              }
            })()
          }
  
          gsap.fromTo(
            "#celebration",
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          )
        },
      })
    }
  
    handleNoResponse() {
      const noBtn = document.getElementById("no-btn")
  
      // Make button run away
      const moveAway = () => {
        const x = (Math.random() - 0.5) * 200
        const y = (Math.random() - 0.5) * 100
  
        const gsap = window.gsap // Declare gsap variable
        gsap.to(noBtn, {
          x: x,
          y: y,
          duration: 0.3,
          ease: "power2.out",
        })
      }
  
      // Move away multiple times, then disappear
      let moveCount = 0
      const maxMoves = 3
  
      const moveInterval = setInterval(() => {
        moveAway()
        moveCount++
  
        if (moveCount >= maxMoves) {
          clearInterval(moveInterval)
          setTimeout(() => {
            const gsap = window.gsap // Declare gsap variable
            gsap.to(noBtn, {
              opacity: 0,
              scale: 0,
              duration: 0.5,
              onComplete: () => {
                noBtn.style.display = "none"
              },
            })
          }, 500)
        }
      }, 800)
    }
  
    shareStory() {
      if (navigator.share) {
        navigator.share({
          title: "Our Love Quest",
          text: "I just completed the most romantic interactive story! 💕",
          url: window.location.href,
        })
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert("Link copied to clipboard! Share our love story! 💕")
        })
      }
    }
  
    toggleMusic() {
      // Placeholder for music functionality
      const musicBtn = document.getElementById("music-toggle")
      this.isPlaying = !this.isPlaying
  
      if (this.isPlaying) {
        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>'
        musicBtn.style.color = "#d63384"
      } else {
        musicBtn.innerHTML = '<i class="fas fa-music"></i>'
        musicBtn.style.color = "#6c757d"
      }
    }
  
    saveProgress() {
      const progress = {
        currentLevel: this.currentLevel,
        timelineProgress: this.timelineProgress,
        quizProgress: this.quizProgress,
        collectionProgress: this.collectionProgress,
        completedAt: this.currentLevel === 4 ? new Date().toISOString() : null,
        playCount: JSON.parse(localStorage.getItem("loveQuestProgress") || "{}").playCount + 1,
      }
  
      localStorage.setItem("loveQuestProgress", JSON.stringify(progress))
    }
  
    loadProgress() {
      const saved = localStorage.getItem("loveQuestProgress")
      if (saved) {
        const progress = JSON.parse(saved)
        this.currentLevel = progress.currentLevel || 0
        this.timelineProgress = progress.timelineProgress || 0
        this.quizProgress = progress.quizProgress || 0
        this.collectionProgress = progress.collectionProgress || 0
      }
    }
  
    createCelebrationParticles(rect) {
      const particles = ["💕", "✨", "💖", "🌟", "💫"]

      for (let i = 0; i < 5; i++) {
        const particle = document.createElement("div")
        particle.className = "celebration-particle"
        particle.textContent = particles[Math.floor(Math.random() * particles.length)]
        particle.style.left = rect.left + rect.width / 2 + "px"
        particle.style.top = rect.top + rect.height / 2 + "px"
        particle.style.animationDelay = i * 0.1 + "s"

        document.body.appendChild(particle)

        setTimeout(() => {
          particle.remove()
        }, 3000)
      }
    }

    createPolaroidSparkles(polaroidContainer) {
      try {
        if (!polaroidContainer) return
        
        const rect = polaroidContainer.getBoundingClientRect()
        const sparkles = ["✨", "💫", "⭐", "🌟"]

        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            const sparkle = document.createElement("div")
            sparkle.className = "polaroid-sparkle"
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)]
            sparkle.style.position = "fixed"
            sparkle.style.left = rect.left + Math.random() * rect.width + "px"
            sparkle.style.top = rect.top + Math.random() * rect.height + "px"
            sparkle.style.fontSize = "1.2rem"
            sparkle.style.pointerEvents = "none"
            sparkle.style.zIndex = "1000"
            sparkle.style.animation = "polaroidSparkle 2s ease-out forwards"

            document.body.appendChild(sparkle)

            setTimeout(() => {
              if (sparkle.parentNode) {
                sparkle.remove()
              }
            }, 2000)
          }, i * 200)
        }
      } catch (error) {
        console.log("Polaroid sparkles failed:", error)
      }
    }
  
    createFloatingHearts() {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const heart = document.createElement("div")
          heart.innerHTML = "💕"
          heart.style.position = "fixed"
          heart.style.left = Math.random() * window.innerWidth + "px"
          heart.style.top = window.innerHeight + "px"
          heart.style.fontSize = "2rem"
          heart.style.pointerEvents = "none"
          heart.style.zIndex = "9999"
  
          document.body.appendChild(heart)
  
          const gsap = window.gsap
          gsap.to(heart, {
            y: -window.innerHeight - 100,
            x: (Math.random() - 0.5) * 200,
            rotation: 360,
            opacity: 0,
            duration: 3,
            ease: "power2.out",
            onComplete: () => heart.remove(),
          })
        }, i * 200)
      }
    }
  
    triggerFireworks() {
      const confetti = window.confetti
      if (typeof confetti === "undefined") return
  
      const firework = (x, y) => {
        confetti({
          particleCount: 150,
          spread: 360,
          origin: { x, y },
          colors: ["#f8b5c1", "#d63384", "#ffd700", "#ff69b4"],
          gravity: 0.6,
          scalar: 1.2,
        })
      }
  
      // Multiple fireworks
      setTimeout(() => firework(0.2, 0.3), 0)
      setTimeout(() => firework(0.8, 0.3), 500)
      setTimeout(() => firework(0.5, 0.2), 1000)
      setTimeout(() => firework(0.3, 0.4), 1500)
      setTimeout(() => firework(0.7, 0.4), 2000)
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing game...")
    try {
      const game = new LoveQuestGame()
      console.log("Game initialized successfully:", game)
    } catch (error) {
      console.error("Game initialization failed:", error)
      // Fallback: just hide the loading screen
      setTimeout(() => {
        console.log("Using fallback initialization...")
        const loadingScreen = document.getElementById("loading-screen")
        if (loadingScreen) {
          loadingScreen.style.display = "none"
        }
        // Show a simple error message or the landing page
        const landing = document.getElementById("landing")
        if (landing) {
          landing.classList.add("active")
        }
      }, 1000)
    }
  
    // Add secret heart rain easter egg
    let heartSequence = []
    const secretSequence = ["h", "e", "a", "r", "t"]
  
    document.addEventListener("keydown", (e) => {
      heartSequence.push(e.key.toLowerCase())
      if (heartSequence.length > secretSequence.length) {
        heartSequence.shift()
      }
  
      if (heartSequence.join("") === secretSequence.join("")) {
        // Trigger heart rain
        for (let i = 0; i < 50; i++) {
          setTimeout(() => {
            const heart = document.createElement("div")
            heart.innerHTML = "💖"
            heart.style.position = "fixed"
            heart.style.left = Math.random() * window.innerWidth + "px"
            heart.style.top = "-50px"
            heart.style.fontSize = "1.5rem"
            heart.style.pointerEvents = "none"
            heart.style.zIndex = "9999"
  
            document.body.appendChild(heart)
  
            const gsap = window.gsap
            gsap.to(heart, {
              y: window.innerHeight + 50,
              rotation: 360,
              duration: 3 + Math.random() * 2,
              ease: "power2.in",
              onComplete: () => heart.remove(),
            })
          }, i * 100)
        }
  
        heartSequence = []
      }
    })
  })
  