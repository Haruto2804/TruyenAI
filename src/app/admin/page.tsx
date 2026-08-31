import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, List, Edit } from "lucide-react";
import { deleteStory } from "@/app/admin/actions";
import { DeleteButton } from "@/components/DeleteButton";

export default async function AdminPage() {
  const stories = await prisma.story.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { chapters: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Quản lý truyện</h3>
        <Link 
          href="/admin/story/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm Truyện Mới
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Tên Truyện</th>
              <th className="px-6 py-4 font-medium">Thể Loại</th>
              <th className="px-6 py-4 font-medium">Số Chương</th>
              <th className="px-6 py-4 font-medium">Cập Nhật Lần Cuối</th>
              <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {stories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  Chưa có dữ liệu. Hãy thêm truyện mới!
                </td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr key={story.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{story.title}</td>
                  <td className="px-6 py-4">{story.genre}</td>
                  <td className="px-6 py-4">{story._count.chapters}</td>
                  <td className="px-6 py-4">{story.updatedAt.toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link 
                        href={`/admin/story/${story.slug}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                      >
                        <List className="w-4 h-4" /> Chi tiết
                      </Link>
                      <Link 
                        href={`/admin/story/${story.slug}/edit`}
                        className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Sửa
                      </Link>
                      <form action={deleteStory}>
                        <input type="hidden" name="id" value={story.id} />
                        <DeleteButton message="Xóa truyện sẽ xóa TẤT CẢ các chương bên trong. Bạn có chắc chắn không?" />
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
