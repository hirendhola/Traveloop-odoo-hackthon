import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  baseQuery: Record<string, string | undefined>;
};

function buildHref(baseQuery: Record<string, string | undefined>, page: number) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(baseQuery)) {
    if (v) p.set(k, v);
  }
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return qs ? `/cities?${qs}` : "/cities";
}

function buildPageList(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];

  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) pages.push("ellipsis");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("ellipsis");

  pages.push(totalPages);
  return pages;
}

const itemBaseCls =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 text-sm text-[#F0EDE6] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[#E8C547]";

const activeCls =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[#E8C547] bg-[rgba(232,197,71,0.12)] px-3 text-sm font-medium text-[#E8C547]";

const disabledCls =
  "inline-flex h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3 text-sm text-[rgba(240,237,230,0.25)]";

export function CitiesPagination({ currentPage, totalPages, baseQuery }: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="mx-auto flex w-full justify-center pt-2"
    >
      <ul className="flex flex-wrap items-center gap-1.5">
        {/* Previous */}
        <li>
          {hasPrev ? (
            <Link
              href={buildHref(baseQuery, prevPage)}
              prefetch
              scroll={false}
              className={itemBaseCls}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:ml-1 sm:inline">Previous</span>
            </Link>
          ) : (
            <span className={disabledCls} aria-disabled>
              <ChevronLeft size={16} />
              <span className="hidden sm:ml-1 sm:inline">Previous</span>
            </span>
          )}
        </li>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <li key={`e-${idx}`} className="px-1 text-[rgba(240,237,230,0.4)]">
              <MoreHorizontal size={14} />
            </li>
          ) : (
            <li key={p}>
              {p === currentPage ? (
                <span className={activeCls} aria-current="page">
                  {p}
                </span>
              ) : (
                <Link
                  href={buildHref(baseQuery, p)}
                  prefetch
                  scroll={false}
                  className={itemBaseCls}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </Link>
              )}
            </li>
          )
        )}

        {/* Next */}
        <li>
          {hasNext ? (
            <Link
              href={buildHref(baseQuery, nextPage)}
              prefetch
              scroll={false}
              className={itemBaseCls}
              aria-label="Next page"
            >
              <span className="hidden sm:mr-1 sm:inline">Next</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className={disabledCls} aria-disabled>
              <span className="hidden sm:mr-1 sm:inline">Next</span>
              <ChevronRight size={16} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
