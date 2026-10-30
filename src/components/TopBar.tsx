import { SOCIAL_LINKS } from "@/data/inventario";
import {
  SocialIconFacebook,
  SocialIconInstagram,
  SocialIconTikTok,
} from "@/components/SocialIcons";
import { CartIcon } from "@/components/CartIcon";

const SOCIAL_BUTTON_CLASS =
  "inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-violet-500/50 bg-zinc-900/80 text-zinc-100 hover:border-cyan-400/70 hover:text-cyan-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition";

const NAV_LINK_CLASS =
  "hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 rounded";

export function TopBar() {
  return (
    <div className="w-full border-b border-violet-600/60 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className={SOCIAL_BUTTON_CLASS} aria-label="Facebook">
            <SocialIconFacebook className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
          </a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className={SOCIAL_BUTTON_CLASS} aria-label="Instagram">
            <SocialIconInstagram className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className={SOCIAL_BUTTON_CLASS} aria-label="TikTok">
            <SocialIconTikTok className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
          </a>
        </div>

        <div className="flex items-center gap-6 sm:gap-10">
          <nav className="flex items-center gap-10 text-sm sm:text-base font-semibold tracking-[0.12em] text-zinc-100/90">
            <a href="#catalogo" className={NAV_LINK_CLASS}>CATÁLOGO</a>
            <a href="/preguntas" className={NAV_LINK_CLASS}>PREGUNTAS</a>
            <a href="https://maps.app.goo.gl/aRGvf659MnZWpxrRA" className={NAV_LINK_CLASS}>UBICACIÓN</a>
          </nav>
          <CartIcon />
        </div>
      </div>
    </div>
  );
}
