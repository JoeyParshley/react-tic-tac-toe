# Tic Tac Toe Game - GitHub Issues

This file contains all issues for the tic-tac-toe game project. Each issue can be created in GitHub and added to the project board.

---

## Issue #1: Define Core Domain Types

**Type:** Domain  
**Priority:** High  
**Labels:** `domain`, `types`, `foundation`

### Description
Define the core domain types that will be used throughout the game logic. These types form the foundation of our typed domain-first approach.

### Tasks
- [x] Create `Player` type: `'X' | 'O'`
- [x] Create `Cell` type: `'empty' | 'X' | 'O'`
- [x] Create `Position` type/interface with `row: number` and `col: number` (0-2)
- [x] Create `GameState` type: `'playing' | 'won' | 'draw'`

### Acceptance Criteria
- [x] All types are defined in a dedicated domain types file (e.g., `src/domain/types.ts`)
- [x] Types are exported and ready to be used by other domain modules
- [x] Types follow TypeScript best practices (discriminated unions where appropriate)

### Files to Create
- `src/domain/types.ts`

---

## Issue #2: Create Board Domain Model

**Type:** Domain  
**Priority:** High  
**Labels:** `domain`, `model`, `board`

### Description
Create a Board domain model that represents the 3x3 grid with type-safe position handling. The board should be immutable and provide methods for querying and updating cells.

### Tasks
- [x] Create `Board` class or type that represents a 3x3 grid
- [x] Implement type-safe position validation (ensure row/col are 0-2)
- [x] Implement methods: `getCell(position: Position): Cell`
- [x] Implement methods: `setCell(position: Position, cell: Cell): Board` (returns new board)
- [x] Implement method: `isEmpty(position: Position): boolean`
- [x] Implement method: `getAllCells(): Cell[][]`

### Acceptance Criteria
- [x] Board is immutable (operations return new instances)
- [x] Position validation throws errors for invalid positions
- [x] Board can be initialized as empty or with a specific state
- [x] All methods are type-safe

### Files to Create
- `src/domain/Board.ts`

### Dependencies
- Issue #1 (Domain Types)

---

## Issue #3: Implement Game Logic - Move Validation

**Type:** Domain  
**Priority:** High  
**Labels:** `domain`, `logic`, `validation`

### Description
Implement the core game logic for making moves with proper validation. This includes checking if a cell is empty and if the game is still in a playable state.

### Tasks
- [x] Create `makeMove` function that takes: board, position, and player
- [x] Validate that the position is within bounds
- [x] Validate that the cell at the position is empty
- [x] Validate that the game is still in 'playing' state
- [x] Return a new board with the move applied
- [x] Handle error cases appropriately (throw errors or return Result type)

### Acceptance Criteria
- [x] Cannot make a move on an occupied cell
- [x] Cannot make a move outside the board boundaries
- [x] Cannot make a move when game is already won or drawn
- [x] Move function is pure (no side effects)
- [x] Error messages are clear and helpful

### Files to Create
- `src/domain/gameLogic.ts` or add to `src/domain/Game.ts`

### Dependencies
- Issue #1 (Domain Types)
- Issue #2 (Board Model)

---

## Issue #4: Implement Win Detection

**Type:** Domain  
**Priority:** High  
**Labels:** `domain`, `logic`, `win-detection`

### Description
Implement win detection logic that checks all possible winning conditions: rows, columns, and both diagonals.

### Tasks
- [x] Create `checkWin` function that takes a board and returns the winning player or null
- [x] Check all 3 rows for a winner
- [x] Check all 3 columns for a winner
- [x] Check the main diagonal (top-left to bottom-right)
- [x] Check the anti-diagonal (top-right to bottom-left)
- [x] Return the winning player ('X' or 'O') or null if no winner

### Acceptance Criteria
- [x] Correctly detects horizontal wins
- [x] Correctly detects vertical wins
- [x] Correctly detects diagonal wins
- [x] Returns null when there's no winner
- [x] Function is pure and testable

### Files to Create
- Add to `src/domain/gameLogic.ts` or `src/domain/Game.ts`

### Dependencies
- Issue #1 (Domain Types)
- Issue #2 (Board Model)

---

## Issue #5: Implement Draw Detection

**Type:** Domain  
**Priority:** High  
**Labels:** `domain`, `logic`, `draw-detection`

### Description
Implement logic to detect when the game ends in a draw (board is full with no winner).

### Tasks
- [x] Create `checkDraw` function that takes a board
- [x] Check if the board is full (no empty cells)
- [x] Check that there is no winner
- [x] Return true if both conditions are met, false otherwise

### Acceptance Criteria
- [x] Correctly identifies draw when board is full and no winner
- [x] Does not return draw if there's a winner
- [x] Does not return draw if board has empty cells
- [x] Function is pure and testable

### Files to Create
- Add to `src/domain/gameLogic.ts` or `src/domain/Game.ts`

### Dependencies
- Issue #1 (Domain Types)
- Issue #2 (Board Model)
- Issue #4 (Win Detection)

---

## Issue #6: Create Game Domain Model

**Type:** Domain  
**Priority:** High  
**Labels:** `domain`, `model`, `game-state`

### Description
Create a Game domain model that encapsulates the board state, current player, and game status. This will be the main interface for managing game state.

### Tasks
- [x] Create `Game` class or type that contains:
  - [x] Board state
  - [x] Current player (whose turn it is)
  - [x] Game state (playing, won, draw)
  - [x] Winner (if game is won)
- [x] Implement `makeMove(position: Position): Game` method
- [x] Implement `getCurrentPlayer(): Player` method
- [x] Implement `getGameState(): GameState` method
- [x] Implement `getWinner(): Player | null` method
- [x] Implement static `createNewGame(): Game` factory method
- [x] Automatically update game state after moves (check win/draw)

### Acceptance Criteria
- [x] Game model is immutable (makeMove returns new instance)
- [x] Game state is automatically updated after each move
- [x] Current player alternates between X and O
- [x] Winner is set when game is won
- [x] All state transitions are correct

### Files to Create
- `src/domain/Game.ts`

### Dependencies
- Issue #1 (Domain Types)
- Issue #2 (Board Model)
- Issue #3 (Move Validation)
- Issue #4 (Win Detection)
- Issue #5 (Draw Detection)

---

## Issue #7: Build UI - Board Component

**Type:** UI  
**Priority:** Medium  
**Labels:** `ui`, `component`, `board`

### Description
Create a React component that renders the 3x3 game board grid. This component will display the current state of the board.

### Tasks
- [ ] Create `Board` component in `src/components/Board.tsx`
- [ ] Accept board state as props (or cells array)
- [ ] Render 3x3 grid of cells
- [ ] Use Material-UI Grid or similar for layout
- [ ] Style the board appropriately (spacing, borders, etc.)

### Acceptance Criteria
- [ ] Board renders correctly with 9 cells
- [ ] Board displays current game state
- [ ] Board is visually clear and well-spaced
- [ ] Component is reusable and accepts props

### Files to Create
- `src/components/Board.tsx`

### Dependencies
- Issue #6 (Game Domain Model)

---

## Issue #8: Build UI - Cell Component

**Type:** UI  
**Priority:** Medium  
**Labels:** `ui`, `component`, `cell`, `interaction`

### Description
Create a React component for individual board cells that handles click events and displays the cell value (X, O, or empty).

### Tasks
- [ ] Create `Cell` component in `src/components/Cell.tsx`
- [ ] Accept cell value ('X', 'O', or 'empty') as prop
- [ ] Accept position as prop
- [ ] Accept onClick handler as prop
- [ ] Accept disabled state (when game is over or cell is occupied)
- [ ] Display X, O, or empty state visually
- [ ] Handle click events and call onClick with position
- [ ] Style with Material-UI Button or similar

### Acceptance Criteria
- [ ] Cell displays correct value (X, O, or empty)
- [ ] Cell is clickable when empty and game is playing
- [ ] Cell is disabled when occupied or game is over
- [ ] Click handler receives correct position
- [ ] Visual feedback on hover/click

### Files to Create
- `src/components/Cell.tsx`

### Dependencies
- Issue #1 (Domain Types)
- Issue #7 (Board Component)

---

## Issue #9: Build UI - GameStatus Component

**Type:** UI  
**Priority:** Medium  
**Labels:** `ui`, `component`, `status`

### Description
Create a component that displays the current game status: whose turn it is, who won, or if it's a draw.

### Tasks
- [ ] Create `GameStatus` component in `src/components/GameStatus.tsx`
- [ ] Accept game state as props (current player, game state, winner)
- [ ] Display "Player X's turn" or "Player O's turn" when playing
- [ ] Display "Player X wins!" or "Player O wins!" when won
- [ ] Display "It's a draw!" when game is drawn
- [ ] Style with Material-UI Typography or similar

### Acceptance Criteria
- [ ] Correctly displays current player's turn
- [ ] Correctly displays winner when game is won
- [ ] Correctly displays draw message
- [ ] Status updates in real-time as game progresses
- [ ] Text is clear and readable

### Files to Create
- `src/components/GameStatus.tsx`

### Dependencies
- Issue #1 (Domain Types)
- Issue #6 (Game Domain Model)

---

## Issue #10: Build UI - Reset Button

**Type:** UI  
**Priority:** Low  
**Labels:** `ui`, `component`, `reset`

### Description
Create a reset button component that allows players to start a new game.

### Tasks
- [ ] Create `ResetButton` component or add to main App
- [ ] Accept onClick handler as prop
- [ ] Display "New Game" or "Reset" text
- [ ] Style with Material-UI Button
- [ ] Position appropriately in the UI

### Acceptance Criteria
- [ ] Button is clearly visible
- [ ] Clicking button resets the game to initial state
- [ ] Button works at any point during the game
- [ ] Button has appropriate styling

### Files to Create
- `src/components/ResetButton.tsx` (optional, can be in App)

### Dependencies
- Issue #6 (Game Domain Model)

---

## Issue #11: Integrate Domain Logic with UI

**Type:** Integration  
**Priority:** High  
**Labels:** `integration`, `ui`, `domain`

### Description
Connect the Game domain model to the React UI components. Manage game state in React and handle user interactions.

### Tasks
- [ ] Update `App.tsx` to use Game domain model
- [ ] Create React state for Game instance
- [ ] Implement handleCellClick function that calls game.makeMove()
- [ ] Implement handleReset function that creates a new game
- [ ] Pass game state to all child components (Board, Cell, GameStatus)
- [ ] Ensure UI updates when game state changes

### Acceptance Criteria
- [ ] Clicking a cell makes a move in the game
- [ ] Game state updates correctly after each move
- [ ] UI reflects current game state (board, status, winner)
- [ ] Reset button creates a new game
- [ ] No moves can be made when game is over
- [ ] Current player alternates correctly

### Files to Modify
- `src/App.tsx`

### Dependencies
- Issue #6 (Game Domain Model)
- Issue #7 (Board Component)
- Issue #8 (Cell Component)
- Issue #9 (GameStatus Component)
- Issue #10 (Reset Button)

---

## Issue #12: Add Styling and Polish

**Type:** UI  
**Priority:** Low  
**Labels:** `ui`, `styling`, `polish`

### Description
Enhance the visual appearance of the game using Material-UI components and custom styling. Make the game visually appealing and user-friendly.

### Tasks
- [ ] Apply Material-UI theme and styling
- [ ] Ensure responsive design (works on mobile and desktop)
- [ ] Add visual feedback for hover states
- [ ] Style X and O markers distinctly
- [ ] Add spacing and padding for better UX
- [ ] Ensure color contrast and accessibility
- [ ] Add animations/transitions if desired
- [ ] Center the game board
- [ ] Add a title/header

### Acceptance Criteria
- [ ] Game looks polished and professional
- [ ] Game is responsive and works on different screen sizes
- [ ] Visual feedback is clear (hover, click, disabled states)
- [ ] Colors and styling are consistent
- [ ] Game is accessible (good contrast, keyboard navigation if needed)

### Files to Modify
- `src/App.tsx`
- `src/App.css`
- Component files as needed

### Dependencies
- Issue #11 (Integration)

---

## Issue Template for GitHub

When creating issues in GitHub, you can use this template:

```markdown
**Type:** [Domain/UI/Integration]
**Priority:** [High/Medium/Low]
**Labels:** [comma-separated labels]

### Description
[Description from issue above]

### Tasks
[Tasks checklist from issue above]

### Acceptance Criteria
[Acceptance criteria from issue above]

### Files to Create/Modify
[Files from issue above]

### Dependencies
[Dependencies from issue above]
```

---

## Project Board Columns

Suggested columns for GitHub Project Board:
1. **Backlog** - All issues
2. **To Do** - Issues ready to be worked on
3. **In Progress** - Issues currently being worked on
4. **Review** - Issues completed, ready for review
5. **Done** - Completed issues

## Labels

Suggested labels:
- `domain` - Domain layer issues
- `ui` - UI layer issues
- `integration` - Integration issues
- `types` - Type definitions
- `model` - Domain models
- `logic` - Business logic
- `component` - React components
- `styling` - CSS/styling
- `foundation` - Foundational work
- `high-priority` - High priority issues
- `medium-priority` - Medium priority issues
- `low-priority` - Low priority issues

