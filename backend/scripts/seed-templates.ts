import prismaClient from "../src/config/prisma.js";
import { randomUUID } from 'crypto';

async function seed() {
    console.log("Seeding templates...");

    const templates = [
        {
            name: "Business",
            description: "Modern professional layout for companies",
            category: "business",
            content: [
                {
                    name: "Home",
                    slug: "/home",
                    content: [
                        {
                            id: randomUUID(),
                            type: "hero",
                            name: "Hero Section",
                            content: {
                                headline: "Build Your Digital Future",
                                subheadline: "Professional solutions for modern businesses.",
                                ctaText: "Get Started"
                            },
                            styles: { backgroundColor: "#ffffff", padding: "120px 0" }
                        },
                        {
                            id: randomUUID(),
                            type: "features",
                            name: "Features",
                            content: {
                                headline: "Why Choose Us",
                                features: [
                                    { id: randomUUID(), title: "Expertise", description: "Years of industry experience." },
                                    { id: randomUUID(), title: "Quality", description: "High-end delivery every time." }
                                ]
                            },
                            styles: { backgroundColor: "#f8fafc", padding: "100px 0" }
                        }
                    ]
                }
            ]
        },
        {
            name: "Portfolio",
            description: "Showcase your creative work beautifully",
            category: "creative",
            content: [
                {
                    name: "Home",
                    slug: "/home",
                    content: [
                        {
                            id: randomUUID(),
                            type: "hero",
                            name: "Portfolio Hero",
                            content: {
                                headline: "I Create Digital Art",
                                subheadline: "Take a look at my latest projects and skills.",
                                ctaText: "View Work"
                            },
                            styles: { backgroundColor: "#fafafa", padding: "100px 0" }
                        }
                    ]
                }
            ]
        }
    ];

    for (const t of templates) {
        await (prismaClient as any).template.upsert({
            where: { id: t.name.toLowerCase() },
            update: t,
            create: {
                id: t.name.toLowerCase(),
                ...t
            }
        });
    }

    console.log("Seeding complete.");
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
