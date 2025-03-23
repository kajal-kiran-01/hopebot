let chatSessions = [];
let currentSessionIndex = -1;

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const newChatBtn = document.getElementById('newChatBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const settingsBtn = document.getElementById('settingsBtn');
const chatHistoryList = document.querySelector('.chat-history');
const emptyPlaceholder = document.getElementById('emptyChatPlaceholder');



const ai = {
    useChat: (options) => {
        const messages = [];
        let input = '';
        const apiKey = '#'; // Replace with your actual API key (or better, use server-side)

        const handleInputChange = (e) => {
            input = e.target.value;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const userMessage = input; // Get the user's message

            // 1. Keyword/Regex Check (Simple Filter):
            const mentalHealthKeywords = [
                "mental health", "mental wellness", "well-being", "emotional health", "psychological health",
                "mindfulness", "self-care", "stress management", "coping mechanisms", "resilience",
                "emotional regulation", "mental health awareness", "mental health support", "mental health resources",
                "mental health conditions", "mental illness", "mental disorder", "psychological distress",
                "emotional difficulties", "mental health challenges", "anxiety", "anxiety disorder",
                "generalized anxiety disorder", "GAD", "panic disorder", "panic attacks", "phobia",
                "social anxiety disorder", "SAD", "post-traumatic stress disorder", "PTSD",
                "obsessive-compulsive disorder", "OCD", "depression", "major depressive disorder", "MDD",
                "bipolar disorder", "bipolar I disorder", "bipolar II disorder", "cyclothymia",
                "schizophrenia", "schizoaffective disorder", "personality disorders", "borderline personality disorder",
                "BPD", "narcissistic personality disorder", "NPD", "eating disorders", "anorexia nervosa",
                "bulimia nervosa", "binge eating disorder", "ADHD", "attention-deficit/hyperactivity disorder",
                "autism spectrum disorder", "ASD", "addiction", "substance abuse", "substance dependence",
                "dual diagnosis", "stress", "burnout", "fatigue", "sleep problems", "insomnia",
                "oversleeping", "changes in appetite", "weight changes", "difficulty concentrating", "memory problems",
                "irritability", "anger", "sadness", "hopelessness", "guilt", "shame", "worthlessness",
                "low self-esteem", "social withdrawal", "isolation", "loneliness", "suicidal thoughts",
                "self-harm", "emotional numbness", "dissociation", "flashbacks", "nightmares", "intrusive thoughts",
                "compulsions", "obsessions", "therapy", "psychotherapy", "counseling", "CBT", "DBT",
                "ACT", "exposure therapy", "family therapy", "group therapy", "medication", "psychiatrist",
                "psychologist", "counselor", "support groups", "mental health professionals", "mental health services",
                "crisis hotline", "crisis intervention", "mental health facilities", "inpatient care",
                "outpatient care", "rehabilitation", "self-compassion", "self-acceptance", "self-love",
                "gratitude", "positive thinking", "mind-body connection", "emotional intelligence",
                "coping skills", "stress reduction techniques", "relaxation techniques", "meditation",
                "yoga", "exercise", "nutrition", "sleep hygiene", "healthy relationships", "social support",
                "community mental health", "I'm feeling", "I'm struggling with", "How can I cope with",
                "How can I improve my mental health", "Where can I find help for", "I think I might have",
                "What are the signs of", "Is it normal to feel", "I'm worried about", "I need someone to talk to",
                "I'm not feeling myself", "anxious", "depressed", "stressed", "overwhelmed", "lost",
                "alone", "scared", "hopeless", "guilty", "ashamed", "worthless", "suicidal",
                "self-harming", "eating disorder", "addiction", "ptsd", "ocd", "bipolar",
                "schizophrenia", "therapy", "counseling", "medication", "help", "support",
                "resources", "crisis", "hotline", "mental health professional", "psychiatrist",
                "psychologist", "therapist", "counselor", "support group","Hello"  // Add more as needed
                // ... (Add more keywords and phrases)
            ];
            const isMentalHealthRelated = mentalHealthKeywords.some(keyword =>
                userMessage.toLowerCase().includes(keyword)
            );

            // 2. Craft the Prompt (Conditional):
            let prompt;
            if (isMentalHealthRelated) {
                const prompt = `You are a friendly and supportive chatbot specializing in mental health in India.  If a question is not related to mental health, respond with "I can only answer questions about mental health."  Remember, you are not a therapist and cannot give medical advice.  If the user mentions suicide or self-harm, say "Please seek immediate help.  Here are some India-specific resources:

                *   Aasra: 022-27546669 (24x7 helpline)
                *   Vandrevala Foundation: 9999666555 (24x7 helpline)
                *   National Suicide Prevention Lifeline: 988 (US-based, but can offer international support)
                *   Your nearest mental health professional or hospital.
                            
                It's important to talk to someone.  You are not alone."
                            
                User: ${userMessage}
                `;
            } else {
                prompt = `I can only answer questions related to mental health.

                User: ${userMessage}
                `; // Or a more polite rejection message
            }

            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "google/gemma-2-9b-it:free",
                        "messages": [
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const aiResponseContent = data.choices[0].message.content;
                return { content: aiResponseContent };

            } catch (error) {
                console.error("Fetch error:", error);
                return { content: 'Error fetching AI response.' };
            }
        };

        return {
            messages,
            input,
            handleInputChange,
            handleSubmit
        };
    }
};


const { useChat } = ai;
const chat = useChat({
    // api: '/api/chat', // Removed api option as it's not used now
});

const { input, handleInputChange, handleSubmit } = chat;


function loadChatHistoryFromLocalStorage() {
    console.log('Loading chat history from local storage...');
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
        chatSessions = JSON.parse(storedHistory);
    } else {
        chatSessions = [];
    }
    console.log('Chat history loaded:', chatSessions);
}

function saveChatHistoryToLocalStorage() {
    console.log('Saving chat history to local storage:', chatSessions);
    localStorage.setItem('chatHistory', JSON.stringify(chatSessions));
}

function renderChatHistory() {
    chatHistoryList.innerHTML = '';
    if (chatSessions.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'No chats yet.';
        emptyMessage.classList.add('empty-history-message');
        chatHistoryList.appendChild(emptyMessage);
        return;
    }

    chatSessions.forEach((session, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('chat-history-item');
        if (index === currentSessionIndex) {
            listItem.classList.add('active');
        }

        const titleSpan = document.createElement('span');
        titleSpan.textContent = session.title || `Chat ${index + 1}`;
        titleSpan.addEventListener('click', () => {
            loadChatSession(index);
        });
        listItem.appendChild(titleSpan);

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add('edit-chat-btn');
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            enableChatRename(index, listItem, titleSpan);
        });
        listItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-times"></i>';
        deleteButton.classList.add('delete-chat-btn');
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteChatSession(index);
        });
        listItem.appendChild(deleteButton);

        chatHistoryList.appendChild(listItem);
    });
}

function enableChatRename(index, listItem, titleSpan) {
    console.log('Enable rename for chat session at index:', index);

    const renameInput = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = titleSpan.textContent;
    renameInput.classList.add('chat-rename-input');

    listItem.replaceChild(renameInput, titleSpan);
    renameInput.focus();

    const saveRename = () => {
        const newTitle = renameInput.value.trim();
        if (newTitle && newTitle !== chatSessions[index].title) {
            chatSessions[index].title = newTitle;
            saveChatHistoryToLocalStorage();
            renderChatHistory();
            loadChatSession(index);
        } else {
            renderChatHistory();
            loadChatSession(index);
        }
    };

    renameInput.addEventListener('blur', saveRename);
    renameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveRename();
        } else if (event.key === 'Escape') {
            renderChatHistory();
            loadChatSession(index);
        }
    });
}


function deleteChatSession(index) {
    console.log('Deleting chat session at index:', index);
    chatSessions.splice(index, 1);
    saveChatHistoryToLocalStorage();
    renderChatHistory();
    if (currentSessionIndex === index) {
        chatMessages.innerHTML = '';
        currentSessionIndex = -1;
        if (chatSessions.length > 0) {
            loadChatSession(0);
        } else {
            chatMessages.innerHTML = '';
            emptyPlaceholder.style.display = 'flex';
            const chatHeaderTitle = document.querySelector('.chat-header h2');
            if (chatHeaderTitle) {
                chatHeaderTitle.textContent = 'New Chat';
            }
        }
    } else if (currentSessionIndex > index) {
        currentSessionIndex--;
    }
}


function clearChatHistory() {
    console.log('Clearing chat history');
    const confirmClear = confirm("Are you sure you want to clear all chat history? This action cannot be undone.");
    if (confirmClear) {
        console.log('User confirmed chat history clear');
        chatSessions = [];
        saveChatHistoryToLocalStorage();
        renderChatHistory();
        chatMessages.innerHTML = '';
        currentSessionIndex = -1;
        emptyPlaceholder.style.display = 'flex';
        const chatHeaderTitle = document.querySelector('.chat-header h2');
        if (chatHeaderTitle) {
            chatHeaderTitle.textContent = 'New Chat';
        }
    } else {
        console.log('User cancelled chat history clear');
    }
}

function addChatHistoryItem(title) {
    const newSession = {
        title: title,
        messages: []
    };
    chatSessions.push(newSession);
    saveChatHistoryToLocalStorage();
    renderChatHistory();
    loadChatSession(chatSessions.length - 1);
}


function loadChatSession(index) {
    console.log('Loading chat session at index:', index);
    if (chatSessions[index]) {
        currentSessionIndex = index;
        renderChatHistory();
        chatMessages.innerHTML = '';
        const session = chatSessions[index];
        console.log('Session data:', session);


        if (session.messages.length === 0) {
            emptyPlaceholder.style.display = 'flex';
        } else {
            emptyPlaceholder.style.display = 'none';
            session.messages.forEach(msg => {
                addMessageGroup(msg.content, msg.isUser);
            });
        }

        const chatHeaderTitle = document.querySelector('.chat-header h2');
        if (chatHeaderTitle) {
            chatHeaderTitle.textContent = session.title || 'Current Chat';
        }
        saveChatHistoryToLocalStorage();
    } else {
        console.log('Session not found at index:', index);
    }
}


const clearHistoryBtn = document.getElementById('clearHistoryBtn');
clearHistoryBtn.addEventListener('click', clearChatHistory);

function addMessageGroup(content, isUser = false) {
    const messageGroup = document.createElement('div');
    messageGroup.classList.add('message-group');

    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(isUser ? 'user-message' : 'ai-message');

    let formattedContent = content;

    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    formattedContent = formattedContent.replace(/\n/g, '<br>');


    message.innerHTML = formattedContent;

    messageGroup.appendChild(message);
    chatMessages.appendChild(messageGroup);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    emptyPlaceholder.style.display = 'none';
}

function addTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingIndicator;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessageGroup(userMessage, true);
        userInput.value = '';

        const typingIndicator = addTypingIndicator();

        try {
            const response = await handleSubmit(e);
            typingIndicator.remove();
            addMessageGroup(response.content);

            if (currentSessionIndex !== -1) {
                chatSessions[currentSessionIndex].messages.push({ content: userMessage, isUser: true });
                chatSessions[currentSessionIndex].messages.push({ content: response.content, isUser: false });
                saveChatHistoryToLocalStorage();
            } else {
                console.warn('No active chat session to save message to.');
            }


        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            addMessageGroup('Sorry, there was an error processing your request.');
        }
    }
});

userInput.addEventListener('input', handleInputChange);

newChatBtn.addEventListener('click', () => {
    const newSessionTitle = prompt("Enter a title for this new chat:");
    if (newSessionTitle) {
        addChatHistoryItem(newSessionTitle);
        const chatHeaderTitle = document.querySelector('.chat-header h2');
        if (chatHeaderTitle) {
            chatHeaderTitle.textContent = newSessionTitle || 'Current Chat';
        }
    }
});


darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

settingsBtn.addEventListener('click', () => {
    console.log('Settings clicked');
});


loadChatHistoryFromLocalStorage();
renderChatHistory();

if (chatSessions.length > 0 && currentSessionIndex === -1) {
    loadChatSession(0);
} else if (chatSessions.length === 0) {
    emptyPlaceholder.style.display = 'flex';
    // updateChatHeaderTitle('New Chat'); // Removed as updateChatHeaderTitle function is not defined
}
