// src/components/predefinedQA.js
// This file contains all predefined questions and answers

export const predefinedQA = [
    // About Glimpse AI
    {
        id: 1,
        category: "About",
        question: "What is Glimpse AI?",
        answer: "Glimpse AI is an innovative sports commentary platform that uses artificial intelligence to provide insightful commentary, analysis, and predictions for sports matches. We help fans engage more deeply with their favorite sports through AI-powered insights!"
    },
    {
        id: 2,
        category: "About",
        question: "What makes Glimpse unique?",
        answer: "Glimpse combines AI-powered commentary with fan interaction and analytics. You get intelligent insights, match analysis, predictions, and can engage with other fans - all in one platform!"
    },

    // Live Match Features
    {
        id: 3,
        category: "Features",
        question: "How does the commentary work?",
        answer: "Navigate to the 'Live Commentary' section, select a match, and our AI will analyze the game and provide insightful commentary, tactical analysis, and predictions based on team performance and historical data!"
    },
    {
        id: 4,
        category: "Features",
        question: "Do you show live match scores?",
        answer: "Glimpse AI provides AI-generated commentary and analysis for matches. For actual live scores and match data, we recommend checking official sports websites or apps like ESPN, Cricbuzz, or your sport's official platform."
    },
    {
        id: 5,
        category: "Features",
        question: "Which sports are available?",
        answer: "We support Cricket, Football, Basketball, Tennis, Hockey, Baseball, and more! Our AI can provide commentary and analysis for any major sporting event worldwide."
    },
    {
        id: 6,
        category: "Features",
        question: "How does AI commentary help me?",
        answer: "Our AI analyzes team strategies, player performance patterns, historical data, and current form to provide insights you might miss. It's like having an expert analyst explaining the game in real-time!"
    },

    // Features & Analytics
    {
        id: 7,
        category: "Analytics",
        question: "What kind of analysis do you provide?",
        answer: "We provide tactical analysis, performance insights, win probability predictions, team comparisons, player form analysis, and strategic breakdowns - all powered by AI to enhance your viewing experience!"
    },
    {
        id: 8,
        category: "Features",
        question: "Can I interact with other fans?",
        answer: "Absolutely! Our platform includes a fan interaction feature where you can chat with fellow fans, share predictions, discuss match strategies, and react to key moments together!"
    },
    {
        id: 9,
        category: "Analytics",
        question: "Does it provide match predictions?",
        answer: "Yes! Our AI analyzes historical data, current form, player statistics, and various factors to provide match predictions, win probabilities, and likely outcomes based on data-driven insights!"
    },
    {
        id: 10,
        category: "Features",
        question: "What is AI-powered commentary?",
        answer: "AI-powered commentary means our system analyzes match situations and generates expert-level insights, tactical explanations, and predictions automatically - like having a professional commentator who never misses a detail!"
    },

    // Account & Usage
    {
        id: 11,
        category: "Account",
        question: "How do I create an account?",
        answer: "Click on 'Create Account' or 'Sign Up', fill in your email, create a password, select your favorite sports, and you're ready to go! Registration takes less than a minute."
    },
    {
        id: 12,
        category: "Account",
        question: "Is Glimpse AI free?",
        answer: "We offer both free and premium plans! Free users get access to AI commentary and basic analysis. Premium members enjoy ad-free experience, advanced analytics, priority support, and exclusive features!"
    },
    {
        id: 13,
        category: "Account",
        question: "Can I customize my experience?",
        answer: "Yes! You can set favorite teams, choose preferred sports, customize notification settings, select commentary style, and personalize your dashboard to match your preferences!"
    },

    // Technical & Support
    {
        id: 14,
        category: "Technical",
        question: "Do I need to download an app?",
        answer: "No download required! Glimpse AI works seamlessly in your web browser on any device - desktop, laptop, tablet, or mobile phone. Just visit our website and start exploring!"
    },
    {
        id: 15,
        category: "Technical",
        question: "What devices are supported?",
        answer: "Glimpse works on all modern devices: Windows, Mac, Linux computers, iOS and Android mobile devices, and tablets. We support Chrome, Firefox, Safari, and Edge browsers!"
    },
    {
        id: 16,
        category: "Technical",
        question: "How do I get notifications?",
        answer: "Go to your Profile settings and enable notifications for your favorite teams or sports. You'll receive alerts for match commentary availability, predictions, and analysis updates!"
    },

    // Getting Started & Information
    {
        id: 17,
        category: "Getting Started",
        question: "How do I get started?",
        answer: "Simply create an account, select your favorite sports and teams, then head to 'Commentary' to explore AI-powered match analysis. It's that easy - no setup or configuration needed!"
    },
    {
        id: 18,
        category: "Getting Started",
        question: "Where can I find live scores?",
        answer: "For real-time live scores and match updates, we recommend official sports apps like ESPN, Cricbuzz, Sky Sports, or your sport's official website. Glimpse AI focuses on providing intelligent commentary and analysis!"
    }
];

// Function to find answer for a question
export const findPredefinedAnswer = (userQuestion) => {
    const normalizedQuestion = userQuestion.toLowerCase().trim();

    // Exact match
    const exactMatch = predefinedQA.find(
        qa => qa.question.toLowerCase() === normalizedQuestion
    );

    if (exactMatch) return exactMatch.answer;

    // Keyword match (fuzzy matching)
    const keywordMatch = predefinedQA.find(qa => {
        const questionWords = qa.question.toLowerCase().split(' ');
        const userWords = normalizedQuestion.split(' ');

        // Check if at least 50% of significant words match
        const matchCount = userWords.filter(word =>
            word.length > 3 && questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))
        ).length;

        return matchCount / userWords.length >= 0.5;
    });

    return keywordMatch ? keywordMatch.answer : null;
};

// Get suggested questions by category (balanced selection)
export const getSuggestedQuestions = () => {
    return [
        predefinedQA[0],  // What is Glimpse AI?
        predefinedQA[3],  // Do you show live match scores?
        predefinedQA[4],  // Which sports are available?
        predefinedQA[10]  // How do I create an account?
    ];
};