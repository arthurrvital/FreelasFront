import "./globals.css";

export const metadata = {
  title: "Freelas SJDR",
  description: "Conectando Profissionais e Oportunidades",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}