// Get chatbot elements
const conversation = document.getElementById("conversation");
const inputForm = document.getElementById("input-form");
const inputField = document.getElementById("input-field");

// OpenWeatherMap API key and URL
const weatherApiKey = 'd02819579c3ef9e8fafade1b77226038';  // Replace with your actual API key
const weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather';

// Add event listener to input form
inputForm.addEventListener("submit", function (event) {
    // Prevent form submission
    event.preventDefault();

    // Get user input
    const input = inputField.value.trim().toLowerCase();

    // Clear input field
    inputField.value = '';
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user input to conversation
    addUserMessage(input, currentTime);

    // Generate chatbot response
    generateResponse(input).then(response => {
        // Add chatbot response to conversation
        addChatbotMessage(response, currentTime);
    }).catch(error => {
        // Add error message to conversation
        addChatbotMessage("Sorry, I couldn't fetch the response right now. Please try again later.", currentTime);
        console.error(error);  // Log error for debugging
    });
});

// Function to add user message to the conversation
function addUserMessage(message, time) {
    const userMessage = document.createElement("div");
    userMessage.classList.add("chatbot-message", "user-message");
    userMessage.innerHTML = `<p class="user-text" sentTime="${time}">${message}</p>`;
    conversation.appendChild(userMessage);
    userMessage.scrollIntoView({ behavior: "smooth" });
}

// Function to add chatbot message to the conversation
function addChatbotMessage(message, time) {
    const botMessage = document.createElement("div");
    botMessage.classList.add("chatbot-message", "chatbot");
    botMessage.innerHTML = `<p class="chatbot-text" sentTime="${time}">${message}</p>`;
    conversation.appendChild(botMessage);
    botMessage.scrollIntoView({ behavior: "smooth" });
}

// Generate chatbot response function
async function generateResponse(input) {
    const responses = {
        "hello": "Hello! How can I assist you today? 😊",
        "hi": "Hi there! How can I help you today? 😊",
        "how are you": "I'm just a bot, but I'm here to help you! How can I assist you today? 🤖",
        "your name": "I'm Chatbot, your virtual assistant! 🤖",
        "what can you do": "I can help you with various questions and provide information on many topics. What would you like to know? 📚",
        "help": "Sure, I'm here to help! Please ask your question or let me know what you need assistance with. 😊",
        "time": `The current time is ${new Date().toLocaleTimeString()}. ⏰`,
        "news": "For the latest news, please visit a news website or app. 📰",
        "joke": "Why did the scarecrow win an award? Because he was outstanding in his field! 😂",
        "quote": "Here's a quote for you: 'The only way to do great work is to love what you do.' - Steve Jobs",
        "age": "I'm ageless, but I've been created to assist you at any time! 👶👴",
        "creator": "I was created by a team of developers to assist you with your queries. 👨‍💻👩‍💻",
        "purpose": "My purpose is to assist you with information and answer your questions to the best of my ability. 📚",
        "day": `Today is ${new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`,
        "hobby": "I don't have hobbies, but I enjoy helping you! What are your hobbies? 😊",
        "default": "I'm sorry, I didn't understand that. Can you please rephrase or ask something else?"
    };

    // Check for weather keyword in the input and fetch weather data if found
    if (input.includes("weather")) {
        return getWeatherResponse(input);
    }

    // Check for other keywords in the input and return the appropriate response
    for (const key in responses) {
        if (input.includes(key)) {
            return responses[key];
        }
    }

    // If no keyword matches, return the default response
    return responses["default"];
}

// Function to get weather response using city name and country code
// Function to get weather response using city name
async function getWeatherResponse(input) {
    const cityMatch = input.match(/weather in ([a-zA-Z\s]+)/);
    if (cityMatch) {
        const city = cityMatch[1].trim();

        try {
            // Get weather data using city name
            const weatherResponse = await fetch(`${weatherApiUrl}?q=${city}&APPID=${weatherApiKey}&units=metric`);
            if (weatherResponse.ok) {
                const weatherData = await weatherResponse.json();
                return `The weather in ${weatherData.name} is ${weatherData.weather[0].description} with a temperature of ${weatherData.main.temp}°C. 🌡️`;
            } else {
                const errorData = await weatherResponse.json();
                return `Error fetching weather data: ${errorData.message}`;
            }
        } catch (error) {
            return "Sorry, I couldn't fetch the weather details right now. Please try again later.";
        }
    } else {
        return "Please specify the city in the format 'weather in [city]'.";
    }
}

