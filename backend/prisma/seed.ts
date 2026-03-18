import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.auditLog.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.admin.deleteMany();

    // Seed Admin
    const passwordHash = await bcrypt.hash('Admin@123', 12);
    await prisma.admin.create({
        data: {
            email: 'admin@anjaraipetti.com',
            passwordHash,
            name: 'Admin',
        },
    });
    console.log('✅ Admin seeded');

    // Seed Categories
    const masala = await prisma.category.create({
        data: {
            name: 'Masala',
            nameTa: 'மசாலா',
            slug: 'masala',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600',
        },
    });

    const sweets = await prisma.category.create({
        data: {
            name: 'Sweets',
            nameTa: 'இனிப்புகள்',
            slug: 'sweets',
            image: 'https://images.unsplash.com/photo-1666190064034-e181899db947?w=600',
        },
    });

    const snacks = await prisma.category.create({
        data: {
            name: 'Snacks',
            nameTa: 'தின்பண்டங்கள்',
            slug: 'snacks',
            image: 'https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=600',
        },
    });
    console.log('✅ Categories seeded');

    // Seed Products — Masala
    const masalaProducts = [
        {
            name: 'Sambar Powder',
            nameTa: 'சாம்பார் பொடி',
            description: 'Traditional homemade sambar powder made with hand-picked spices, sun-dried and freshly ground for authentic South Indian sambar.',
            descTa: 'கைத்தேர்ந்த மசாலாக்களால் தயாரிக்கப்பட்ட பாரம்பரிய வீட்டுச் சாம்பார் பொடி. வெயிலில் உலர்த்தி, புதிதாக அரைக்கப்பட்டது.',
            price: 120,
            mrp: 150,
            weight: '200g',
            stock: 50,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
        },
        {
            name: 'Rasam Powder',
            nameTa: 'ரசம் பொடி',
            description: 'Aromatic rasam powder with a perfect blend of pepper, cumin, and coriander. Makes the most flavorful rasam every time.',
            descTa: 'மிளகு, சீரகம் மற்றும் கொத்தமல்லி ஆகியவற்றின் சரியான கலவையுடன் நறுமணமிக்க ரசம் பொடி.',
            price: 100,
            mrp: 130,
            weight: '200g',
            stock: 45,
            isFeatured: false,
            images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
        },
        {
            name: 'Chicken Masala',
            nameTa: 'சிக்கன் மசாலா',
            description: 'Spicy and aromatic chicken masala powder for the perfect homestyle chicken curry. Packed with authentic Chettinad flavors.',
            descTa: 'சரியான வீட்டு சிக்கன் கறிக்கான காரமான மற்றும் நறுமணமிக்க சிக்கன் மசாலா பொடி. செட்டிநாடு சுவைகளால் நிரம்பியது.',
            price: 150,
            mrp: 180,
            weight: '200g',
            stock: 40,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
        },
        {
            name: 'Chilli Powder',
            nameTa: 'மிளகாய் பொடி',
            description: 'Premium quality red chilli powder made from hand-selected Guntur chillies. Rich color and moderate heat.',
            descTa: 'கையால் தேர்ந்தெடுக்கப்பட்ட குண்டூர் மிளகாய்களிலிருந்து தயாரிக்கப்பட்ட உயர்தர சிவப்பு மிளகாய் பொடி.',
            price: 90,
            mrp: 110,
            weight: '200g',
            stock: 60,
            isFeatured: false,
            images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
        },
        {
            name: 'Coriander Powder',
            nameTa: 'கொத்தமல்லி பொடி',
            description: 'Freshly ground coriander powder from whole coriander seeds. Essential for every Indian kitchen.',
            descTa: 'முழு கொத்தமல்லி விதைகளிலிருந்து புதிதாக அரைக்கப்பட்ட கொத்தமல்லி பொடி. ஒவ்வொரு இந்திய சமையலறைக்கும் அத்தியாவசியம்.',
            price: 80,
            mrp: 100,
            weight: '200g',
            stock: 55,
            isFeatured: false,
            images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
        },
        {
            name: 'Garam Masala',
            nameTa: 'கரம் மசாலா',
            description: 'A luxurious blend of cardamom, cloves, cinnamon, and other whole spices. Adds depth and warmth to any dish.',
            descTa: 'ஏலக்காய், கிராம்பு, பட்டை மற்றும் பிற முழு மசாலாக்களின் ஆடம்பரமான கலவை. எந்த உணவிலும் ஆழம் மற்றும் சூடு சேர்க்கிறது.',
            price: 130,
            mrp: 160,
            weight: '200g',
            stock: 35,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
        },
    ];

    for (const product of masalaProducts) {
        await prisma.product.create({
            data: { ...product, categoryId: masala.id },
        });
    }

    // Seed Products — Sweets
    const sweetProducts = [
        {
            name: 'Mysore Pak',
            nameTa: 'மைசூர் பாக்',
            description: 'Melt-in-your-mouth Mysore Pak made with pure ghee, besan, and sugar. A royal South Indian sweet.',
            descTa: 'சுத்தமான நெய், பேசன் மற்றும் சர்க்கரையால் தயாரிக்கப்பட்ட வாயில் கரையும் மைசூர் பாக். ஒரு அரச தென்னிந்திய இனிப்பு.',
            price: 250,
            mrp: 300,
            weight: '250g',
            stock: 30,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1666190064034-e181899db947?w=600'],
        },
        {
            name: 'Adhirasam',
            nameTa: 'அதிரசம்',
            description: 'Traditional Tamil Nadu sweet made from rice flour and jaggery. Crispy on the outside, soft inside.',
            descTa: 'அரிசி மா மற்றும் வெல்லத்தில் தயாரிக்கப்பட்ட பாரம்பரிய தமிழ்நாடு இனிப்பு. வெளியே மொறுமொறுப்பு, உள்ளே மென்மை.',
            price: 200,
            mrp: 250,
            weight: '250g',
            stock: 25,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1666190064034-e181899db947?w=600'],
        },
        {
            name: 'Kaju Katli',
            nameTa: 'காஜு கட்லி',
            description: 'Premium cashew fudge with a thin layer of edible silver foil. Perfect for gifting and celebrations.',
            descTa: 'சாப்பிடக்கூடிய வெள்ளி தாளின் மெல்லிய அடுக்குடன் கூடிய உயர்தர முந்திரி ஃபட்ஜ். பரிசளிப்பு மற்றும் கொண்டாட்டங்களுக்கு ஏற்றது.',
            price: 350,
            mrp: 400,
            weight: '250g',
            stock: 20,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1666190064034-e181899db947?w=600'],
        },
        {
            name: 'Ladoo',
            nameTa: 'லட்டு',
            description: 'Golden besan ladoo made with roasted gram flour, ghee, and cardamom. A festive favorite.',
            descTa: 'வறுத்த கடலை மாவு, நெய் மற்றும் ஏலக்காயால் தயாரிக்கப்பட்ட தங்க நிற பேசன் லட்டு. ஒரு பண்டிகை பிடித்தது.',
            price: 180,
            mrp: 220,
            weight: '250g',
            stock: 35,
            isFeatured: false,
            images: ['https://images.unsplash.com/photo-1666190064034-e181899db947?w=600'],
        },
    ];

    for (const product of sweetProducts) {
        await prisma.product.create({
            data: { ...product, categoryId: sweets.id },
        });
    }

    // Seed Products — Snacks
    const snackProducts = [
        {
            name: 'Murukku',
            nameTa: 'முறுக்கு',
            description: 'Crunchy spiral-shaped South Indian snack made with rice flour and urad dal flour. Perfectly spiced and crispy.',
            descTa: 'அரிசி மா மற்றும் உளுந்து மாவில் தயாரிக்கப்பட்ட மொறுமொறுப்பான சுருள் வடிவ தென்னிந்திய சிற்றுண்டி.',
            price: 150,
            mrp: 180,
            weight: '300g',
            stock: 40,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=600'],
        },
        {
            name: 'Mixture',
            nameTa: 'மிக்ஸ்சர்',
            description: 'A crunchy mix of sev, boondi, peanuts, and curry leaves. The perfect tea-time companion.',
            descTa: 'சேவ், போண்டி, வேர்க்கடலை மற்றும் கறிவேப்பிலையின் மொறுமொறுப்பான கலவை. சரியான தேநீர் நேர துணை.',
            price: 130,
            mrp: 160,
            weight: '300g',
            stock: 45,
            isFeatured: false,
            images: ['https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=600'],
        },
        {
            name: 'Thattai',
            nameTa: 'தட்டை',
            description: 'Crispy and flaky rice crackers flavored with curry leaves, chana dal, and coconut. A classic Tamil snack.',
            descTa: 'கறிவேப்பிலை, கடலைப்பருப்பு மற்றும் தேங்காயால் சுவையூட்டப்பட்ட மொறுமொறுப்பான அரிசி கிரேக்கர்கள்.',
            price: 140,
            mrp: 170,
            weight: '300g',
            stock: 35,
            isFeatured: false,
            images: ['https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=600'],
        },
        {
            name: 'Banana Chips',
            nameTa: 'வாழைப்பழ சிப்ஸ்',
            description: 'Thin and crispy banana chips fried in coconut oil. A Kerala-Tamil Nadu favorite with the perfect salt balance.',
            descTa: 'தேங்காய் எண்ணெயில் வறுக்கப்பட்ட மெல்லிய மற்றும் மொறுமொறுப்பான வாழைப்பழ சிப்ஸ்.',
            price: 120,
            mrp: 150,
            weight: '250g',
            stock: 50,
            isFeatured: true,
            images: ['https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=600'],
        },
        {
            name: 'Ribbon Pakoda',
            nameTa: 'ரிப்பன் பகோடா',
            description: 'Delicate ribbon-shaped pakoda made with gram flour and rice flour. Light, crispy, and addictively good.',
            descTa: 'கடலை மாவு மற்றும் அரிசி மாவில் தயாரிக்கப்பட்ட நுட்பமான ரிப்பன் வடிவ பகோடா.',
            price: 110,
            mrp: 140,
            weight: '250g',
            stock: 40,
            isFeatured: false,
            images: ['https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=600'],
        },
    ];

    for (const product of snackProducts) {
        await prisma.product.create({
            data: { ...product, categoryId: snacks.id },
        });
    }
    console.log('✅ Products seeded');

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
