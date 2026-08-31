const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Vui lòng cung cấp email: node scripts/make-admin.js <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user) {
    console.error(`❌ Không tìm thấy người dùng với email: ${email}`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email: email.trim().toLowerCase() },
    data: { role: "ADMIN" },
  });

  console.log(`✅ Đã cấp quyền ADMIN thành công cho: ${updated.name || updated.email} (ID: ${updated.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
