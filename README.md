# Touch Typing Trainer

A full-featured touch-typing training web application built with React and TailwindCSS.

## Features

### Core Modes
- **Learning Mode**: Practice-focused typing with real-time per-character feedback. Backspace is allowed to correct mistakes. No time pressure.
- **Test Mode**: Timed 60-second typing tests that measure WPM, accuracy, and error count. Results are displayed at the end with a comprehensive summary.

### Difficulty Levels
- Beginner, Easy, Intermediate, Advanced, and Expert levels
- Content loaded from `difficulty_level.csv`
- Adaptive recommendations based on recent performance (90%+ accuracy suggests moving up)

### Progress Tracking & Analytics
- Offline-first: All data saved to LocalStorage
- Session history: timestamp, mode, difficulty, WPM, accuracy, characters, errors
- Analytics dashboard with:
  - WPM trend over time (line chart)
  - Accuracy trend over time (line chart)
  - Most mistyped keys (bar chart)
  - Recent sessions table
- Export/Import progress as JSON

### 2D Animated Hands & Keyboard Visualization
- Interactive animated keyboard showing all keys with proper layout
- Animated hands with individual finger movements
- Color-coded finger zones (each finger has a distinct color)
- Real-time finger animation when typing keys
- Highlights next key to press with corresponding finger
- Home row keys marked with indicators
- Toggle visibility: Keyboard, Hands, and Finger Colors buttons
- Helps build proper muscle memory through visual feedback

### UI/UX
- Responsive, minimal, keyboard-first design
- Light/Dark mode toggle
- Real-time stats display during typing
- Progress bar indicator
- Accessible (focus states, ARIA labels)

## Setup & Run

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Navigate to project directory
cd touch

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## CSV File Format

The `difficulty_level.csv` file must be in the `public/` folder with the following schema:

| Column | Type | Description |
|--------|------|-------------|
| `text` | string | The typing prompt text |
| `file` | string | Source file reference (optional) |
| `score` | number | Text complexity score |
| `unique_char_score` | number | Unique character count |
| `difficulty_index` | number | Numeric difficulty value |
| `difficulty_level` | string | One of: Beginner, Easy, Intermediate, Advanced, Expert |
| `exercise_id` | number | Exercise ID within difficulty level |

### Example CSV

```csv
text,file,difficulty_level,exercise_id
"jjj jjj jjj kkk kkk kkk",home_row.json,Beginner,1
"fff ddd sss aaa",home_row.json,Beginner,2
"the quick brown fox",common_words.json,Intermediate,1
```

## Project Structure

```
touch/
├── public/
│   ├── difficulty_level.csv    # Typing exercises data
│   └── keyboard.svg            # Favicon
├── src/
│   ├── components/
│   │   ├── Analytics.jsx              # Analytics dashboard with charts
│   │   ├── DifficultySelector.jsx
│   │   ├── Header.jsx
│   │   ├── KeyboardVisualization2D.jsx # 2D animated keyboard & hands
│   │   ├── LearningMode.jsx           # Learning mode screen
│   │   ├── ModeSelector.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Results.jsx                # End-of-session results
│   │   ├── Settings.jsx               # Data export/import
│   │   ├── Stats.jsx                  # Live stats display
│   │   ├── TestMode.jsx               # Test mode screen
│   │   ├── ThemeToggle.jsx
│   │   ├── Timer.jsx                  # Countdown timer
│   │   └── TypingArea.jsx             # Main typing component
│   ├── context/
│   │   └── AppContext.jsx      # Global state management
│   ├── hooks/
│   │   ├── useKeyboardInput.js # Keyboard event handling
│   │   ├── useTimer.js         # Timer functionality
│   │   └── useTypingSession.js # Typing session logic
│   ├── utils/
│   │   ├── csvLoader.js        # PapaParse CSV loading
│   │   ├── statsCalculator.js  # WPM, accuracy calculations
│   │   └── storage.js          # LocalStorage utilities
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Tailwind CSS + custom styles
│   └── main.jsx                # App entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## Key Technologies

- **React 18** - UI framework with hooks
- **TailwindCSS** - Utility-first styling
- **Vite** - Fast build tool
- **SVG + CSS Animations** - 2D keyboard/hands visualization
- **PapaParse** - CSV parsing
- **Chart.js + react-chartjs-2** - Analytics charts
- **LocalStorage** - Offline data persistence

## Performance Optimizations

- `React.memo()` on character components to prevent heavy re-renders
- Memoized character status calculations
- Efficient key-by-key typing state management
- Debounced stat updates
- CSS transitions for smooth animations without heavy rendering

## 2D Visualization Features

The animated keyboard and hands visualization provides:

1. **Accurate Keyboard Layout** - Full QWERTY keyboard with proper key sizes and positions
2. **Animated Hands** - Left and right hands with 5 fingers each, showing realistic movement
3. **Touch-Typing Finger Mapping** - Each key color-coded to the correct finger:
   - Pink: Pinky fingers
   - Orange: Ring fingers
   - Yellow: Middle fingers
   - Green: Index fingers
   - Purple: Thumbs
4. **Visual Feedback**:
   - Highlighted key shows which key to press next
   - Corresponding finger glows to show which one to use
   - Blue press animation when typing
   - Finger extends toward the key being pressed
5. **Home Row Indicators** - Dots mark the home row keys (ASDF JKL;)
6. **Toggle Controls**:
   - "Keyboard" - Show/hide the keyboard visualization
   - "Hands" - Show/hide the animated hands
   - "Colors" - Show/hide finger color zones on keys

## Accessibility

- Keyboard navigation throughout
- ARIA labels on interactive elements
- Focus indicators
- Screen reader friendly stats announcements
- High contrast dark mode

## License

MIT
