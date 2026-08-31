const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findFirst({ where: { id: 'cmth260tw00007nh8y7uqb80o' } }).then(u => { 
  console.log('Current Linh Thach:', u.linhThach); 
  prisma.$disconnect(); 
});
