# 🧩 Sudoo

Sudoo is a modern, responsive, and fully-featured Sudoku web application built with **Next.js 16**, **React 19**, and **Tailwind CSS**. Designed with a beautiful and aesthetic UI, it brings a classic puzzle experience right to your browser with both Dark and Light modes.

## ✨ Features

- 🎮 **Classic Sudoku Gameplay:** Play standard 9x9 Sudoku puzzles or explore different grid sizes.
- 🎚️ **Multiple Difficulties:** Choose your challenge level, making it perfect for both beginners and experts.
- 🌓 **Theming:** Seamless Dark and Light mode support for comfortable playing anytime.
- ⌨️ **Keyboard Support:** Full keyboard navigation (`Arrow keys` for movement, `1-9` for input, space to toggle notes).
- 📝 **Note Mode:** Easily pencil down possible numbers just like on paper.
- 💡 **Hints System:** Stuck? Use a hint to get back on track.
- ⏸️ **Pause Game:** Need a break? Pause the timer and hide the grid.
- 🎉 **Win/Loss States:** Immediate feedback and beautiful modal animations upon game completion.
- 📱 **Mobile Responsive:** Play comfortably on any device shape and size.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router format)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for solid type-safety

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed along with your favorite package manager (`npm`, `yarn`, `pnpm`, or `bun`).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YassineElkefi/sudoo.git
   cd sudoo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm run dev
   ```

4. **Play the game!**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

Below is a brief overview of the `src` directory to help you navigate:

```text
src/
├── app/          # Next.js App Router (pages and layouts)
├── components/   # Reusable UI components (Grid, Numpad, Modals, Header)
├── hooks/        # Custom React hooks containing all the game logic (useGameState, useKeyboard, etc.)
├── types/        # TypeScript interfaces and type definitions
└── utils/        # Utility functions (Sudoku generation, solvers, specific helpers)
```

## 🤝 Contributing

Contributions are always welcome! If you have any ideas, bug fixes, or improvements, feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Author

This project is created by [Yassine Elkefi](https://github.com/YassineElkefi).

---
*Happy puzzle solving!* 🧩
