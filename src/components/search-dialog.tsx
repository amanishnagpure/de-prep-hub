"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Map, Search as LucideSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import type { SearchItem } from "@/lib/content";
import { createSearchIndex, getSearchHref } from "@/lib/search";

const SearchContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function SearchProvider({
  children,
  items,
}: {
  children: React.ReactNode;
  items: SearchItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const fuse = React.useMemo(() => createSearchIndex(items), [items]);

  const results = React.useMemo(() => {
    if (!query.trim()) return items.slice(0, 12);
    return fuse.search(query).map((result) => result.item);
  }, [fuse, items, query]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    router.push(getSearchHref(item));
  };

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Topics, SQL notes, practice, interview"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Results">
              {results.map((item) => (
                <CommandItem
                  key={`${item.type}-${item.slug}`}
                  value={`${item.type}-${item.slug}`}
                  onSelect={() => handleSelect(item)}
                  className="rounded-xl"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {item.type === "roadmap" ? (
                      <Map className="size-4" />
                    ) : (
                      <FileText className="size-4" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-medium">{item.title}</span>
                    {item.description ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </SearchContext.Provider>
  );
}

export function SearchTrigger() {
  const context = React.useContext(SearchContext);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden h-9 gap-2 rounded-xl border-border bg-background/50 text-muted-foreground  sm:flex"
        onClick={() => context?.setOpen(true)}
      >
        <LucideSearch className="size-4" />
        <span>Search</span>
        <CommandShortcut>⌘K</CommandShortcut>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl sm:hidden"
        aria-label="Search"
        onClick={() => context?.setOpen(true)}
      >
        <LucideSearch className="size-4" />
      </Button>
    </>
  );
}
