import { dos } from '@/app/fonts';
import { AppProvider } from '@/app/providers';

import '@/app/styles/globals.css';

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="ko" className={`${dos.variable} min-h-full antialiased`}>
            <body className="flex min-h-full flex-col">
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    );
};
export default RootLayout;
