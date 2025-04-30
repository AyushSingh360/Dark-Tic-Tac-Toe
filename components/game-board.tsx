"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, X, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface GameBoardProps {
  size: number
  winCondition: number
  aiDifficulty: number
  onStageComplete: () => void
  onReset: () => void
}

type CellValue = "X" | "O" | null

export function GameBoard({
  size = 3,
  winCondition = 3,
  aiDifficulty = 0.5,
  onStageComplete,
  onReset,
}: GameBoardProps) {
  const [board, setBoard] = useState<CellValue[][]>(
    Array(size)
      .fill(null)
      .map(() => Array(size).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [winningCells, setWinningCells] = useState<[number, number][]>([])
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)

  // Initialize the board
  useEffect(() => {
    resetBoard()
  }, [size])

  // AI move
  useEffect(() => {
    if (currentPlayer === "O" && !winner) {
      const timeoutId = setTimeout(() => makeAIMove(), 500)
      return () => clearTimeout(timeoutId)
    }
  }, [currentPlayer, winner])

  // Check for winner after each move
  useEffect(() => {
    if (winner === "X") {
      setPlayerScore((prev) => prev + 1)
      if (playerScore + 1 >= 3) {
        // Need to win 3 games to complete a stage
        onStageComplete()
      }
    } else if (winner === "O") {
      setAiScore((prev) => prev + 1)
    }
  }, [winner])

  const resetBoard = () => {
    setBoard(
      Array(size)
        .fill(null)
        .map(() => Array(size).fill(null)),
    )
    setCurrentPlayer("X")
    setWinner(null)
    setWinningCells([])
  }

  const resetGame = () => {
    resetBoard()
    setPlayerScore(0)
    setAiScore(0)
    onReset()
  }

  const checkWinner = (board: CellValue[][], row: number, col: number): [CellValue, [number, number][]] => {
    const player = board[row][col]
    if (!player) return [null, []]

    // Check directions: horizontal, vertical, diagonal, anti-diagonal
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ]

    for (const [dx, dy] of directions) {
      let count = 1
      const winCells: [number, number][] = [[row, col]]

      // Check in positive direction
      for (let i = 1; i < winCondition; i++) {
        const newRow = row + i * dx
        const newCol = col + i * dy
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol] === player) {
          count++
          winCells.push([newRow, newCol])
        } else {
          break
        }
      }

      // Check in negative direction
      for (let i = 1; i < winCondition; i++) {
        const newRow = row - i * dx
        const newCol = col - i * dy
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol] === player) {
          count++
          winCells.push([newRow, newCol])
        } else {
          break
        }
      }

      if (count >= winCondition) {
        return [player, winCells]
      }
    }

    // Check for draw
    const isDraw = board.every((row) => row.every((cell) => cell !== null))
    if (isDraw) {
      return ["draw" as CellValue, []]
    }

    return [null, []]
  }

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== null || winner || currentPlayer !== "X") return

    const newBoard = [...board.map((row) => [...row])]
    newBoard[row][col] = "X"
    setBoard(newBoard)

    const [gameWinner, winCells] = checkWinner(newBoard, row, col)
    if (gameWinner) {
      setWinner(gameWinner)
      setWinningCells(winCells)
      return
    }

    setCurrentPlayer("O")
  }

  const makeAIMove = () => {
    // Get all empty cells
    const emptyCells: [number, number][] = []
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === null) {
          emptyCells.push([i, j])
        }
      }
    }

    if (emptyCells.length === 0) return

    let move: [number, number]

    // Smart move based on difficulty
    if (Math.random() < aiDifficulty) {
      // Try to find winning move
      for (const [row, col] of emptyCells) {
        const newBoard = [...board.map((r) => [...r])]
        newBoard[row][col] = "O"
        const [result] = checkWinner(newBoard, row, col)
        if (result === "O") {
          move = [row, col]
          break
        }
      }

      // Try to block player's winning move
      if (!move) {
        for (const [row, col] of emptyCells) {
          const newBoard = [...board.map((r) => [...r])]
          newBoard[row][col] = "X"
          const [result] = checkWinner(newBoard, row, col)
          if (result === "X") {
            move = [row, col]
            break
          }
        }
      }
    }

    // Random move if no smart move found or based on difficulty
    if (!move) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length)
      move = emptyCells[randomIndex]
    }

    const [row, col] = move
    const newBoard = [...board.map((r) => [...r])]
    newBoard[row][col] = "O"
    setBoard(newBoard)

    const [gameWinner, winCells] = checkWinner(newBoard, row, col)
    if (gameWinner) {
      setWinner(gameWinner)
      setWinningCells(winCells)
      return
    }

    setCurrentPlayer("X")
  }

  const renderCell = (row: number, col: number) => {
    const value = board[row][col]
    const isWinningCell = winningCells.some(([r, c]) => r === row && c === col)

    return (
      <button
        key={`${row}-${col}`}
        className={cn(
          "aspect-square flex items-center justify-center rounded-none text-2xl font-bold transition-all",
          "bg-black hover:bg-gray-900 border border-white border-opacity-20",
          isWinningCell && "bg-white bg-opacity-20 border-white border-opacity-70 animate-pulse",
          winner && !isWinningCell && "opacity-50",
          "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:opacity-0 before:hover:opacity-10",
        )}
        onClick={() => handleCellClick(row, col)}
        disabled={!!winner || value !== null || currentPlayer !== "X"}
      >
        {value === "X" && <X className="h-8 w-8 text-white" strokeWidth={1.5} />}
        {value === "O" && <Circle className="h-7 w-7 text-white" strokeWidth={1.5} />}
      </button>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div
          className={cn(
            "px-3 py-1 rounded-none font-mono text-xs tracking-wider",
            currentPlayer === "X" && !winner
              ? "bg-white bg-opacity-10 text-white ring-1 ring-white ring-opacity-30"
              : "bg-black text-gray-400 border border-white border-opacity-10",
          )}
        >
          YOU: {playerScore}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetBoard}
            className="bg-black hover:bg-gray-900 border-white border-opacity-20 rounded-none font-mono text-xs tracking-wider"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> RESET
          </Button>
        </div>

        <div
          className={cn(
            "px-3 py-1 rounded-none font-mono text-xs tracking-wider",
            currentPlayer === "O" && !winner
              ? "bg-white bg-opacity-10 text-white ring-1 ring-white ring-opacity-30"
              : "bg-black text-gray-400 border border-white border-opacity-10",
          )}
        >
          SYS: {aiScore}
        </div>
      </div>

      <div className="mb-4">
        {winner ? (
          <div
            className={cn(
              "text-center py-2 rounded-none font-mono text-xs tracking-wider",
              winner === "X"
                ? "bg-white bg-opacity-10 text-white border border-white border-opacity-30"
                : winner === "O"
                  ? "bg-white bg-opacity-10 text-white border border-white border-opacity-30"
                  : "bg-black text-white border border-white border-opacity-10",
            )}
          >
            {winner === "X" ? "USER VICTORY" : winner === "O" ? "SYSTEM VICTORY" : "STALEMATE"}
          </div>
        ) : (
          <div
            className={cn(
              "text-center py-2 rounded-none font-mono text-xs tracking-wider",
              currentPlayer === "X" ? "bg-white bg-opacity-5 text-white" : "bg-white bg-opacity-5 text-white",
            )}
          >
            {currentPlayer === "X" ? "USER INPUT REQUIRED" : "SYSTEM PROCESSING..."}
          </div>
        )}
      </div>

      <div
        className="grid gap-[1px] mb-4 p-[1px] bg-white bg-opacity-10"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((row, rowIndex) => row.map((_, colIndex) => renderCell(rowIndex, colIndex)))}
      </div>

      <div className="text-center text-xs text-gray-400 font-mono">
        WIN {3 - playerScore} MORE {playerScore === 2 ? "MATCH" : "MATCHES"} TO COMPLETE STAGE
      </div>
    </div>
  )
}
