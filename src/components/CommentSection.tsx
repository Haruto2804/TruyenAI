"use client";

import { useState, useEffect } from "react";
import { addComment, getComments } from "@/app/actions/comment";
import { getUserTitle, PathType } from "@/lib/levels";
import { UserCircle, MessageSquare, Reply } from "lucide-react";
import { useRouter } from "next/navigation";

type CommentUser = { name: string | null, displayName?: string | null, image: string | null, exp: number, path: string };
type CommentType = {
  id: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  user: CommentUser;
  replies?: CommentType[];
};

export function CommentSection({ storyId, chapterId }: { storyId: string, chapterId?: string }) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    const res = await getComments(storyId, chapterId);
    if (res.success && res.comments) {
      setComments(res.comments as unknown as CommentType[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [storyId, chapterId]);

  const handleSubmit = async (parentId?: string) => {
    const text = parentId ? replyContent : content;
    if (!text.trim()) return;

    setSubmitting(true);
    const res = await addComment(storyId, text, parentId, chapterId);
    
    if (res.success) {
      if (parentId) {
        setReplyContent("");
        setReplyTo(null);
      } else {
        setContent("");
      }
      await fetchComments();
    } else {
      alert(res.message);
    }
    setSubmitting(false);
  };

  const renderComment = (c: CommentType, isReply = false) => {
    const title = getUserTitle(c.user.exp, (c.user.path as PathType) || "TIEN_HIEP");
    const displayUserName = c.user.displayName || c.user.name || "Đạo hữu ẩn danh";
    
    return (
      <div key={c.id} className={`flex gap-4 ${isReply ? "mt-4 ml-8 md:ml-12 border-l-2 border-slate-800 pl-4" : "mt-6"}`}>
        <div className="shrink-0 mt-1">
          {c.user.image ? (
            <img src={c.user.image} alt={displayUserName} className="w-10 h-10 rounded-full border border-slate-700" />
          ) : (
            <UserCircle className="w-10 h-10 text-slate-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-slate-200">{displayUserName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-medium border border-slate-700/50">
              {title}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(c.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          
          <div className="text-slate-300 leading-relaxed text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
            {c.isDeleted ? <span className="italic text-slate-500">Bình luận này đã bị xóa.</span> : c.content}
          </div>

          {!c.isDeleted && !isReply && (
            <div className="mt-2">
              <button 
                onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <Reply className="w-3 h-3" /> Trả lời
              </button>
              
              {replyTo === c.id && (
                <div className="mt-3 flex gap-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Viết câu trả lời..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                    rows={2}
                    maxLength={500}
                  />
                  <button 
                    onClick={() => handleSubmit(c.id)}
                    disabled={submitting || !replyContent.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shrink-0 self-end"
                  >
                    {submitting ? "..." : "Gửi"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Render Replies */}
          {c.replies && c.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {c.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Khu Vực Luận Đạo</h2>
      </div>

      {/* Main Comment Form */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bạn nghĩ gì về bộ truyện này? (Yêu cầu Trúc Cơ trở lên)"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          rows={3}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-slate-500">{content.length}/500</span>
          <button 
            onClick={() => handleSubmit()}
            disabled={submitting || !content.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : "Đăng bình luận"}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center text-slate-500 py-8">Đang tải bình luận...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-slate-500 py-8 bg-slate-900/20 rounded-xl border border-slate-800/50">
          Chưa có đạo hữu nào để lại dấu chân. Hãy là người đầu tiên!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(c => renderComment(c))}
        </div>
      )}
    </div>
  );
}
