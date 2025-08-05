# BJJ Techniques App

A modern React application for learning Brazilian Jiu-Jitsu techniques. This app provides detailed information about 20 fundamental BJJ techniques, including their origins, descriptions, and best defensive responses.

## Features

- **Technique Library**: Browse 20 essential BJJ techniques organized by category
- **Detailed Information**: Each technique includes:
  - Origin and history
  - Detailed description
  - Best defensive responses
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Easy Navigation**: Intuitive routing between technique list and detail pages

## Techniques Included

### Submissions
- Armbar (Juji Gatame)
- Triangle Choke (Sankaku Jime)
- Rear Naked Choke (Hadaka Jime)
- Kimura Lock (Gyaku Ude Garami)
- Guillotine Choke
- Omoplata (Ashi Sankaku Garami)
- Heel Hook

### Guard Positions
- De La Riva Guard
- Berimbolo
- Butterfly Guard
- Half Guard
- Closed Guard

### Dominant Positions
- Mount Position
- Side Control
- Back Control

### Takedowns
- Guard Pull
- Double Leg Takedown
- Single Leg Takedown

### Sweeps
- Scissor Sweep
- Hip Bump Sweep

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BJJBot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **CSS3** - Modern styling with gradients and animations

## Project Structure

```
src/
├── components/
│   ├── TechniqueList.tsx    # Main technique list page
│   └── TechniqueDetail.tsx  # Individual technique detail page
├── data/
│   └── techniques.ts        # Technique data and types
├── App.tsx                  # Main app component with routing
├── index.tsx               # App entry point
└── index.css               # Global styles
```

## Contributing

Feel free to contribute to this project by:
- Adding more techniques
- Improving the UI/UX
- Adding new features like technique filtering or search
- Fixing bugs or improving performance

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Brazilian Jiu-Jitsu community for technique knowledge
- Gracie family for developing and popularizing BJJ
- Modern web development community for tools and best practices 