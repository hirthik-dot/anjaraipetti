import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Anjaraipetti - A Pinch of Magic | Tamil Nadu Homemade Food Store",
  description: "Authentic homemade Tamil Nadu masala, sweets, and snacks. Traditional recipes made with love — Sambar Powder, Murukku, Mysore Pak & more. Free delivery on ₹499+.",
  keywords: ["Tamil Nadu food", "homemade masala", "Indian snacks", "traditional sweets", "anjaraipetti"],
  openGraph: {
    title: "Anjaraipetti - A Pinch of Magic",
    description: "Authentic homemade Tamil Nadu masala, sweets, and snacks delivered to your doorstep.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#2C1810',
              color: '#FDF6EC',
              fontFamily: "'Lato', sans-serif",
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#C8962E',
                secondary: '#FDF6EC',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FDF6EC',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
