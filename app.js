document.addEventListener("DOMContentLoaded", () => {
  for (let i = 1; i < 210; i++) {
    $("#parent").append("<div class='ok'></div>");
  }
  const gird = document.querySelector(".gird");
  let squares = Array.from($(".gird div"));
  // let scoreDisplay = $("#score");
  let scoreDisplay = document.querySelector("#score");
  // console.log(scoreDisplay.innerHTML=10)
  // const startBtn = $('#start-button');
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];
  for (let i = 209; i > 199; i--) {
    squares[i].classList.add("taken");
    squares[i].classList.remove("ok");
  }

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //radom
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  // khoi roi xuong moi giay
  // timerId = setInterval(moveDown, 1000);

  // them su kien an phim
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveFast();
    }
  }
  document.addEventListener("keyup", control);

  // move fast
  function moveFast() {
    undraw();
    const isUnder = current.some((index) =>
      squares[currentPosition + index + width*2].classList.contains("taken")
    );
    console.log(isUnder)
    if (!isUnder) {
      currentPosition += width;
    }

    draw();
  }

  //move down
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      // start new
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // chan ko cho vat the di qua khung ben trai
  function moveLeft() {
    undraw();
    // khi o vi tri tan cung ben trai chi so dang 10,20,30...
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // sang phai

  function moveRight() {
    undraw();
    const isAtRight = current.some(
      (index) => (currentPosition + index) % width == width - 1
    );

    if (!isAtRight) currentPosition++;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition--;
    }

    draw();
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }
  //ronate the tetromino

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }

  // show mini gird
  const displaySquares = Array.from($(".mini-gird div"));
  const displayWidth = 4;
  let displayIndex = 0;

  const upNextTet = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //L
    [1, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 2], // Z
    [
      1 + displayWidth,
      displayWidth * 2,
      displayWidth * 2 + 1,
      displayWidth * 2 + 2,
    ], // T
    [
      1 + displayWidth,
      2 + displayWidth,
      displayWidth * 2 + 1,
      displayWidth * 2 + 2,
    ], // O
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // I
  ];

  //display the shape in mini grid

  function displayShape() {
    // remove
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTet[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // when click button start
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 500);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        // console.log(squaresRemoved)
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => gird.appendChild(cell));
      }
    }
  }

  // game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      alert("GAME OVER");
      scoreDisplay.innerHTML = 0
      clearInterval(timerId);
      squares.forEach((square) => {
        square.classList.remove("tetromino");
        square.classList.remove("taken");
        square.style.backgroundColor = "";
      });
      displaySquares.forEach((square) => {
        square.classList.remove("tetromino");
        square.style.backgroundColor = "";
      });
      timerId = null;
      for (let i = 209; i > 199; i--) {
        squares[i].classList.add("taken");
      }
    }
  }
});
