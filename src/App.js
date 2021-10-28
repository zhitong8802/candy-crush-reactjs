import { useEffect, useState, useCallback } from 'react'
import ScoreBoard from './components/ScoreBoard'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const width = 8
const candyColors = [
    blueCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yellowCandy,
    greenCandy
]

const App = () => {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)

    const checkForColumn = useCallback(() => {
        for (let i = 0; i <= 64; i++) {
            for (let c = 5; c > 2; c--) {
                const column = []

                for (let a = 0; a < c; a++) {
                    column.push(i + a * width)
                }

                const decidedColor = currentColorArrangement[i]

                const isBlank = currentColorArrangement[i] === blank

                if (i > ((width * (width - c)) + width)) continue

                if (column.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                    setScoreDisplay((score) => score + c)
                    column.forEach(square => currentColorArrangement[square] = blank)
                    return true
                }
            }
        }
    }, [currentColorArrangement])

    const checkForRow = useCallback(() => {
        for (let i = 0; i < 64; i++) {
            for (let r = 5; r > 2; r--) {
                const row = []

                for (let a = 0; a < r; a++) {
                    row.push(i + a)
                }

                const decidedColor = currentColorArrangement[i]

                const isBlank = currentColorArrangement[i] === blank

                if ((i % width) > (width - r)) continue

                if (row.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                    setScoreDisplay((score) => score + r)
                    row.forEach(square => currentColorArrangement[square] = blank)
                    return true
                }
            }
        }
    }, [currentColorArrangement])

    const moveIntoSquareBelow = useCallback(() => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)

            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(Math.random() * candyColors.length)
                currentColorArrangement[i] = candyColors[randomNumber]
            }

            if ((currentColorArrangement[i + width]) === blank) {
                currentColorArrangement[i + width] = currentColorArrangement[i]
                currentColorArrangement[i] = blank
            }
        }
    }, [currentColorArrangement])

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }
    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }
    const dragEnd = () => {
        if (squareBeingDragged != null && squareBeingReplaced != null) {
            const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
            const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

            currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
            currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

            const validMoves = [
                squareBeingDraggedId - 1,
                squareBeingDraggedId - width,
                squareBeingDraggedId + 1,
                squareBeingDraggedId + width
            ]

            const validMove = validMoves.includes(squareBeingReplacedId)
            let isReset = true;

            if (squareBeingReplacedId && validMove) {
                const isAColumn = checkForColumn()
                const isARow = checkForRow()

                if (isARow || isAColumn) {
                    setSquareBeingDragged(null)
                    setSquareBeingReplaced(null)
                    isReset = false
                }
            }
                       
            if (isReset) {
                currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
                currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
                setCurrentColorArrangement([...currentColorArrangement])
            }
        }
    }


    const createBoard = () => {
        const randomColorArrangement = []
        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(randomColorArrangement)
    }

    useEffect(() => {
        createBoard()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumn()
            checkForRow()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumn, checkForRow, moveIntoSquareBelow, currentColorArrangement])


    return (
        <div className="app">
            <h1>Zhi Tong's Candy Crush Playground</h1>
            <div className="game">
                {currentColorArrangement.map((candyColor, index) => (
                    <img
                        key={index}
                        src={candyColor}
                        alt={candyColor}
                        data-id={index}
                        draggable={true}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                    />
                ))}
            </div>
            <ScoreBoard score={scoreDisplay} />
        </div>
    )
}

export default App

