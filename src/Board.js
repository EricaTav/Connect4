/**
 * Created by Erika on 5/1/2017.
 */


export default class Board {
    //checks each game situation = Win/Loose/Draw or still in game
    static checkWinner(boardMap) {
        let result = Board.checkHorizontal(boardMap);
        if(result!=0)
            return result;

        result = Board.checkVertical(boardMap);
        if(result!=0)
            return result;

        result = Board.checkDiagonal(boardMap);
        if(result!=0)
            return result;

        result = Board.checkDiagonalMinus(boardMap);
        if(result!=0)
            return result;

        result = Board.checkDraw(boardMap);
        if(result==true)
            return 3;
        return 0;
    }
    
    static checkDraw(boardMap){
        let nRows = boardMap.length;
        let nCols = boardMap[0].length;
        let pieceCount=0;
        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j++) {
                if (boardMap[i][j] != 0) pieceCount++;
            }            
        }
        if (pieceCount==nRows*nCols)
            return true;
        return false;
    }
    
    static checkHorizontal(boardMap) {
        let ballCountP1 = 0;
        let ballCountP2 = 0;
        //check horizontal

        let nRows = boardMap.length;
        let nCols = boardMap[0].length;

        for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j++) {
                if (boardMap[i][j] == 1) ballCountP1++; else ballCountP1 = 0;
                if (boardMap[i][j] == 2) ballCountP2++; else ballCountP2 = 0;

                if (ballCountP1 >= 4) return 1;
                if (ballCountP2 >= 4) return 2;
            }
            ballCountP1 = 0;
            ballCountP2 = 0;
        }
        return 0;
    }
    
    static checkVertical(boardMap){
        let ballCountP1 = 0;
        let ballCountP2 = 0;
        let nRows = boardMap.length;
        let nCols = boardMap[0].length;
        //check vertical
        for (let i = 0; i < nCols; i++) {
            for (let j = 0; j < nRows; j++) {
                if (boardMap[j][i] == 1) ballCountP1++; else ballCountP1 = 0;
                if (boardMap[j][i] == 2) ballCountP2++; else ballCountP2 = 0;

                if (ballCountP1 >= 4) return 1;
                if (ballCountP2 >= 4) return 2;
            }
            ballCountP1 = 0;
            ballCountP2 = 0;
        }
        return 0;
    }

    static checkDiagonal(boardMap) {
        let ballCountP1 = 0;
        let ballCountP2 = 0;
        
        //check diagonal
        /*
         for i=0 to 2
             for j=0 to 5-i
                 if mat[j+i,j]......

         for i=1 to 3
             for j=0 to 6-i
                 if mat[j,j+i]......
         */
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 5 - i; j++) {
                if (boardMap[j + i][j] == 1) ballCountP1++; else ballCountP1 = 0;
                if (boardMap[j + i][j] == 2) ballCountP2++; else ballCountP2 = 0;

                if (ballCountP1 >= 4) return 1;
                if (ballCountP2 >= 4) return 2;
            }
            ballCountP1 = 0;
            ballCountP2 = 0;
        }
        for (let i = 1; i <= 3; i++) {
            for (let j = 0; j <= 6 - i; j++) {
                if (boardMap[j][j + i] == 1) ballCountP1++; else ballCountP1 = 0;
                if (boardMap[j][j + i] == 2) ballCountP2++; else ballCountP2 = 0;

                if (ballCountP1 >= 4) return 1;
                if (ballCountP2 >= 4) return 2;
            }
            ballCountP1 = 0;
            ballCountP2 = 0;
        }
        return 0;


    }
    static checkDiagonalMinus(boardMap) {
        let ballCountP1 = 0;
        let ballCountP2 = 0;
        /*check digonal /
         for i=3 to 5
         for j=0 to i
         if mat[i-j,j]......

         for i=1 to 3
         for j=5 to i-1
         if mat[j,(i+5)-j]......
         */
        for (let i = 3; i <= 5; i++) {
            for (let j = 0; j <= i; j++) {
                if (boardMap[i - j][j] == 1) ballCountP1++; else ballCountP1 = 0;
                if (boardMap[i - j][j] == 2) ballCountP2++; else ballCountP2 = 0;

                if (ballCountP1 >= 4) return 1;
                if (ballCountP2 >= 4) return 2;
            }
            ballCountP1 = 0;
            ballCountP2 = 0;
        }
        for (let i = 1; i <= 3; i++) {
            for (let j = 5; j >= i - 1; j--) {
                if (boardMap[j][(i + 5) - j] == 1) ballCountP1++; else ballCountP1 = 0;
                if (boardMap[j][(i + 5) - j] == 2) ballCountP2++; else ballCountP2 = 0;

                if (ballCountP1 >= 4) return 1;
                if (ballCountP2 >= 4) return 2;
            }
            ballCountP1 = 0;
            ballCountP2 = 0;
        }
        return 0;

    }
    
}

