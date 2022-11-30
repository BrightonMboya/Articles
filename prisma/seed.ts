import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const firstArticleId = "hAYUGF-7972BKD-sdadsKJ";
    await prisma.articles.upsert({
        where: {
            id: firstArticleId
        },
        create: {
            id: firstArticleId,
            title: "Hello World",
            description: "This is an example post from Prisma Seed",
            imageUrl: "https://unsplash.com/photos/fdnsLFbegeQ",
            externalUrl: "https://create.t3.gg/"
        },
        update: {}
    });

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect();
})