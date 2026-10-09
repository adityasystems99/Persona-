# AlgoPulse — DSA Prep Tracker & Personal Coding Command Center

A high-performance, aesthetically crafted personal dashboard designed for software engineers preparing for Data Structures & Algorithms interviews and building C++ Standard Template Library (STL) fluency.

---

## 🌟 Key Features

### 1. Daily Preparation Workflow & Adaptive Targets
- **Target Distribution**: Default daily target of up to 5 questions (**2 Easy**, **2 Medium**, **1 Hard**) or customized target counts.
- **Problem Metadata**: Name, Topic, Subtopic, Platform (LeetCode, Codeforces, GeeksforGeeks, CodeStudio, HackerRank, Other), URL, Completion status, Time spent, Approach intuition, Time/Space complexity, Attempts, and Solo vs Hints distinction.
- **Problem Solving Lifecycle**:
  - `Not Started`
  - `In Progress`
  - `Solved Independently` (Solo)
  - `Solved with Hints`
  - `Needs Revision`
- **Reordering & Bulk Operations**: Move questions up/down in today's prioritized queue, edit inline, or paste a list of questions to batch import.

### 2. Mandatory 30-Minute Daily STL Practice
- **Exclusive 30-Minute Countdown Timer**: Prominent circular SVG progress ring with Start, Pause, Resume, Reset, and +5 min booster.
- **Independent Tracking**: Tracked separately from DSA problem solving time.
- **Curriculum Checklist**: 11 core STL topics covering:
  - `std::vector` & Dynamic Memory
  - `std::string` & String Manipulation
  - `std::pair` & `std::tuple`
  - Iterators & Traversal Primitives
  - `std::sort` & Custom Comparators (Strict Weak Ordering)
  - `std::lower_bound` & `std::upper_bound`
  - `std::set` & `std::unordered_set`
  - `std::map` & `std::unordered_map`
  - `std::stack`, `std::queue` & `std::deque`
  - `std::priority_queue` (Min & Max Heaps)
  - Essential Algorithms (`accumulate`, `next_permutation`, `__builtin_popcount`)
- **Code & Notes Scratchpad**: In-app syntax notes, code examples, and live practice scratchpad with auto-save.
- **Safe Refresh & Persistence**: Time elapsed calculates across page reloads and browser tab minimizes without dropping progress.
- **Audio Fanfare & Confetti**: Web Audio API synthesized fanfare and confetti upon session completion.

### 3. Spaced Revision & Mistake Notebook
- **Flags Questions Needing Work**: Filters problems solved with hints or flagged for revision.
- **Mistake & Intuition Journal**: Dedicated sections to log:
  - *"What Tripped Me Up? / Mistakes Made"*
  - *"Core Intuition & Pattern Learned"*
- **Target Revision Scheduling**: Schedule revision dates and log fresh attempts (marks resolved when solved independently).

### 4. Hourly Accountability & Notification Engine
- **Study Window Filters**: Reminders only trigger within your configured study window (e.g. `09:00` to `23:30`) to protect rest.
- **Hourly Progress Check-in**: Proactively notifies you of remaining problems and daily momentum.
- **STL Pending Alerts**: Reminds you if your mandatory 30-minute STL block is pending.
- **Dual Notification Tier**: Browser Desktop notifications when permission is granted, with fallback in-app dropdown toasts.
- **End-of-Session Debrief**: Instant summary dialog showing completed questions, pending list, STL status, and total focused minutes.

### 5. Analytics & Visual Design
- **Visual Aesthetic**:
  - Warm canvas background (`#f8fafc`).
  - Deep dark vertical sidebar (`#0f172a`) with collapsible toggle.
  - Coral-to-pink gradient accents on key metric cards.
  - Generous card padding, rounded corners (16–24px), subtle shadows.
  - Plus Jakarta Sans typography.
- **Real-Time Data Visualizations (Recharts)**:
  - 7, 14, and 30-day velocity charts.
  - Easy/Medium/Hard distribution donut chart.
  - Independent vs Hint mastery ratio.
  - 7-day STL consistency streak indicators.
  - Focus time trends (DSA vs STL breakdown).
- **Motivational Quote Panel**: Practical engineering mindset quotes with daily rotation and manual refresh.

### 6. Data Integrity & Portability
- **Storage**: Full persistent state in `localStorage`.
- **Export / Import**:
  - Full JSON backup export.
  - CSV export for all DSA problems.
  - JSON backup import for easy migration.
  - Sample data reset or full wipe controls.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# Clone or navigate to the directory
cd personal

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

Visit **`http://localhost:5173/`** in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Known Limitations & Transparency
- **Browser Background Execution**: In compliance with standard web browser sandbox policies, background reminders and timers execute while the tab or browser window is open. Background notifications cannot trigger when the entire browser is completely terminated without an operating system native daemon. Keep the tab open or pinned during study hours for alerts.
