"use client";

import { useState, useEffect } from "react";
import { addComment, getComments } from "@/app/actions/comment";
import { getUserTitle, PathType } from "@/lib/levels";
import { UserCircle, MessageSquare, Reply, Send, Sparkles } from "lucide-react";
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
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    const res = await getComments(storyId, chapterId, 0, 20);
    if (res.success && res.comments) {
      setComments(res.comments as unknown as CommentType[]);
      setTotal(res.total ?? res.comments.length);
      setHasMore(!!res.hasMore);
    }
    setLoading(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const res = await getComments(storyId, chapterId, comments.length, 20);
    if (res.success && res.comments) {
      setComments((prev) => [...prev, ...(res.comments as unknown as CommentType[])]);
      setTotal(res.total ?? total);
      setHasMore(!!res.hasMore);
    }
    setLoadingMore(false);
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
      <div key={c.id} className={`flex gap-3 sm:gap-4 ${isReply ? "mt-3.5 ml-6 sm:ml-10 border-l-2 border-[#d4af37]/30 pl-3.5 sm:pl-4" : "mt-5"}`}>
        <div className="shrink-0 mt-0.5">
          {c.user.image ? (
            <img src={c.user.image} alt={displayUserName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d4af37]/30 object-cover shadow-sm" />
          ) : (
            <UserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs sm:text-sm text-slate-200">{displayUserName}</span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-[#d4af37]/15 text-amber-300 font-bold border border-[#d4af37]/30">
              {title}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500">
              {new Date(c.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          
          <div className="text-slate-200 leading-relaxed text-xs sm:text-sm bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {c.isDeleted ? <span className="italic text-slate-500">Bình luận này đã bị xóa.</span> : c.content}
          </div>

          {!c.isDeleted && !isReply && (
            <div className="mt-1">
              <button 
                onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                className="text-[11px] sm:text-xs font-bold text-amber-300/80 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer py-1"
              >
                <Reply className="w-3 h-3" /> Trả lời
              </button>
              
              {replyTo === c.id && (
                <div className="mt-2.5 flex flex-col xs:flex-row gap-2 bg-slate-950/80 border border-white/10 rounded-xl p-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Viết câu trả lời luận đạo..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]/60 resize-none placeholder-slate-500"
                    rows={2}
                    maxLength={500}
                  />
                  <div className="flex xs:flex-col justify-end gap-2 shrink-0">
                    <button 
                      onClick={() => handleSubmit(c.id)}
                      disabled={submitting || !replyContent.trim()}
                      className="bg-[#d4af37] hover:brightness-110 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>{submitting ? "..." : "Gửi"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Render Replies */}
          {c.replies && c.replies.length > 0 && (
            <div className="space-y-1">
              {c.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-lg sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
          <div className="p-1.5 sm:p-2 bg-[#d4af37]/15 rounded-xl text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span>Khu Vực Luận Đạo</span>
        </h2>
        <span className="text-xs text-slate-400 font-semibold">
          {total} bình luận
        </span>
      </div>

      {/* Main Comment Form */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bạn nghĩ gì về bộ truyện này? Để lại lời bình luận luận đạo..."
          className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60 transition-all resize-none text-xs sm:text-sm leading-relaxed"
          rows={3}
          maxLength={500}
        />
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-mono">{content.length}/500</span>
          <button 
            onClick={() => handleSubmit()}
            disabled={submitting || !content.trim()}
            className="bg-gradient-to-r from-[#d4af37] to-amber-400 hover:brightness-110 text-slate-950 px-5 sm:px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-[0_2px_15px_rgba(212,175,55,0.25)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? "Đang gửi..." : "Đăng bình luận"}</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center text-slate-500 py-6 text-sm">Đang tải bình luận...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-slate-400 py-8 bg-black/20 rounded-2xl border border-white/5 text-xs sm:text-sm">
          Chưa có đạo hữu nào để lại dấu chân. Hãy là người đầu tiên luận đạo!
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-white/5 space-y-1">
            {comments.map(c => renderComment(c))}
          </div>

          {hasMore && (
            <div className="pt-2 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 hover:border-[#d4af37]/30 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
              >
                {loadingMore ? "Đang tải thêm bình luận..." : "Xem thêm bình luận"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
