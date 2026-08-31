import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Vui lòng chọn file hình ảnh." },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Định dạng file không hợp lệ (chỉ hỗ trợ JPG, PNG, WEBP, GIF)." },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Dung lượng ảnh tối đa là 10MB." },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      // In development fallback, if credentials are missing, we warn the user
      return NextResponse.json(
        {
          success: false,
          error: "Chưa cấu hình biến môi trường CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY trong file .env.",
        },
        { status: 500 }
      );
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, "truyen-ai/covers");

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: unknown) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Đã có lỗi xảy ra khi tải ảnh lên Cloudinary.",
      },
      { status: 500 }
    );
  }
}
