import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const cats = await prisma.category.findMany();
  for (const c of cats) {
    console.log(c.slug, c.image);
    // Overwrite unplash domains forcibly to known working URLs just to be completely safe:
    if (c.slug === 'sweets' && c.image.includes('unsplash')) {
      await prisma.category.update({
        where: { id: c.id },
        data: { image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800' }
      });
      console.log('Fixed sweets to known URL');
    }
    if (c.slug === 'snacks' && c.image.includes('unsplash')) {
      await prisma.category.update({
        where: { id: c.id },
        data: { image: 'https://images.unsplash.com/photo-1604328471151-b52226907017?q=80&w=800' }
      });
      console.log('Fixed snacks to known URL');
    }
  }

  const prods = await prisma.product.findMany();
  for (const p of prods) {
    let changed = false;
    let newImages = p.images.map(img => {
      // If image is a broken unsplash link, fix it
      // photo-16661 is another broken one Nextjs logged
      if (img.includes('1666190') || img.includes('159949')) {
        changed = true;
        return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800'; 
      }
      return img;
    });

    if (changed) {
      await prisma.product.update({
        where: { id: p.id },
        data: { images: newImages }
      });
      console.log('Fixed product images:', p.name);
    }
  }
}

check()
  .then(() => console.log('Done DB Check'))
  .finally(() => prisma.$disconnect());
