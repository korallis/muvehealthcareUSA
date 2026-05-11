import { authGuard } from "@/lib/authGuard";
import Link from "next/link";
import {
  FileText,
  Newspaper,
  Calendar,
  Plus,
  ArrowUpRight,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import { CreatePageButton } from "@/components/dashboard/CreatePageButton"; // We will create this below
import InviteAdminForm from "@/components/dashboard/InviteAdminForm";

export default async function DashboardPage() {
  await authGuard("admin");

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-10 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#00D9DA] font-bold text-sm uppercase tracking-widest mb-1">
            <LayoutDashboard size={16} />
            Control Center
          </div>
          <h1 className="text-4xl font-lexendBold text-[#1F3154] tracking-tight">
            Admin Dashboard<span className="text-[#00D9DA]">.</span>
          </h1>
          <p className="text-gray-500 mt-2 font-lexend text-lg">
            Manage your digital footprint and community engagement.
          </p>
        </div>

        {/* <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#1F3154] flex items-center justify-center text-white font-bold">
                A
            </div>
            <span className="font-semibold text-[#1F3154]">Admin User</span>
        </div> */}
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Existing Cards */}
        <DashboardCard
          title="Job Posts"
          description="Insights, industry updates, and expert articles."
          href="/dashboard/jobs"
          createHref="/dashboard/jobs/create"
          icon={<FileText className="text-[#00D9DA]" size={28} />}
          count="24 Posts"
        />

        <DashboardCard
          title="News"
          description="Publish official company announcements."
          href="/dashboard/news"
          createHref="/dashboard/news/create"
          icon={<Newspaper className="text-[#00D9DA]" size={28} />}
          count="12 Articles"
        />

        <DashboardCard
          title="Events"
          description="Schedules for wellness workshops and seminars."
          href="/dashboard/events"
          createHref="/dashboard/events/create"
          icon={<Calendar className="text-[#00D9DA]" size={28} />}
          count="8 Active"
        />

        <DashboardCard
          title="FAQs"
          description="Common questions and answers for users."
          href="/dashboard/faq"
          createHref="/dashboard/faq/create"
          icon={<Calendar className="text-[#00D9DA]" size={28} />}
          count="8 Active"
        />

        <DashboardCard
          title="Quick Links"
          description="Handy files and emergency contact links."
          href="/dashboard/quicklinks"
          createHref="/dashboard/quicklinks/create"
          icon={<Calendar className="text-[#00D9DA]" size={28} />}
          count="8 Active"
        />

        <DashboardCard
          title="Stories"
          description="Community impact and member stories."
          href="/dashboard/stories"
          createHref="/dashboard/stories/create"
          icon={<Calendar className="text-[#00D9DA]" size={28} />}
          count="8 Active"
        />

        {/* UPDATED SITE PAGES CARD */}
        <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#1F3154]/5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-[#00D9DA]/5 rounded-full blur-2xl group-hover:bg-[#00D9DA]/10 transition-colors" />
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#1F3154] group-hover:text-white transition-colors duration-300">
                <Globe className="text-[#00D9DA]" size={28} />
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                Visual Editor
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#1F3154] mb-2">
              Site Pages
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Visually design and build new routes like /about or /services.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/pages"
              className="flex-1 bg-[#1F3154] text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-[#1F3154]/90 transition-all flex items-center justify-center gap-2"
            >
              View All <ArrowUpRight size={16} />
            </Link>
            {/* THIS CLIENT BUTTON TRIGGERS THE NEW PAGE CREATION */}
            <CreatePageButton />
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          {/* <div className="p-2 bg-[#1F3154] rounded-lg text-white">
              <Users size={20} />
           </div> */}
          <h2 className="text-2xl font-lexendBold text-[#1F3154]">
            Team Management
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* The Invite Form */}
          <InviteAdminForm />

          {/* Informational Card for Team */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-200">
            <h3 className="text-[#1F3154] font-lexendBold text-lg mb-2">
              Security Note
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-lexend">
              Inviting a new admin gives them full access to the control center,
              including the ability to delete content and manage other users.
              <br />
              <br />
              Invitation links are single-use and expire automatically after 48
              hours for security purposes.
            </p>
          </div>
        </div>
      </div>

      {/* System Status */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
         <h3 className="text-[#1F3154] font-bold text-xl mb-4">System Status</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 font-bold uppercase">Database</p>
                <p className="text-green-500 font-bold">Connected</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 font-bold uppercase">Role</p>
                <p className="text-[#1F3154] font-bold">Administrator</p>
            </div>
         </div>
      </div> */}
    </div>
  );
}

interface CardProps {
  title: string;
  description: string;
  href: string;
  createHref: string;
  icon: React.ReactNode;
  count: string;
}

function DashboardCard({
  title,
  description,
  href,
  createHref,
  icon,
  count,
}: CardProps) {
  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#1F3154]/5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-[#00D9DA]/5 rounded-full blur-2xl group-hover:bg-[#00D9DA]/10 transition-colors" />
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#1F3154] group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-tighter">
            {count}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#1F3154] mb-2">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={href}
          className="flex-1 bg-[#1F3154] text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-[#1F3154]/90 transition-all flex items-center justify-center gap-2"
        >
          View All <ArrowUpRight size={16} />
        </Link>
        <Link
          href={createHref}
          title="Quick Create"
          className="bg-[#00D9DA] text-[#1F3154] p-3 rounded-xl hover:scale-105 transition-transform"
        >
          <Plus size={20} strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
}
