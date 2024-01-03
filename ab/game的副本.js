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
        
        if (emptyCells.length > 0) {
            const bestMove = minimax(board, 3, -Infinity, Infinity, true, lastMoveRow, lastMoveCol);
            
            const aiMove = emptyCells[bestMove.index];
            if (evaluateThreat(board, 1)) {
                const threatPosition = findThreatPosition(board, 1);
                if(typeof board[threatPosition.returnRow]==='undefined'){
                    board[aiMove.row][aiMove.col] = 2; // AI的棋子
                }else{
                    if(isCellOccupied(board,threatPosition.returnRow,threatPosition.returnCol)){
                        board[aiMove.row][aiMove.col] = 2; // AI的棋子
                    }else{
                        board[threatPosition.returnRow][threatPosition.returnCol] = 2;
                    }
                    
                }               
            }else{
                board[aiMove.row][aiMove.col] = 2; // AI的棋子
            }
            updateBoard();
            playerMoveCount++;
        }
        // 检查游戏是否结束
        if (playerMoveCount >= 5 &&isGameFinished(board,aiMove.row,aiMove.col)) {
            alert('game over！you lost'); // 你可以使用其他方式来显示胜利信息
            // 重置游戏状态，可以根据实际需求进行处理
            resetGame();
            return;
        }
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
            return { score: evaluate(board), index: -1 };
        }

        const emptyCells = getEmptyCells();

        if (maximizingPlayer) {
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

    function getBestPlayerMove(board, depth) {
        const emptyCells = getEmptyCells();
    
        let bestMove = { row: -1, col: -1 };
        let bestScore = -Infinity;
    
        for (let i = 0; i < emptyCells.length; i++) {
            const move = emptyCells[i];
            const newBoard = copyBoard(board);
            newBoard[move.row][move.col] = 1; // 玩家的棋子
    
            const score = minimax(newBoard, depth - 1, -Infinity, Infinity, true, move.row, move.col).score;
    
            if (score > bestScore) {
                bestScore = score;
                bestMove = { ...move, score }; // 包含分数和索引
            }
        }
    
        return bestMove;
    }
    
    
    function evaluate(board) {
        // 遍历整个棋盘，为当前局面评分
        let totalScore = 0;
    
        // 遍历行
        for (let row = 0; row < boardSize; row++) {
            totalScore += evaluateRow(board[row],"row");
        }
    
        // 遍历列
        for (let col = 0; col < boardSize; col++) {
            const column = [];
            for (let row = 0; row < boardSize; row++) {
                column.push(board[row][col]);
            }
            totalScore += evaluateRow(column,"col");
        }
    
        // 遍历对角线（左上到右下）
        for (let startRow = 0; startRow <= boardSize - 5; startRow++) {
            for (let startCol = 0; startCol <= boardSize - 5; startCol++) {
                const diagonal = [];
                for (let i = 0; i < 5; i++) {
                    diagonal.push(board[startRow + i][startCol + i]);
                }
                totalScore += evaluateRow(diagonal,"diagonal");
            }
        }
    
        // 遍历对角线（右上到左下）
        for (let startRow = 0; startRow <= boardSize - 5; startRow++) {
            for (let startCol = boardSize - 1; startCol >= 4; startCol--) {
                const diagonal = [];
                for (let i = 0; i < 5; i++) {
                    diagonal.push(board[startRow + i][startCol - i]);
                }
                totalScore += evaluateRow(diagonal,"diagonal");
            }
        }
    
        return totalScore;
    }
    
    function evaluateRow(line, type) {
        // 在这里，你可以根据五子棋的规则为每一行、列或对角线评分
        // 这只是一个简单的例子，你可以根据实际需求进行更复杂的评估
        const playerCount = line.filter(cell => cell === 2).length;
        const opponentCount = line.filter(cell => cell === 1).length;
    
        let scoreRow = 0;
        let scoreCol = 0;
        let scoreDiagonal = 0;
        // 根据 type 进行不同的评估逻辑
        switch (type) {
            case 'row':
                // 行的评估逻辑
                scoreRow = Math.pow(10, playerCount) + Math.pow(5, opponentCount);
                break;
            case 'col':
                // 列的评估逻辑
                scoreCol = Math.pow(10, playerCount) + Math.pow(5, opponentCount);
                // 在这里添加列的评估逻辑
                break;
            case 'diagonal':
                // 对角线的评估逻辑
                scoreDiagonal = Math.pow(10, playerCount) + Math.pow(5, opponentCount);
                // 在这里添加对角线的评估逻辑
                break;
            default:
                break;
        }
    
        return scoreRow+scoreCol+scoreDiagonal;
    }
    //防守评估

    function evaluateThreat(board, player) {
        const threatCount = 3; // 定义威胁的棋子数，你可以根据实际需求进行调整
    
        // 遍历整个棋盘，检查是否存在威胁
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                // 检查水平、垂直和对角线方向上是否有威胁
                if (checkConsecutive(board, row, col, 1, 0, threatCount, player) ||  // 水平
                    checkConsecutive(board, row, col, 0, 1, threatCount, player) ||  // 垂直
                    checkConsecutive(board, row, col, 1, 1, threatCount, player) ||  // 对角线（左上到右下）
                    checkConsecutive(board, row, col, 1, -1, threatCount, player)) { // 对角线（右上到左下）
                    return true;  // 存在威胁
                }
            }
        }
    
        return false;  // 不存在威胁
    }
    
    function checkConsecutive(board, startRow, startCol, rowDirection, colDirection, count, player) {
        let consecutiveCount = 0;
    
        for (let i = 0; i < count; i++) {
            const newRow = startRow + i * rowDirection;
            const newCol = startCol + i * colDirection;
    
            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] !== player) {
                break;
            }
    
            consecutiveCount++;
        }
        
        return consecutiveCount >= count;
    }

    function findThreatPosition(board, player) {
        const boardSize = board.length;
        let returnRow=0;
        let returnCol=0;
        // 遍历整个棋盘
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                // 检查当前位置是否为玩家的棋子
                
                if (board[row][col] === player) {
                    // 在当前位置的基础上，检查水平、垂直和对角线方向上是否存在三子
                    if (checkConsecutiveInDirection(board, row, col, 0, 1, player, 3)) {
                        // 返回威胁位置的坐标
                        if((board[row][col+1] == 0)&&(board[row][col-1] !== 0)){//
                            returnRow=row;
                            returnCol=col+1;
                            return { returnRow, returnCol }
                        }else if((board[row][col-1] == 0)&&(board[row][col+1] !== 0)){//                          
                            returnRow=row;
                            returnCol=col-1;
                            return { returnRow, returnCol }
                        }
                    }
                    else if(checkConsecutiveInDirection(board, row, col, 0, -1, player, 3)){
                            // 返回威胁位置的坐标
                            if((board[row][col+1] == 0)&&(board[row][col-1] !== 0)){//
                                returnRow=row;
                                returnCol=col+1;
                                return { returnRow, returnCol }
                            }else if((board[row][col-1] == 0)&&(board[row][col+1] !== 0)){//                           
                                returnRow=row;
                                returnCol=col-1;
                                return { returnRow, returnCol }
                            }   
                        
                    }
                    else if(checkConsecutiveInDirection(board, row, col, 1, 0, player, 3)){// 垂直 向下
                        if((board[row+1][col] == 0)&&(board[row-1][col] !== 0)){//下方向空 上方向非空
                            returnRow=row+1;
                            returnCol=col
                            return { returnRow, returnCol }
                        }else if((board[row-1][col] == 0)&&(board[row+1][col] !== 0)){//上方向空 下方向非空                           
                            returnRow=row-1;
                            returnCol=col
                            return { returnRow, returnCol }
                        }
                    }
                    else if(checkConsecutiveInDirection(board, row, col, -1, 0, player, 3)){// 垂直 向上
                        if((board[row+1][col] == 0)&&(board[row-1][col] !== 0)){//下方向空 上方向非空
                            returnRow=row+1;
                            returnCol=col+1;
                            return { returnRow, returnCol }
                        }
                        else if((board[row-1][col] == 0)&&(board[row+1][col] !== 0)){//上方向空 下方向非空                           
                            returnRow=row-1;
                            returnCol=col-1;
                            return { returnRow, returnCol }
                        }
                    }
                    else if(checkConsecutiveInDirection(board, row, col, 1, 1, player, 3)){// 对角线（左上到右下）
                        console.log("row:"+row+"+col:"+col);
                        if((board[row+1][col+1] == 0)&&(board[row-1][col-1] !== 0)){//
                            returnRow=row+1;
                            returnCol=col+1;
                            return { returnRow, returnCol }
                        }
                        else if((board[row-1][col-1] == 0)&&(board[row+1][col+1] !== 0)){//                          
                            returnRow=row-1;
                            returnCol=col-1;
                            return { returnRow, returnCol }
                        }

                    }
                    else if(checkConsecutiveInDirection(board, row, col, -1, -1, player, 3)){
                        if((board[row+1][col+1] == 0)&&(board[row-1][col-1] !== 0)){//
                            returnRow=row+1;
                            returnCol=col+1;
                            return { returnRow, returnCol }
                        }
                        else if((board[row-1][col-1] == 0)&&(board[row+1][col+1] !== 0)){//                          
                            returnRow=row-1;
                            returnCol=col-1;
                            return { returnRow, returnCol }
                        }
                    }
                    else if(checkConsecutiveInDirection(board, row, col, 1, -1, player, 3)){// 对角线（右上到左下）
                        if((board[row-1][col+1] == 0)&&(board[row+1][col-1] !== 0)){//
                            returnRow=row-1;
                            returnCol=col+1;
                            return { returnRow, returnCol }
                        }
                        else if((board[row+1][col-1] == 0)&&(board[row-1][col+1] !== 0)){//                          
                            returnRow=row+1;
                            returnCol=col-1;
                            return { returnRow, returnCol }
                        }
                    }else if(checkConsecutiveInDirection(board, row, col, -1, 1, player, 3)){
                        if((board[row-1][col+1] == 0)&&(board[row+1][col-1] !== 0)){//
                            returnRow=row-1;
                            returnCol=col+1;
                            return { returnRow, returnCol }
                        }
                        else if((board[row+1][col-1] == 0)&&(board[row-1][col+1] !== 0)){//                          
                            returnRow=row+1;
                            returnCol=col-1;
                            return { returnRow, returnCol }
                        }
                    }
                }
            }
        }
    
        // 如果没有找到威胁位置，返回 null 或者其他合适的值
        // 如果没有找到威胁位置，从还未落子的格子中随机选择一个格子
        const availableMoves = getAvailableMoves(); // 假设有一个函数获取还未落子的格子坐标
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const randomMove = availableMoves[randomIndex];

        return randomMove;
    }

    // 辅助函数，检查特定方向上是否存在指定数量的相同棋子
    function checkConsecutiveInDirection(board, startRow, startCol, rowDirection, colDirection, player, count) {
        const boardSize = board.length;
        let consecutiveCount = 0;

        for (let i = 0; i < count; i++) {
            const newRow = startRow + i * rowDirection;
            const newCol = startCol + i * colDirection;

            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] !== player) {
                // 如果超出边界或者不是相同的棋子，重置计数
                consecutiveCount = 0;
            } else {
                // 相同棋子数量加一
                consecutiveCount++;
            }

            if (consecutiveCount === count) {
                // 如果达到指定数量的相同棋子，返回 true
                return true;
            }
        }

        // 如果未达到指定数量，返回 false
        return false;
    }
    
    // 检查某个位置是否已经被落子
    function isCellOccupied(board, row, col) {
        return board[row][col] !== 0;//未被落子
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
        return emptyCells;
    }
    
    function copyBoard(board) {
        return board.map(row => row.slice());
    }

    function getAvailableMoves() {
        const availableMoves = [];
      
        for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 0) {
              // 当前位置是空的，可以落子
              availableMoves.push({ row, col });
            }
          }
        }
      
        return availableMoves;
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



