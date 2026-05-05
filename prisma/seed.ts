import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const demoUserId = "demo-user";

const demoArticles = [
  {
    title: "How Plants Turn Sunlight Into Food",
    summary:
      "A short overview of photosynthesis and why it matters for life on Earth.",
    content:
      "Plants use a process called photosynthesis to turn sunlight, water, and carbon dioxide into glucose, which acts like food for the plant. This happens mostly inside leaves, where chlorophyll captures light energy and helps drive the chemical reaction. As a result, plants release oxygen into the air, making photosynthesis important not only for plants but also for animals and humans. Without this steady conversion of sunlight into stored energy, most food chains on Earth would quickly break down.",
    quizzes: [
      {
        question: "What is the main purpose of photosynthesis for plants?",
        options: [
          "To produce glucose for energy",
          "To absorb oxygen from animals",
          "To cool down the leaves",
          "To create soil nutrients",
        ],
        answer: 0,
      },
      {
        question: "Which substance do plants release during photosynthesis?",
        options: ["Nitrogen", "Oxygen", "Salt", "Protein"],
        answer: 1,
      },
      {
        question: "Where does photosynthesis mostly happen?",
        options: ["Roots", "Flowers", "Leaves", "Seeds"],
        answer: 2,
      },
      {
        question: "Which pigment helps plants capture light energy?",
        options: ["Chlorophyll", "Keratin", "Melanin", "Collagen"],
        answer: 0,
      },
      {
        question: "Why is photosynthesis important for food chains?",
        options: [
          "It turns sunlight into stored energy",
          "It makes animals stop eating",
          "It removes all water from plants",
          "It prevents leaves from growing",
        ],
        answer: 0,
      },
    ],
  },
  {
    title: "Why Sleep Helps Memory",
    summary:
      "A simple explanation of how sleep supports learning and memory.",
    content:
      "Sleep gives the brain time to organize information gathered during the day. While a person sleeps, the brain strengthens useful connections, removes some unnecessary details, and prepares for new learning. This is why studying all night without rest often works worse than reviewing material and sleeping well afterward. Good sleep also supports attention, mood, and decision-making, which all make it easier to remember and use information later.",
    quizzes: [
      {
        question: "What does sleep help the brain do with information?",
        options: [
          "Erase every memory",
          "Organize and strengthen useful connections",
          "Stop learning permanently",
          "Replace attention with stress",
        ],
        answer: 1,
      },
      {
        question: "Why can studying all night be less effective?",
        options: [
          "The brain may not get rest needed to consolidate learning",
          "Books stop working at night",
          "Memory only forms before noon",
          "Sleep removes all studied material",
        ],
        answer: 0,
      },
      {
        question: "Besides memory, sleep also supports:",
        options: ["Attention and mood", "Gravity", "Plant growth", "Typing speed only"],
        answer: 0,
      },
      {
        question: "What can the brain remove during sleep?",
        options: [
          "Some unnecessary details",
          "All learned skills",
          "Every useful connection",
          "The need for attention",
        ],
        answer: 0,
      },
      {
        question: "What does good sleep prepare the brain for?",
        options: ["New learning", "Less oxygen", "Slower thinking", "Permanent distraction"],
        answer: 0,
      },
    ],
  },
  {
    title: "The Basics of Budgeting",
    summary:
      "A beginner-friendly look at tracking income, expenses, and savings.",
    content:
      "A budget is a simple plan for how money comes in and goes out. It usually starts by listing income, then separating expenses into needs, wants, and savings. Needs include things like rent, food, and transportation, while wants are optional purchases such as entertainment or extra snacks. A useful budget does not have to be perfect; it just needs to make spending visible so a person can make better choices and avoid surprises.",
    quizzes: [
      {
        question: "What is a budget mainly used for?",
        options: [
          "Planning income and spending",
          "Hiding expenses",
          "Increasing prices",
          "Replacing bank accounts",
        ],
        answer: 0,
      },
      {
        question: "Which item is usually considered a need?",
        options: ["Movie tickets", "Rent", "Video games", "Decorations"],
        answer: 1,
      },
      {
        question: "A useful budget should make spending:",
        options: ["Invisible", "Random", "Visible", "Impossible"],
        answer: 2,
      },
      {
        question: "Which category includes optional purchases?",
        options: ["Needs", "Wants", "Income", "Debt"],
        answer: 1,
      },
      {
        question: "Why does a budget not have to be perfect?",
        options: [
          "It mainly needs to make spending easier to understand",
          "It should hide small purchases",
          "It only works with exact guesses",
          "It replaces saving money",
        ],
        answer: 0,
      },
    ],
  },
];

async function main() {
  await prisma.user.upsert({
    where: { id: demoUserId },
    update: {
      email: "demo@example.com",
      name: "Demo User",
      clerkId: demoUserId,
    },
    create: {
      id: demoUserId,
      email: "demo@example.com",
      name: "Demo User",
      clerkId: demoUserId,
    },
  });

  const existingDemoArticles = await prisma.article.findMany({
    where: { userId: demoUserId },
    select: { id: true },
  });

  const existingDemoArticleIds = existingDemoArticles.map((article) => article.id);

  if (existingDemoArticleIds.length > 0) {
    await prisma.quiz.deleteMany({
      where: { articleId: { in: existingDemoArticleIds } },
    });

    await prisma.article.deleteMany({
      where: { id: { in: existingDemoArticleIds } },
    });
  }

  for (const article of demoArticles) {
    await prisma.article.create({
      data: {
        title: article.title,
        summary: article.summary,
        content: article.content,
        userId: demoUserId,
        quizzes: {
          create: article.quizzes,
        },
      },
    });
  }
}

main()
  .then(async () => {
    console.log(`Seeded ${demoArticles.length} demo articles for ${demoUserId}.`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
