// Wait for the DOM to be fully loaded before executing code
document.addEventListener("DOMContentLoaded", () => {
  let board = null; // Initialize the chessboard
  const game = new Chess(); // Create new Chess.js game instance
  const moveHistory = document.getElementById("move-history"); // Get move history container
  let moveCount = 1; // Initialize the move count
  let currentPlayer = "w"; // Initialize the current player as white

  // Function to record and display a move in the move history
  const recordMove = (move, count) => {
      const formattedMove =
          count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
      moveHistory.textContent += formattedMove + " ";
      moveHistory.scrollTop = moveHistory.scrollHeight; // Auto-scroll to the latest move
  };

  // Function to handle the end of a piece snap animation
  const onSnapEnd = () => {
      board.position(game.fen());
  };

  // Configuration options for the chessboard
  const boardConfig = {
      showNotation: true,
      draggable: true,
      position: "start",
      onDrop: (source, target) => {
          // If the source and target are the same or the game is over, return snapback
          if (source === target || game.game_over()) {
              return "snapback";
          }

          // Attempt to make the move
          const move = game.move({
              from: source,
              to: target,
              promotion: "q",
          });

          // If the move is invalid, snap the piece back to its original position
          if (move === null) {
              return "snapback";
          }

          // Update the board position and move history
          board.position(game.fen());
          recordMove(move.san, moveCount);
          moveCount++;

          // Check if the game is over
          if (game.game_over()) {
              alert("Game Over");
          } else {
              // Switch to the other player's turn
              currentPlayer = currentPlayer === "w" ? "b" : "w";
          }
      },
      onSnapEnd,
  };

  // Initialize the chessboard
  board = Chessboard("board", boardConfig);

  // Event listener for the "Play Again" button
  document.querySelector(".play-again").addEventListener("click", () => {
      game.reset();
      board.start();
      moveHistory.textContent = "";
      moveCount = 1;
      currentPlayer = "w";
  });

  // Event listener for the "Set Position" button
  document.querySelector(".set-pos").addEventListener("click", () => {
      const fen = prompt("Enter the FEN notation for the desired position!");
      if (fen !== null) {
          if (game.load(fen)) {
              board.position(fen);
              moveHistory.textContent = "";
              moveCount = 1;
              currentPlayer = "w";
          } else {
              alert("Invalid FEN notation. Please try again.");
          }
      }
  });

  // Event listener for the "Flip Board" button
  document.querySelector(".flip-board").addEventListener("click", () => {
      board.flip();
      // Toggle user's color after flipping the board
      currentPlayer = currentPlayer === "w" ? "b" : "w";

      // Disable draggable while the board is flipping
      board.set({ draggable: false });

      // Enable draggable after the flip animation is complete
      setTimeout(() => {
          board.set({ draggable: true });
      }, 500); // Adjust the delay time according to your flip animation duration
  });
});
