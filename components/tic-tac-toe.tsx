"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GameBoard } from "./game-board"
import { Celebration } from "./celebration"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, ChevronRight } from "lucide-react"

// Game stages with increasing difficulty
const stages = [
  { id: 1, name: "INIT", size: 3, winCondition: 3, aiDifficulty: 0.2 },
  { id: 2, name: "LEVEL 1", size: 3, winCondition: 3, aiDifficulty: 0.5 },
  { id: 3, name: "LEVEL 2", size: 3, winCondition: 3, aiDifficulty: 0.7 },
  { id: 4, name: "LEVEL 3", size: 3, winCondition: 3, aiDifficulty: 0.9 },
  { id: 5, name: "FINAL", size: 4, winCondition: 4, aiDifficulty: 0.9 },
]

export default function TicTacToe() {
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  const [showStageSelect, setShowStageSelect] = useState(false)

  const handleStageComplete = (stageId: number) => {
    if (!completedStages.includes(stageId)) {
      setCompletedStages([...completedStages, stageId])
    }
    setShowCelebration(true)

    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false)
      // If there are more stages, show stage select
      if (currentStage < stages.length - 1) {
        setShowStageSelect(true)
      }
    }, 3000)
  }

  const startNextStage = () => {
    setCurrentStage(currentStage + 1)
    setShowStageSelect(false)
    setGameKey((prev) => prev + 1)
  }

  const selectStage = (stageIndex: number) => {
    setCurrentStage(stageIndex)
    setShowStageSelect(false)
    setGameKey((prev) => prev + 1)
  }

  const resetGame = () => {
    setGameKey((prev) => prev + 1)
  }

  const currentStageData = stages[currentStage]
  const progress = (completedStages.length / stages.length) * 100

  return (
    <div className="w-full max-w-md mx-auto relative">
      {showCelebration && <Celebration />}

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white tracking-widest">NEXUS TIC-TAC</h1>
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="outline"
            className="bg-black text-white border-white border-opacity-30 tracking-wider font-mono text-xs"
          >
            STAGE {currentStageData.id}: {currentStageData.name}
          </Badge>
          <div className="flex items-center font-mono text-xs">
            <Trophy className="h-4 w-4 text-white mr-1" />
            <span>
              {completedStages.length}/{stages.length} COMPLETE
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-1 bg-black border border-white border-opacity-20" />
      </div>

      {showStageSelect ? (
        <div className="bg-black border border-white border-opacity-20 rounded-lg p-4 mb-6 animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-center text-white font-mono tracking-wider">STAGE COMPLETE</h2>
          <div className="grid gap-3">
            <Button onClick={startNextStage} className="bg-white hover:bg-gray-200 text-black font-mono tracking-wider">
              NEXT STAGE <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="text-center text-sm text-gray-400 my-2 font-mono">OR SELECT STAGE</div>
            <div className="grid grid-cols-3 gap-2">
              {stages.map((stage, index) => (
                <Button
                  key={stage.id}
                  variant={completedStages.includes(stage.id) ? "default" : "outline"}
                  className={`
                    ${completedStages.includes(stage.id) ? "bg-white text-black" : "bg-black text-white border-white border-opacity-30"}
                    ${index === currentStage ? "ring-1 ring-white" : ""}
                    font-mono text-xs tracking-wider
                  `}
                  onClick={() => selectStage(index)}
                >
                  {stage.id}
                  {completedStages.includes(stage.id) && <Star className="h-3 w-3 ml-1 text-white" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <GameBoard
          key={gameKey}
          size={currentStageData.size}
          winCondition={currentStageData.winCondition}
          aiDifficulty={currentStageData.aiDifficulty}
          onStageComplete={() => handleStageComplete(currentStageData.id)}
          onReset={resetGame}
        />
      )}
    </div>
  )
}
