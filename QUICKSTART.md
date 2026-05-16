# NexusIDE - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Installation

```bash
# Navigate to project directory
cd nexus-ide

# Install dependencies
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Explore the App

- **Landing Page** (`/`) - See product overview
- **IDE Page** (`/ide`) - Try the full IDE experience

## 🎯 Key Features to Try

### 1. Code Analysis
- Open the IDE page
- See the intentional bugs in the code
- Check the AI Analysis Panel on the right
- View detected issues with severity levels

### 2. Auto-Heal
- Click the "Auto Heal" button
- Watch the healing animation
- See the code automatically fixed
- Check the console for logs

### 3. Sidebar Navigation
- **Explorer** - Browse project files
- **Search** - Find files and content
- **Git** - View changes
- **AI Scanner** - Quick issue summary
- **Settings** - Customize preferences

### 4. Console
- View real-time logs
- See analysis results
- Check for errors and warnings
- Clear console with button

## 📁 Project Structure

```
nexus-ide/
├── app/
│   ├── page.tsx          # Landing page
│   ├── ide/page.tsx      # IDE page
│   └── globals.css       # Global styles
├── components/
│   ├── CodeEditor.tsx    # Monaco editor
│   ├── AIAnalysisPanel.tsx
│   ├── Sidebar.tsx
│   └── Console.tsx
└── package.json
```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  "neon-blue": "#00d9ff",
  "neon-purple": "#b026ff",
  // ... more colors
}
```

### Modify Code Sample

Edit `app/ide/page.tsx` - change the `useState` initial value:

```typescript
const [code, setCode] = useState(`// Your code here`)
```

### Add New Issues

Edit `components/AIAnalysisPanel.tsx` - add to the `detectedIssues` array:

```typescript
{
  id: '5',
  type: 'bug',
  severity: 'high',
  title: 'Your Issue',
  description: 'Description',
  line: 10,
  suggestion: 'How to fix it',
  icon: <AlertCircle className="w-5 h-5" />,
}
```

## 🔧 Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 📚 Documentation

- [README.md](./README.md) - Full project overview
- [FEATURES.md](./FEATURES.md) - Detailed features
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- [CLAUDE.md](./CLAUDE.md) - AI integration
- [AGENTS.md](./AGENTS.md) - Agent architecture

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Check TypeScript
npx tsc --noEmit

# Check for linting issues
npm run lint
```

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Monaco Editor](https://microsoft.github.io/monaco-editor)

## 🚀 Next Steps

1. **Explore the Code** - Read through components
2. **Customize** - Modify colors, text, and features
3. **Add Features** - Implement new functionality
4. **Deploy** - Push to production
5. **Integrate AI** - Connect Claude API

## 📞 Need Help?

- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed guides
- Review component code for examples
- Check browser console for errors
- Read documentation files

## 🎉 You're Ready!

Start building amazing features with NexusIDE!

---

**Happy coding! 🚀**
