"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  PlusCircle,
  Loader2,
  Tag,
  Newspaper,
  Calendar,
  HelpCircle,
  Link2,
  Briefcase,
  X,
  Check,
} from "lucide-react";
import {
  updateCategoryAction,
  deleteCategoryAction,
  createSharedCategoryAction,
  updateFAQCategoryAction,
  deleteFAQCategoryAction,
  createFAQCategoryAction,
  updateQuicklinkCategoryAction,
  deleteQuicklinkCategoryAction,
  createQuicklinkCategoryAction,
  updateJobCategoryAction,
  deleteJobCategoryAction,
  createJobCategoryAction,
} from "./actions";

type Tab = "news-events" | "faq" | "quicklinks" | "jobs";

interface SharedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  newsCount: number;
  eventsCount: number;
}

interface SimpleCategory {
  id: string;
  name: string;
  itemCount: number;
}

interface Props {
  sharedCategories: SharedCategory[];
  faqCategories: SimpleCategory[];
  quicklinkCategories: SimpleCategory[];
  jobCategories: SimpleCategory[];
}

const TABS: { key: Tab; label: string; icon: typeof Tag }[] = [
  { key: "news-events", label: "News & Events", icon: Newspaper },
  { key: "faq", label: "FAQ", icon: HelpCircle },
  { key: "quicklinks", label: "Quick Links", icon: Link2 },
  { key: "jobs", label: "Jobs", icon: Briefcase },
];

export default function CategoryManagementClient({
  sharedCategories,
  faqCategories: faqCats,
  quicklinkCategories: qlCats,
  jobCategories: jobCats,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("news-events");

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-[#1F3154] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "news-events" && (
        <SharedCategoryTable categories={sharedCategories} />
      )}
      {activeTab === "faq" && (
        <SimpleCategoryTable
          categories={faqCats}
          typeName="FAQ"
          itemLabel="FAQs"
          createAction={createFAQCategoryAction}
          updateAction={updateFAQCategoryAction}
          deleteAction={deleteFAQCategoryAction}
        />
      )}
      {activeTab === "quicklinks" && (
        <SimpleCategoryTable
          categories={qlCats}
          typeName="Quick Link"
          itemLabel="Links"
          createAction={createQuicklinkCategoryAction}
          updateAction={updateQuicklinkCategoryAction}
          deleteAction={deleteQuicklinkCategoryAction}
        />
      )}
      {activeTab === "jobs" && (
        <SimpleCategoryTable
          categories={jobCats}
          typeName="Job"
          itemLabel="Jobs"
          createAction={createJobCategoryAction}
          updateAction={updateJobCategoryAction}
          deleteAction={deleteJobCategoryAction}
        />
      )}
    </div>
  );
}

// ─── News & Events category table ───

function SharedCategoryTable({
  categories,
}: {
  categories: SharedCategory[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function startEdit(cat: SharedCategory) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
    setError(null);
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;
    setLoading(true);
    const res = await updateCategoryAction(editingId, {
      name: editName.trim(),
      description: editDesc.trim() || undefined,
    });
    setLoading(false);
    if (res && "error" in res) {
      setError(res.error as string);
    } else {
      setEditingId(null);
      setError(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? Items using it will become uncategorised.`))
      return;
    setLoading(true);
    const res = await deleteCategoryAction(id);
    setLoading(false);
    if (res.error) setError(res.error);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setLoading(true);
    const res = await createSharedCategoryAction({
      name: newName.trim(),
      description: newDesc.trim() || undefined,
    });
    setLoading(false);
    if (res && "error" in res) {
      setError(res.error as string);
    } else {
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      setError(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-[#00D9DA]" />
          <span className="text-sm font-bold text-[#1F3154]">
            News & Events Categories ({categories.length})
          </span>
        </div>
        <button
          onClick={() => {
            setShowCreate(!showCreate);
            setError(null);
          }}
          className="flex items-center gap-1.5 text-sm font-bold text-[#00D9DA] hover:underline"
        >
          <PlusCircle size={14} /> Add
        </button>
      </div>

      {error && (
        <div className="px-6 py-2 bg-red-50 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {showCreate && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1"
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-4 py-2 bg-[#1F3154] text-white rounded-lg text-sm font-bold hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Create"}
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setNewName("");
                setNewDesc("");
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-3 text-xs font-bold text-[#1F3154] uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-xs font-bold text-[#1F3154] uppercase tracking-wider">
              Usage
            </th>
            <th className="px-6 py-3 text-xs font-bold text-[#1F3154] uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-xs font-bold text-[#1F3154] uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                No categories yet.
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                      />
                      <input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-[#1F3154]">{cat.name}</span>
                      {cat.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Newspaper size={12} /> {cat.newsCount} news
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {cat.eventsCount} events
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(cat.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === cat.id ? (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={saveEdit}
                        disabled={loading}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        {loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 text-gray-400 hover:text-[#1F3154] hover:bg-gray-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Simple category table (FAQ, Quicklinks, Jobs) ───

function SimpleCategoryTable({
  categories,
  typeName,
  itemLabel,
  createAction,
  updateAction,
  deleteAction,
}: {
  categories: SimpleCategory[];
  typeName: string;
  itemLabel: string;
  createAction: (data: { name: string }) => Promise<unknown>;
  updateAction: (id: string, data: { name: string }) => Promise<unknown>;
  deleteAction: (id: string) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  function startEdit(cat: SimpleCategory) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setError(null);
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;
    setLoading(true);
    const res = (await updateAction(editingId, {
      name: editName.trim(),
    })) as { error?: string };
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setEditingId(null);
      setError(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${typeName} category "${name}"?`)) return;
    setLoading(true);
    const res = await deleteAction(id);
    setLoading(false);
    if (res.error) setError(res.error);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setLoading(true);
    const res = (await createAction({ name: newName.trim() })) as {
      error?: string;
    };
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setShowCreate(false);
      setNewName("");
      setError(null);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-[#00D9DA]" />
          <span className="text-sm font-bold text-[#1F3154]">
            {typeName} Categories ({categories.length})
          </span>
        </div>
        <button
          onClick={() => {
            setShowCreate(!showCreate);
            setError(null);
          }}
          className="flex items-center gap-1.5 text-sm font-bold text-[#00D9DA] hover:underline"
        >
          <PlusCircle size={14} /> Add
        </button>
      </div>

      {error && (
        <div className="px-6 py-2 bg-red-50 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {showCreate && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`${typeName} category name`}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-[#1F3154] text-white rounded-lg text-sm font-bold hover:bg-[#00D9DA] hover:text-[#1F3154] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Create"}
          </button>
          <button
            onClick={() => {
              setShowCreate(false);
              setNewName("");
            }}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-3 text-xs font-bold text-[#1F3154] uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-xs font-bold text-[#1F3154] uppercase tracking-wider">
              {itemLabel}
            </th>
            <th className="px-6 py-3 text-xs font-bold text-[#1F3154] uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                No {typeName.toLowerCase()} categories yet.
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm w-full"
                    />
                  ) : (
                    <span className="font-bold text-[#1F3154]">{cat.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {cat.itemCount} {itemLabel.toLowerCase()}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === cat.id ? (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={saveEdit}
                        disabled={loading}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        {loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 text-gray-400 hover:text-[#1F3154] hover:bg-gray-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
