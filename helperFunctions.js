// Helper functions to handle rendering things to the screen so you can focus on writing the JS logic. 
// If you're interested, you can learn everything this file is doing by reading through the comments and doing some Googling. 

var makeGameBoard = function(boardSize) {
  var board = [];
  // Board is an array of arrays. console.log it to investigate it further!
  for(var i = 0; i < boardSize; i++) {
    var row = [];
    for(var j = 0; j < boardSize; j++) {
      var telegraphBlue1 = '#48B9C4'; //these are 'hex' representations of colors. It's just a way of telling the machine exactly what shade of blue we want. 
      var telegraphBlue2 = '#1A3D6D';
      //set an initial pattern of alternating colors on each square. 
      if ( (i + j) % 2 === 0 ) {
        var color = telegraphBlue1; 
      } else {
        color = telegraphBlue2; //remember that if and for loops don't create their own scope, only function bodies. 
      }
      //each square (position on the board) is represented by an object. 
      var square = {
        position: [i, j],
        color: color,
        gamePiece: '', // This is the property that will contain our gamePiece object if one is on that square. 
        text: '',
        imageURL: ''
      };
      row.push(square);
    }
    board.push(row);
  }

  return board;
};

// Call this function each time you make a change and want that change to appear on the screen. Otherwise, your "code" will know that the change happened, but the screen won't know that it's supposed to update. 
// INTERNAL: There are more elegant ways of doing this (right now we're wiping out the existing rendered gameBoard entirely and rendering the whole new one). We could just update individual pieces, but that would require us to build out more helper functions for the students, which would decrease their feeling of ownership over the whole project. This way also explicitly calls out that updating state and updating rendering are two separate things. This also lets the student focus on what they feel comfortable with and what the goal of the course is (writing JS logic/functional programming), and really not have to think about DOM or rendering stuff much at all. 
var renderGameBoard = function(gameBoard) {
  $('.gameBoard').html('');
  var boardSize = gameBoard.length;
  // we scale the gameBoard to the user's screen. First we find which is smaller, the height or width of the user's browser
  var browserSize = Math.min($(window).height(), $(window).width());
  $('.gameBoard').width(browserSize - 110);
  // then we leave some room around the edges (200 pixels), and divide by the number of squares to find how large the squares should be to fill that space perfectly.
  var squareSize = (browserSize- 110) / boardSize - 2;
  gameBoard.forEach(function(rowArr, rowIndex) {
    rowArr.forEach(function(squareObj, columnIndex) {
      // Here we are creating the HTML that will be rendered to the DOM for each square. 
      // HTML and JS play nicely together; you can just create a string with most of the characters that you need, add in some variables dynamically, and then when you render this to the DOM, it will interpret everything to be HTML elements and display them correctly. 
      // We're creating a <div>, which is just a default html container that we can do whatever we want with (similar to an object in JS).
      // We can then set "properties" on this html element. In this case, we're setting style properties to tell it how it should look on the screen. 
        // Those style properties include it's size (height and width) in pixels (px). 
        // We're setting it's background color to be the color of that squareObj. 
      // To keep track of which square this is (necessary for figuring out which square was clicked on later), we set a data "property" on each square as well. 
      // Inside of each div, we can put whatever text we want! Or none at all- it doesn't care. So we put in the text from the object at that position, if one exists. 
      // OPTIONAL: You can change what gets rendered for each square. Want to display the name differently? Feel free to modify the code below to do what you want!
      if(squareObj.gamePiece && squareObj.gamePiece.imageURL) {
        var squareHtml = '<img src="' + squareObj.gamePiece.imageURL + '" class="gameSquare" style="height:' + squareSize + 'px; width:' + squareSize + 'px" data-position="[' + rowIndex + ',' + columnIndex + ']">'
      } else {
        var squareText = '';
        if(squareObj.gamePiece) {
          squareText = squareObj.gamePiece.name;
        }
        var squareHtml = '<div class="gameSquare" style="background-color:' + squareObj.color + '; height:' + squareSize + 'px; width:' + squareSize + 'px" data-position="[' + rowIndex + ',' + columnIndex + ']">' + squareText + '</div>';
      }
      $('.gameBoard').append(squareHtml);
    });
  });

  // NOTE: we attach the event listeners AFTER we have attached the elements to the DOM. You will definitely get tripped up by this at some point in your career :)
  $(document).on('click', '.gameSquare', function() {
    console.log($(this));
    clickHandler($(this).data('position'));
  });
}

//here we're going to keep track of the count of all pieces added to our gameBoard. 
var totalPieceCount = {};

//initialPosition should be an array with two numbers in it. 
  // those numbers should specify the 0-indexed row and column you want this piece to start at. 
  // example: [1,3] would put the piece on the second row (remember we're 0-indexed) in the 4th column. 
var makePiece = function(gameBoard, initialPosition, pieceType, playerBelongsTo) {
  // make sure this piece is counted in our totalPieceCount object. 
  if(totalPieceCount[pieceType]) {
    totalPieceCount[pieceType]++;
  } else {
    totalPieceCount[pieceType] = 1;
  }

  // default player to Player1 if no player name is passed in, then defines a unique name for this gamePiece
  playerBelongsTo = playerBelongsTo || 'Player1';
  var pieceName = playerBelongsTo + ' ' + pieceType + ' #' + totalPieceCount[pieceType];

  var gamePiece = {
    movementDescription: 'use words to describe how this piece moves so your users can understand what their options are',
    collisionDescription: 'use words to explain what happens when this piece collides with another',
    name: pieceName,
    typeOfPiece: pieceType,
    imageURL: '',
    playerBelongsTo: playerBelongsTo  // if you have a game with two (or more?!) players playing against each other, you'll want to specify which player this piece belongs to
  }

  var row = initialPosition[0];
  var column = initialPosition[1];

  gameBoard[row][column].gamePiece = gamePiece;

  return gamePiece;
};
