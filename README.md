# SmartSaverSG Bank Calculator

A tool to help users compare interest rates from different banks in Singapore.

## Features

- Calculate interest rates based on your deposit amount and banking habits
- Compare different banks side by side
- Interactive charts to visualize the differences
- AI-powered chatbot to answer questions about bank features and interest calculations

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your OpenAI API key:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```
   - You can get an API key from [OpenAI's platform](https://platform.openai.com/api-keys)

## Running the Application

You need to run two servers:

1. Start the Next.js API server:
   ```
   npm run dev
   ```

2. In a separate terminal, start the React app:
   ```
   npm start
   ```

## Using the Chatbot

1. Fill out the calculator form and click "Calculate Interest Rates"
2. After calculation, a chat button will appear in the bottom-right corner
3. Click the button to open the chat window
4. Ask questions about bank features, interest calculations, or recommendations

Example questions:
- "Why is UOB One giving higher interest than OCBC 360?"
- "What would happen if I increased my card spend to $1,000?"
- "How does DBS Multiplier calculate bonus interest?"
- "Which bank is best for my profile?"

## Technologies Used

- React
- Next.js (for API routes)
- OpenAI API
- Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern banking applications
- Financial calculation formulas based on standard amortization methods
