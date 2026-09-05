/** Blocking theme script — must live in <head> (server), not inside a client component. */
export function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var d=document.documentElement,t=localStorage.getItem("theme")||"system",r=t==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t;d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r}catch(e){}})();`,
      }}
    />
  );
}
