import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, List as ListIcon, Edit } from "lucide-react";
import { deleteChapter } from "@/app/admin/actions";
import { DeleteButton } from "@/components/DeleteButton";

export default async function AdminStoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug: slug },
    include: {
      chapters: {
        orderBy: { chapterNo: 'asc' }
      }
    }
  });

  if (!story) {
    notFound();
  }

  // Determine next chapter number
  const nextChapterNo = story.chapters.length > 0 
    ? story.chapters[story.chapters.length - 1].chapterNo + 1 
    : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h3 className="text-xl font-semibold text-white">
          Truyện: <span className="text-indigo-400">{story.title}</span>
        </h3>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-medium text-slate-200 flex items-center gap-2">
            <ListIcon className="w-4 h-4 text-slate-400" /> Danh sách Chương
          </h4>
          <Link 
            href={`/admin/story/${story.slug}/chapter/new?next=${nextChapterNo}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Đăng Chương Mới
          </Link>
        </div>

        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 font-medium w-24">Chương</th>
              <th className="px-6 py-3 font-medium">Tiêu đề</th>
              <th className="px-6 py-3 font-medium">Độ dài</th>
              <th className="px-6 py-3 font-medium">Ngày đăng</th>
              <th className="px-6 py-3 font-medium text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {story.chapters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Chưa có chương nào. Bấm "Đăng Chương Mới" để bắt đầu.
                </td>
              </tr>
            ) : (
              story.chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3 font-mono text-slate-400">{chapter.chapterNo}</td>
                  <td className="px-6 py-3 font-medium text-slate-200">{chapter.title}</td>
                  <td className="px-6 py-3">{chapter.content.length.toLocaleString('vi-VN')} ký tự</td>
                  <td className="px-6 py-3">{chapter.createdAt.toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/story/${story.slug}/chapter/${chapter.id}/edit`}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        title="Sửa chương"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <input type="hidden" name="storySlug" value={story.slug} />
                        <DeleteButton message="Bạn có chắc muốn xóa chương này không?" />
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
