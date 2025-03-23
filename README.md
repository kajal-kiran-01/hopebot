# HopeBot

HopeBot is a mental health chatbot designed to provide support and guidance for individuals seeking emotional well-being and self-care strategies. It is not a substitute for professional help but aims to offer supportive conversations, mindfulness tips, and resource recommendations.

## Features
- **Conversational AI**: Engages users in meaningful conversations about mental health.
- **Chat History**: Stores chat history for reference and continued discussions.
- **Dark Mode**: User-friendly interface with dark mode support.
- **Session Management**: Create new chat sessions and manage chat history.
- **Support for Mental Health Topics**: Provides information on anxiety, depression, coping strategies, and mindfulness.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend API**: OpenRouter AI Chat API
- **Libraries & Frameworks**:
  - Font Awesome for icons
  - Google Fonts for typography
  - Local Storage for chat history persistence

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/kajal-kiram-01/HopeBot.git
   ```
2. Navigate to the project folder:
   ```sh
   cd HopeBot
   ```
3. Open `index.html` in a browser.

## Usage
- Start a new conversation by clicking the **New Chat** button.
- Type a message in the input box and press **Send**.
- Toggle **Dark Mode** using the moon icon in the sidebar.
- Manage chat sessions via the **Chat History** section.

## API Integration
HopeBot uses OpenRouter AI for generating responses. The chatbot filters user input to ensure it only responds to mental health-related queries. If a topic falls outside this scope, it informs the user accordingly.

### API Request Example
```javascript
fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": `Bearer YOUR_API_KEY`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "model": "google/gemma-2-9b-it:free",
        "messages": [
            { "role": "user", "content": userMessage }
        ]
    })
});
```

## Important Notes
- **HopeBot does not provide medical advice**. It is a supportive tool, not a professional service.
- **Users experiencing a crisis should seek immediate help** from mental health professionals or helplines.
- **API Key Security**: The API key should be stored securely and not exposed in client-side code.

## Future Enhancements
- **User Authentication**: Secure login system to personalize experiences.
- **Multilingual Support**: Expanding accessibility for non-English speakers.
- **Voice Interaction**: Adding speech-to-text and text-to-speech capabilities.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For questions or suggestions, reach out via [your contact email] or open an issue in the repository.

