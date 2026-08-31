const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const sepayId = "123456";
    const transferAmount = 50000;
    const contentStr = "NAP CMTH260T";
    const match = contentStr.match(/NAP\s+([A-Z0-9]{8})/);
    const shortId = match[1].toLowerCase();

    console.log("shortId:", shortId);

    const user = await prisma.user.findFirst({
      where: {
        id: { startsWith: shortId }
      }
    });

    console.log("user:", user ? user.id : null);

    const calculateLinhThach = (amount) => {
      if (amount >= 100000) return (amount / 10) + 1500;
      if (amount >= 50000) return (amount / 10) + 500;
      if (amount >= 20000) return (amount / 10) + 100;
      return amount / 10;
    };

    const addedLinhThach = calculateLinhThach(transferAmount);

    console.log("addedLinhThach:", addedLinhThach);

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId: user.id,
          amount: addedLinhThach,
          type: "TOPUP",
          description: `Nạp ${transferAmount.toLocaleString()} VNĐ qua ngân hàng`,
          referenceId: String(sepayId),
          status: "SUCCESS"
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          linhThach: { increment: addedLinhThach }
        }
      })
    ]);

    console.log("Success!");
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
