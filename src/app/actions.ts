"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function addExpToUser(chapterId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Not logged in" };
  }

  const userId = session.user.id;

  try {
    // Attempt to create a read history record
    // If it already exists, the unique constraint will throw an error
    await prisma.readHistory.create({
      data: {
        userId,
        chapterId,
      }
    });

    // If successful, user hasn't read this chapter before. Award 10 EXP.
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        exp: {
          increment: 10
        }
      }
    });

    return { 
      success: true, 
      expGained: 10,
      totalExp: updatedUser.exp 
    };

  } catch (error: any) {
    // Unique constraint violation means they already read this chapter
    if (error.code === 'P2002') {
      return { success: false, message: "Already read this chapter" };
    }
    console.error("Error adding EXP:", error);
    return { success: false, message: "Server error" };
  }
}

export async function updateUserPath(path: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Not logged in" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { path }
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}
