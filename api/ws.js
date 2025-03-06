/**
 * WebSocket handler for Vercel
 * Note: This is a placeholder as Vercel doesn't support WebSockets directly.
 * For WebSocket support, you would need to use a service like Pusher or Socket.io
 */

export default function handler(req, res) {
  // Return a helpful message about WebSocket support
  res.status(200).json({
    message: 'WebSocket connections are not supported directly in Vercel serverless functions.',
    alternatives: [
      'Use a service like Pusher (https://pusher.com)',
      'Use Socket.io with a custom server',
      'Use a WebSocket service like Ably or PubNub'
    ],
    documentation: 'https://vercel.com/guides/using-pusher-with-vercel'
  });
} 