# ASH TIC-TAC

![Vercel](https://img.shields.io/badge/Powered%20by-Vercel-black.svg?style=for-the-badge&logo=vercel)
![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-45ba4b.svg?style=for-the-badge&logo=playwright)

A futuristic black and white Tic Tac Toe game with progressive difficulty stages and advanced AI.

![Game Screenshot](/Output.jpeg?height=300&width=500)

## Features

- **Minimalist Futuristic Design**: Clean black and white interface with terminal-style typography
- **Progressive Difficulty**: 10 stages with increasing challenge levels
- **Adaptive Board Sizes**: Play on 3×3, 4×4, and 5×5 grids
- **Advanced AI**: Strategic computer opponent with multiple difficulty levels
- **Stage Progression System**: Complete stages to unlock new challenges
- **Victory Celebrations**: Special effects when completing stages
- **Auto-Reset**: Board automatically resets after each game

## Game Mechanics

### Stages

The game features 10 progressive stages:

| Stage | Name | Grid Size | Win Condition | AI Difficulty |
|-------|------|-----------|---------------|--------------|
| 1 | INIT | 3×3 | 3 in a row | Basic |
| 2 | LEVEL 1 | 3×3 | 3 in a row | Easy |
| 3 | LEVEL 2 | 3×3 | 3 in a row | Medium |
| 4 | LEVEL 3 | 3×3 | 3 in a row | Hard |
| 5 | ADVANCED | 4×4 | 3 in a row | Medium |
| 6 | EXPERT | 4×4 | 4 in a row | Hard |
| 7 | MASTER | 4×4 | 4 in a row | Expert |
| 8 | COMPLEX | 5×5 | 4 in a row | Hard |
| 9 | QUANTUM | 5×5 | 5 in a row | Expert |
| 10 | FINAL | 5×5 | 5 in a row | Maximum |

### Progression

- Early stages (1-3): Win 3 games to complete
- Middle stages (4-6): Win 4 games to complete
- Advanced stages (7-10): Win 5 games to complete

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Canvas Confetti

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ash-tic-tac.git
   cd ash-tic-tac
```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
