# Beau - AI Relationship Coach App

A beautiful, intelligent relationship coaching app built with React Native and OpenAI GPT-3.5-turbo.

## 🌟 Features

- **AI-Powered Chat**: Intelligent relationship advice from Beau, your personal relationship coach
- **Beautiful UI**: Modern, Telegram-inspired chat interface with customizable backgrounds
- **Real-time Responses**: Fast, contextual AI responses for relationship guidance
- **Cross-platform**: Works on both iOS and Android

## 🚀 Getting Started

### Prerequisites

- Node.js (>=18)
- React Native development environment
- OpenAI API key

### Step 1: Clone and Install

```sh
git clone <your-repo-url>
cd BeauApp
npm install
```

### Step 2: Set Up OpenAI API

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env` file in the root directory:

```sh
# Copy the example file
cp env.example .env

# Edit .env and add your API key
OPENAI_API_KEY=your-actual-api-key-here
```

### Step 3: Start Metro

```sh
npm start
```

### Step 4: Run the App

#### iOS
```sh
npm run ios
```

#### Android
```sh
npm run android
```

## 🤖 AI Integration

The app uses OpenAI's GPT-3.5-turbo model with a custom personality prompt designed for relationship coaching. Beau is:

- **Warm and empathetic** - Like talking to a wise friend
- **Practical and actionable** - Provides specific advice
- **Non-judgmental** - Creates a safe space for sharing
- **Professional** - Maintains appropriate boundaries

## 🎨 UI Features

- **Customizable backgrounds** - Choose from various gradient themes
- **Smooth animations** - Typing indicators and message transitions
- **Responsive design** - Works on all screen sizes
- **Modern chat interface** - Inspired by Telegram and Slack

## 📱 Usage

1. **Start a conversation** - Beau will greet you with a warm welcome
2. **Share your thoughts** - Ask questions about relationships, dating, or personal growth
3. **Get personalized advice** - Receive thoughtful, contextual responses
4. **Continue the conversation** - Beau remembers your chat history for better context

## 🔧 Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Main app screens
│   └── ChatScreen.tsx  # Main chat interface
├── services/           # Business logic
│   └── aiService.ts    # OpenAI integration
└── types/              # TypeScript type definitions
```

### Key Files

- `src/screens/ChatScreen.tsx` - Main chat interface
- `src/services/aiService.ts` - AI integration logic
- `babel.config.js` - Environment variables configuration

### Available Scripts

```sh
npm start              # Start Metro bundler
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run monitor-errors # Monitor for errors
npm run auto-monitor   # Enhanced error monitoring
```

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your `.env` file has the correct OpenAI API key
2. **Metro Issues**: Try `npm start --reset-cache`
3. **iOS Build Issues**: Run `cd ios && pod install` then `npm run ios`

### Error Monitoring

The app includes automatic error detection. If you encounter issues:

```sh
npm run auto-monitor
```

This will automatically detect and categorize errors in real-time.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using React Native and OpenAI**
