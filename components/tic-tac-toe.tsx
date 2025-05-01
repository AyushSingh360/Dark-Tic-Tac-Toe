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
  { id: 1, name: "INIT", size: 3, winCondition: 3, aiDifficulty: 0.2, description: "BASIC SYSTEM CALIBRATION" },
  { id: 2, name: "LEVEL 1", size: 3, winCondition: 3, aiDifficulty: 0.4, description: "NEURAL NETWORK ACTIVE" },
  { id: 3, name: "LEVEL 2", size: 3, winCondition: 3, aiDifficulty: 0.6, description: "PATTERN RECOGNITION ENABLED" },
  { id: 4, name: "LEVEL 3", size: 3, winCondition: 3, aiDifficulty: 0.8, description: "PREDICTIVE ALGORITHMS ONLINE" },
  { id: 5, name: "ADVANCED", size: 4, winCondition: 3, aiDifficulty: 0.6, description: "EXPANDED GRID PARAMETERS" },
  { id: 6, name: "EXPERT", size: 4, winCondition: 4, aiDifficulty: 0.7, description: "STRATEGIC SUBROUTINES ACTIVE" },
  { id: 7, name: "MASTER", size: 4, winCondition: 4, aiDifficulty: 0.9, description: "ENHANCED DECISION MATRIX" },
  { id: 8, name: "COMPLEX", size: 5, winCondition: 4, aiDifficulty: 0.7, description: "COMPLEX SPATIAL ANALYSIS" },
  { id: 9, name: "QUANTUM", size: 5, winCondition: 5, aiDifficulty: 0.8, description: "QUANTUM PROBABILITY MAPPING" },
  { id: 10, name: "FINAL", size: 5, winCondition: 5, aiDifficulty: 0.95, description: "MAXIMUM SYSTEM CAPACITY" },
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

  const getStageDescription = (stageIndex: number) => {
    return stages[stageIndex].description || ""
  }

  const currentStageData = stages[currentStage]
  const progress = (completedStages.length / stages.length) * 100

  return (
    <div className="w-full max-w-md mx-auto relative">
      {showCelebration && <Celebration />}

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white tracking-widest">ASH TIC-TAC</h1>
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col items-start">
            <Badge
              variant="outline"
              className="bg-black text-white border-white border-opacity-30 tracking-wider font-mono text-xs"
            >
              STAGE {currentStageData.id}: {currentStageData.name}
            </Badge>
            <div className="flex items-center mt-1">
              <div className="text-xs text-gray-500 font-mono mr-2">DIFFICULTY:</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-4 mx-px ${
                      i < Math.ceil(currentStageData.aiDifficulty * 5) ? "bg-white" : "bg-white bg-opacity-20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1 font-mono">{getStageDescription(currentStage)}</div>
          <div className="flex flex-col items-end">
            <div className="flex items-center font-mono text-xs">
              <Trophy className="h-4 w-4 text-white mr-1" />
              <span>
                {completedStages.length}/{stages.length} COMPLETE
              </span>
            </div>
            <div className="text-xs text-gray-500 font-mono mt-1">
              STAGE {Math.min(currentStage + 1, stages.length)}/{stages.length}
            </div>
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
            <div className="grid grid-cols-5 gap-2">
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
                  disabled={!completedStages.includes(stage.id) && index !== currentStage && index !== 0}
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
          stageId={currentStageData.id}
          onStageComplete={() => handleStageComplete(currentStageData.id)}
          onReset={resetGame}
        />
      )}
      <div className="mt-8 text-center text-xs text-gray-500 font-mono tracking-wider border-t border-white border-opacity-10 pt-4">
        ©ASH ALL RIGHTS RESERVED
      </div>
    </div>
  )
}
