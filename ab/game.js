document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const boardElement = document.getElementById('board');
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));//1 人 2 机 0 空格

    // 定义全局变量
    let lastMoveRow = -1;
    let lastMoveCol = -1;

    //第五步之后开始检测结果
    let playerMoveCount = 0;

    // 初始化棋盘
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => makeMove(i));
        boardElement.appendChild(cell);
    }

    function makeMove(index) {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        
        
        // 在此处理下棋逻辑，更新棋盘状态
    
        // 示例：将玩家的棋子放置在点击的位置
        if (board[row][col] === 0) {
            lastMoveRow=row
            lastMoveCol=col
            board[row][col] = 1; // 玩家的棋子
            updateBoard();
            playerMoveCount++;
            // 检查游戏是否结束
            if (playerMoveCount >= 5 &&isGameFinished(board,row,col)) {
                alert('game over！you win'); // 你可以使用其他方式来显示胜利信息
                // 重置游戏状态，可以根据实际需求进行处理
                resetGame();
                return;
            }
    
            // 在此调用AI进行下一步
            makeAIMove();
        }
    }

    function resetGame() {
        // 重置棋盘为初始状态
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = 0;
            }
        }
        playerMoveCount = 0;
        // 更新HTML界面
        updateBoard();
    }
    

    function makeAIMove() {
        const emptyCells = getEmptyCells();
        let aiMove = null;
        if (emptyCells.length > 0) {
            for (let i = 0; i < emptyCells.length; i++) {
                const candidateMove = emptyCells[i];
                const newBoard = copyBoard(board);
                newBoard[candidateMove.row][candidateMove.col] = 2;
    
                const score = minimax(newBoard, 3, -Infinity, Infinity, false, lastMoveRow, lastMoveCol).score;
    
                //console.log(`Candidate Move: (${candidateMove.row}, ${candidateMove.col}), Score: ${score}`);
            }

            
            const bestMove = minimax(board, 3, -Infinity, Infinity, true, lastMoveRow, lastMoveCol);
            aiMove = emptyCells[bestMove.index];

            // 封堵玩家的三子连珠
            let result = hasThreateningThreeInARow(lastMoveRow, lastMoveCol, 1)
            if (result) {
                aiMove = findBlockingMove(lastMoveRow, lastMoveCol, 1);
            }

            // 检查AI选择的位置是否有邻近子
            if (hasNeighbor(aiMove.row, aiMove.col)) {
                board[aiMove.row][aiMove.col] = 2; // AI的棋子
                updateBoard();
                playerMoveCount++;

                // 检查游戏是否结束
                if (playerMoveCount >= 5 && isGameFinished(board, aiMove.row, aiMove.col)) {
                    alert('game over！you lost'); // 你可以使用其他方式来显示胜利信息
                    // 重置游戏状态，可以根据实际需求进行处理
                    resetGame();
                    return;
                }
            }

        }
    }
    
    function hasThreateningThreeInARow(row, col, player) {
        // 检查当前位置是否有玩家的三子连珠威胁
        const threats = [
            { rowDelta: 1, colDelta: 0 },
            { rowDelta: 0, colDelta: 1 },
            { rowDelta: 1, colDelta: 1 },
            { rowDelta: 1, colDelta: -1 },
        ];
        for (const threat of threats) {
            
            const threatCount = countThreateningCells(row, col, player, threat.rowDelta, threat.colDelta);
            if (threatCount === 3) {
                return true;
            }
        }
    
        return false;
    }
    
    function countThreateningCells(row, col, player, rowDelta, colDelta) {
        // 计算在给定方向上的威胁数量
        let count = 0;
        for (let i = 1; i <= 3; i++) {
            const newrow = row + i * rowDelta;
            const newcol = col + i * colDelta;
            
            if (newrow >= 0 && newrow < boardSize && newcol >= 0 && newcol < boardSize) {
                
                if (board[newrow][newcol] === player) {
                    count++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    
        return count;
    }
    
    function findBlockingMove(row, col, player) {
        // 寻找封堵的移动
        const directions = [
            { rowDelta: 1, colDelta: 0 },
            { rowDelta: 0, colDelta: 1 },
            { rowDelta: 1, colDelta: 1 },
            { rowDelta: 1, colDelta: -1 },
        ];
    
        for (const direction of directions) {
            const newRow = row + direction.rowDelta;
            const newCol = col + direction.colDelta;
    
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === 0) {
                return { row: newRow, col: newCol };
            }
        }
    
        // 如果没有封堵的步骤，返回原始位置
        return { row, col };
    }


    function isGameFinished(board,row,col) {
        return checkWin(board,row,col)
    }
    
    function checkWin(board,row,col) {
        // 检查水平、垂直和对角线方向上是否有五子连珠
        if (checkDirection(board, row, col, 1, 0) ||  // 水平
            checkDirection(board, row, col, 0, 1) ||  // 垂直
            checkDirection(board, row, col, 1, 1) ||  // 对角线（左上到右下）
            checkDirection(board, row, col, 1, -1)) { // 对角线（右上到左下）
            return true;
    }

    
        return false;
    }
    
    function checkDirection(board, startRow, startCol, rowDirection, colDirection) {
        const player = board[startRow][startCol];
    
        if (player === 0) {
            return false;  // 空格不参与胜利判断
        }
    
        // 检查正方向的五个格子是否属于同一玩家
        let winInDirection = true;
        for (let i = 0; i < 5; i++) {
            const newRow = startRow + i * rowDirection;
            const newCol = startCol + i * colDirection;
            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] !== player) {
                winInDirection = false;
                break;
            }
        }
    
        if (winInDirection) {
            return true;  // 如果正方向有五子连珠，则返回胜利
        }
    
        // 检查反方向的五个格子是否属于同一玩家
        let winInOppositeDirection = true;
        for (let i = 0; i < 5; i++) {
            const oppositeRow = startRow - i * rowDirection;
            const oppositeCol = startCol - i * colDirection;
            if (oppositeRow < 0 || oppositeRow >= boardSize || oppositeCol < 0 || oppositeCol >= boardSize || board[oppositeRow][oppositeCol] !== player) {
                winInOppositeDirection = false;
                break;
            }
        }
    
        return winInOppositeDirection;
    }
    
    

    function minimax(board, depth, alpha, beta, maximizingPlayer, lastMoveRow, lastMoveCol) {
        if (depth === 0 || isGameFinished(board,lastMoveRow,lastMoveCol)) {
            return { score: evaluate(board,lastMoveRow, lastMoveCol), index: -1 };
        }

        const emptyCells = getEmptyCells();

        if (maximizingPlayer) {//true:AI false:human
            let maxScore = alpha //-Infinity;
            let bestMoveIndex = -1;

            for (let i = 0; i < emptyCells.length; i++) {
                const move = emptyCells[i];
                const newBoard = copyBoard(board);
                newBoard[move.row][move.col] = 2;

                const score = minimax(newBoard, depth - 1, alpha, beta, false, lastMoveRow, lastMoveCol).score;

                if (score > maxScore) {
                    maxScore = score;
                    bestMoveIndex = i;
                }

                alpha = Math.max(alpha, maxScore);
                if (beta <= alpha) {
                    break;
                }
            }

            return { score: maxScore, index: bestMoveIndex };
        } else {
            let minScore = beta //Infinity;
            let bestMoveIndex = -1;

            for (let i = 0; i < emptyCells.length; i++) {
                const move = emptyCells[i];
                const newBoard = copyBoard(board);
                newBoard[move.row][move.col] = 1; // 玩家的棋子

                const score = minimax(newBoard, depth - 1, alpha, beta, true, lastMoveRow, lastMoveCol).score;

                if (score < minScore) {
                    minScore = score;
                    bestMoveIndex = i;
                }

                beta = Math.min(beta, minScore);
                if (beta <= alpha) {
                    break;
                }
            }
            
            return { score: minScore, index: bestMoveIndex };
        }
    }

    function evaluate(board,lastMoveRow, lastMoveCol) {
        // 遍历整个棋盘，为当前局面评分
        let totalScore = 0;
    
        // 遍历行
        for (let row = 0; row < boardSize; row++) {
            totalScore += evaluateArray(board[row],lastMoveRow, lastMoveCol);
        }
    
        // 遍历列
        for (let col = 0; col < boardSize; col++) {
            const column = [];
            for (let row = 0; row < boardSize; row++) {
                column.push(board[row][col]);
            }
            totalScore += evaluateArray(column,lastMoveRow, lastMoveCol);
        }
    
        // 遍历对角线（左上到右下）
        for (let startRow = 0; startRow <= boardSize - 5; startRow++) {
            for (let startCol = 0; startCol <= boardSize - 5; startCol++) {
                const diagonal = [];
                for (let i = 0; i < 5; i++) {
                    diagonal.push(board[startRow + i][startCol + i]);
                }
                totalScore += evaluateArray(diagonal,lastMoveRow, lastMoveCol);
            }
        }
    
        // 遍历对角线（右上到左下）
        for (let startRow = 0; startRow <= boardSize - 5; startRow++) {
            for (let startCol = boardSize - 1; startCol >= 4; startCol--) {
                const diagonal = [];
                for (let i = 0; i < 5; i++) {
                    diagonal.push(board[startRow + i][startCol - i]);
                }
                totalScore += evaluateArray(diagonal,lastMoveRow, lastMoveCol);
            }
        }
        return totalScore;
    }
    
    function evaluateArray(array,row,col) {
        let playerCount = 0;
        let opponentCount = 0;
        playerCount = array.filter(cell => cell === 2).length;
        opponentCount = array.filter(cell => cell === 1).length;

        if (playerCount === 0 && opponentCount === 0) {
            return 0;
        }
        console.log("Array:", array);
        // console.log("Row:", row);
        // console.log("Col:", col);
        // console.log("Player Count:", playerCount);
        console.log("Opponent Count:", opponentCount);

        if(opponentCount >= 3){
            console.log("row:"+row+",col:"+col+",count:"+opponentCount)
        }
        // 调整权重，同时考虑进攻和防守
        let playerScore = Math.pow(10, playerCount) + Math.pow(5, opponentCount);
        let opponentScore = Math.pow(10, opponentCount) + Math.pow(5, playerCount);

        // const { updatedPlayerScore, updatedOpponentScore } = checkThreeInARow(array, playerCount, opponentCount,row,col);

        // // 更新 playerScore 和 opponentScore
        // playerScore += updatedPlayerScore;
        // opponentScore += updatedOpponentScore;

        // 返回
        if(playerScore>=opponentScore){   
            return playerScore
        }else{
            return opponentScore
        }
        
    }

    function checkThreeInARow(array, playerCount, opponentCount,row,col) {
        // 在这里检查是否有三子连珠，可以根据实际需求进行逻辑处理
        // 如果有三子连珠，可以进行相应的操作，比如输出日志、触发事件等
        let updatedPlayerScore = 0;
        let updatedOpponentScore = 0;
        if (playerCount === 4) {
            if (array.indexOf(0) !== -1) {
                // 存在玩家的三子连珠，且有空位可以形成四子连珠
                updatedPlayerScore += 100000; // 适当调整分数
                
            }
        } else if (opponentCount === 3) {
            if (array.indexOf(0) !== -1) {
                // 存在对手的三子连珠，且有空位可以形成四子连珠
                //console.log("AI:"+array)
                updatedOpponentScore += 100000; // 适当调整分数
                
            }
        }
        // 返回更新后的分数
        return { updatedPlayerScore, updatedOpponentScore };
    }
    
    function hasNeighbor(row, col) {
        // 遍历周围的8个方向
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                // 跳过中心点
                if (i === 0 && j === 0) {
                    continue;
                }
    
                const newRow = row + i;
                const newCol = col + j;
    
                // 检查是否在边界内
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    // 检查是否有相邻的子
                    if (board[newRow][newCol] !== 0) {
                        return true;
                    }
                }
            }
        }
    
        return false;
    }

    
    function getEmptyCells() {
        const emptyCells = [];
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        // 根据离最后一个落子点的距离排序
        emptyCells.sort((a, b) => {
            const distanceA = calculateDistance(a.row, a.col, lastMoveRow, lastMoveCol);
            const distanceB = calculateDistance(b.row, b.col, lastMoveRow, lastMoveCol);
            return distanceA - distanceB;
        });
        return emptyCells;
    }

    function calculateDistance(row1, col1, row2, col2) {
        // 计算两点之间的曼哈顿距离
        return Math.abs(row1 - row2) + Math.abs(col1 - col2);
    }

    function copyBoard(board) {
        return board.map(row => row.slice());
    }

    function updateBoard() {
        // 在此更新HTML界面，根据棋盘状态更新显示
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / boardSize);
            const col = index % boardSize;
            cell.textContent = board[row][col] === 1 ? '○' : board[row][col] === 2 ? '●' : '';
        });
    }
});



