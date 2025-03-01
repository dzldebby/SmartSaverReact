export const metadata = {
  title: 'Bank Interest Calculator',
  description: 'Calculate and compare interest rates from Singapore banks',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}