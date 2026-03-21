import Navbar from '@/components/layout/Navbar';
import AnnouncementTicker from '@/components/layout/AnnouncementTicker';
import Footer from '@/components/layout/Footer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AnnouncementTicker />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
