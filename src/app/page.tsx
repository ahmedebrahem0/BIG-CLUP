import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ClipboardList,
  FolderTree,
  LayoutGrid,
  Package2,
  Sparkles,
} from "lucide-react";

const sections = [
  {
    title: "الأندية",
    description: "إدارة دليل الأندية، الإضافة، التعديل، والحذف من مكان واحد.",
    icon: Building2,
    href: "/clubs",
  },
  {
    title: "الفئات",
    description: "هيكل هرمي مرن للفئات الرئيسية والفرعية مع واجهة عرض واضحة.",
    icon: FolderTree,
    href: "/categories",
  },
  {
    title: "التشيك ليست",
    description: "عناصر متابعة جاهزة لإعادة الاستخدام على مستوى item و club item.",
    icon: ClipboardList,
    href: "/checklists",
  },
  {
    title: "الأصناف",
    description: "قاعدة الأصناف الرئيسية وربطها بالفئات مع عرض حالات المتابعة.",
    icon: Package2,
    href: "/items",
  },
  {
    title: "مساحة العمل",
    description: "تشغيل فعلي لكل نادي: الكميات، الأصناف، والحالة التنفيذية لكل checklist.",
    icon: LayoutGrid,
    href: "/club-items",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(43,108,94,0.14),transparent_24%),linear-gradient(180deg,#fafaf8_0%,#f5f6f4_45%,#edf1ef_100%)] px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-between gap-12">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs tracking-[0.28em] text-muted-foreground uppercase shadow-sm">
              <Sparkles className="size-3.5 text-primary" />
              Big Club Admin
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              لوحة تشغيل  لإدارة الأندية والأصناف ومسارات التنفيذ.
            </h1>
            {/* <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              بدأنا الآن من foundation قوي جدًا: design system هادئ، بنية RTK Query واضحة،
              ومسار تنفيذ feature-by-feature حتى نغلق كل جزء على أعلى مستوى من الجودة.
            </p> */}
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-secondary px-4 py-5">
                <p className="text-xs text-muted-foreground">Current Focus</p>
                <p className="mt-2 text-lg font-semibold">Foundation + UI Shell</p>
              </div>
              <div className="rounded-[1.5rem] bg-primary px-4 py-5 text-primary-foreground">
                <p className="text-xs/6 text-primary-foreground/80">Next Step</p>
                <p className="mt-2 text-lg font-semibold">Clubs CRUD End-to-End</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-5">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-[2rem] border border-white/80 bg-white/78 p-5 shadow-[0_25px_60px_-44px_rgba(15,23,42,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_70px_-42px_rgba(15,23,42,0.36)]"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {section.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  افتح القسم
                  <ArrowLeft className="size-4 transition group-hover:-translate-x-1" />
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
