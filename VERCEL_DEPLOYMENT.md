# Deploying the Bank Calculator to Vercel

This guide provides instructions for deploying the Bank Calculator application to Vercel, with a focus on ensuring the chatbot functionality works correctly.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. An OpenAI API key (sign up at [platform.openai.com](https://platform.openai.com))
3. Git repository with your Bank Calculator code

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has the following structure for API routes:

- `/api/chat.js` - The chatbot API endpoint
- `/api/debug.js` - A debug endpoint to check environment variables
- `/api/test.js` - A simple test endpoint
- `/api/direct-chat.js` - A fallback chat endpoint that doesn't use OpenAI

### 2. Set Up Environment Variables in Vercel

1. Go to the Vercel dashboard and create a new project
2. Import your Git repository
3. Before deploying, configure the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: (Optional) The model to use (defaults to 'gpt-3.5-turbo')

   ![Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables/images/environment-variables-dashboard.png)

4. Make sure to add these variables to all environments (Production, Preview, and Development)

### 3. Deploy Your Application

1. Complete the deployment process in Vercel
2. Once deployed, your application will be available at a URL like `https://your-project-name.vercel.app`

### 4. Test the Deployment

After deployment, you can test your API endpoints using the built-in test page:

1. Visit `https://your-project-name.vercel.app/api-test.html`
2. Use the buttons to test each API endpoint:
   - Test API: Checks if the basic API functionality is working
   - Debug API: Checks environment variables and deployment status
   - Chat API: Tests the chat functionality with a simple message
   - Direct Chat API: Tests the fallback chat functionality
   - Test All Endpoints: Tests all possible chat endpoints to see which ones work

You can also test the chatbot directly in your application:

1. Visit your deployed application
2. Open the chatbot interface
3. Send a test message to verify it's working

## Troubleshooting

### API Key Issues

If the debug endpoint shows that the API key is missing or invalid:

1. Double-check the environment variables in your Vercel project settings
2. Ensure the API key is correctly formatted (should start with 'sk-')
3. Verify that your OpenAI account has sufficient quota

### CORS Issues

If you're experiencing CORS errors:

1. The API routes already include CORS headers, but you may need to adjust them for your specific domain
2. Check browser console for specific CORS error messages

### API Route Structure

If the chatbot API isn't being found:

1. Verify that your API routes are in the correct location (`/api/chat.js`)
2. Check that the frontend is calling the correct API endpoint (`/api/chat`)
3. Use the API test page to check if the endpoints are accessible

### 404 Errors

If you're seeing 404 errors when calling the API:

1. Make sure your frontend components are using the full URL path (`${window.location.origin}/api/chat`)
2. Check the network tab in your browser's developer tools to see the exact request URL
3. Verify that the API routes are properly deployed to Vercel
4. Try the fallback endpoints (`/api/direct-chat` or `/chat`) to see if they work
5. Use the "Test All Endpoints" feature in the API test page to identify which endpoints are accessible

### WebSocket Issues

Vercel serverless functions do not support WebSockets directly. If your application requires WebSockets:

1. Use a third-party service like Pusher, Socket.io, Ably, or PubNub
2. Update your frontend code to use the third-party service instead of direct WebSocket connections
3. For more information, see [Vercel's guide on using Pusher](https://vercel.com/guides/using-pusher-with-vercel)

## Testing Scripts

Use the provided testing scripts to diagnose issues:

```bash
# Test API connectivity
npm run test:api https://your-project-name.vercel.app

# Test CORS configuration
npm run test:cors https://your-project-name.vercel.app

# Test API routes
npm run test:routes https://your-project-name.vercel.app

# Test OpenAI API key
npm run test:openai YOUR_API_KEY
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Pusher Documentation](https://pusher.com/docs)
- [Socket.io Documentation](https://socket.io/docs/v4/) 