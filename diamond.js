const printDiamond = function(height, char) {
    const printRow = function (height, row, char){
        if (row > height) {
            return;
        }

        const rowIndex = row > Math.round(height / 2) ? height - row + 1 : row;
        const charCount = rowIndex * 2 - 1;
        const spaceCount = (height - charCount) / 2;
        console.log(' '.repeat(spaceCount) + char.repeat(charCount));
        printRow(height, row + 1, char);
    };

    printRow(height, 1, char);
};

const printDiamondUsingFor = function(height, char) {
    for (let row = 1; row <= height; row++) {
        const rowIndex = row > Math.round(height / 2) ? height - row + 1 : row;
        const charCount = rowIndex * 2 - 1;
        const spaceCount = (height - charCount) / 2;
        console.log(' '.repeat(spaceCount) + char.repeat(charCount));
    }
};
printDiamondUsingFor(5, '@');





/*

    height = 5
  @
 @@@
@@@@@@
 @@@
  @

    height = 7
   @                3 space, 1 char, row = 1  charCount = row * 2 + 1
  @@@               2 space, 3 char, row = 2  spaceCount = (height - charCount) / 2
 @@@@@              1 space, 5 char, row = 3
@@@@@@@             0 space, 7 char, row = 4
 @@@@@
  @@@
   @
*/
