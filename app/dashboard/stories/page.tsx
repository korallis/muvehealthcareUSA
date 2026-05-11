import Link from "next/link";
import { getStoriesAction, deleteStoryAction } from "./actions";
import { Plus, Pencil, Trash2, Quote } from "lucide-react";

export default async function StoriesDashboard() {
  const { data: allStories } = await getStoriesAction();

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header - Consistent with other dashboard pages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-lexend text-[#1F3154] tracking-tight">
            Success Stories<span className="text-[#00D9DA]">.</span>
          </h1>
          <p className="text-gray-500 mt-1 font-lexend">
            Total of {allStories?.length || 0} stories published.
          </p>
        </div>

        <Link
          href="/dashboard/stories/create"
          className="bg-[#1F3154] hover:bg-[#00D9DA] hover:text-[#1F3154] text-white px-6 py-3 rounded-full text-center font-lexendBold transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} strokeWidth={3} />
          New Story
        </Link>
      </div>

      {/* Stories Grid */}
      {allStories?.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-20 text-center text-gray-400 font-lexend">
          No stories found. Click "New Story" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allStories?.map((story) => (
            <div
              key={story.id}
              className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col items-center text-center transition-all hover:border-[#00D9DA]/30"
            >
              <div className="relative mb-6">
                <img
                  src={story.imageUrl || ""}
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-50 shadow-sm group-hover:border-[#00D9DA]/20 transition-all"
                  alt={story.name}
                />
                <div className="absolute -bottom-2 -right-2 bg-[#00D9DA] text-[#1F3154] p-2 rounded-full shadow-lg">
                  <Quote size={14} fill="currentColor" />
                </div>
              </div>

              <h3 className="text-xl font-lexendBold text-[#1F3154] mb-1">
                {story.name}
              </h3>
              <p className="text-xs text-gray-400 font-lexendBold uppercase tracking-widest mb-8">
                {story.role}
              </p>

              <div className="flex gap-3 w-full pt-6 border-t border-gray-50">
                <Link
                  href={`/dashboard/stories/edit/${story.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-center bg-lightblue text-gray-600 font-lexendBold hover:bg-[#1F3154] hover:text-white transition-all"
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await deleteStoryAction(story.id);
                  }}
                  className="flex-1"
                >
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-center bg-red-50 text-red-600 font-lexendBold hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
