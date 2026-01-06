# 🏓 Air Pong - Gesture-Controlled Pong Game

Air Pong is a modern reimagining of the classic Pong game, controlled entirely using AI-based hand tracking Instead of keyboards or controllers, players use their hands in front of a webcam to move paddles in real time, creating a fun, interactive, and futuristic gaming experience.

The game uses MediaPipe Hands with TensorFlow.js to detect and track hand movements accurately and smoothly.

## Features

### ✋ AI Hand Tracking

* Real-time hand detection using a webcam
* Smooth paddle control mapped directly to hand movement
* No physical controllers required

### 🎮 Game Modes

* **1 Player Mode**

  * Player controls the left paddle using the left hand
  * AI controls the right paddle
* **2 Player Mode**

  * Player 1 uses left hand (left paddle)
  * Player 2 uses right hand (right paddle)
  * Both players can see their respective webcam feeds

### 🏆 Win Condition

* First player to reach 11 points wins the match
* A win/lose screen is displayed with a Play Again option

### 🎥 Visual Feedback

* Live webcam preview(s) on the side(s)
* On-canvas indicators showing where the hand is mapped to the paddle
* Clear on-screen instructions for each mode

### 🎨 UI & Design

* Bright, animated gradient background
* Arcade-style typography using *Fredoka One*
* Smooth animations and clean layout
* Dark mode supported for better accessibility

---

## 🛠 Technologies Used

* **HTML5 Canvas** – Game rendering
* **CSS3** – Styling, layout, animations, and dark mode
* **JavaScript (Vanilla)** – Game logic and interactions
* **TensorFlow.js** – Machine learning framework
* **MediaPipe Hands** – Hand tracking model


## ▶ How to Play

1. Open the game in a modern browser (Chrome recommended)
2. Allow webcam access when prompted
3. Choose 1 Player or 2 Player mode
4. Click Start Game
5. Move your hand(s) up and down to control the paddle(s)
6. First to 11 points wins 🎉



## 🔙 Back Button Note (Important)

The Back button included in the game interface is intended for future expansion such as navigating between multiple games in a larger project or game hub.

It is not required for the core Air Pong gameplay and does not affect how this game functions on its own.



## 📌 Future Improvements (Optional Ideas)

* Difficulty selection for AI
* Sound effects and background music
* Mobile/tablet optimization
* Power-ups or paddle effects
* Online multiplayer support



## 📷 Permissions

This game requires camera access to function properly.
No video data is stored or transmitted — all processing happens locally in the browser.

