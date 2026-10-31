"use client";

import { useState } from "react";
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

const NAV_LINKS = [
  { href: "#catalogo", label: "CATÁLOGO" },
  { href: "/preguntas", label: "PREGUNTAS" },
  { href: "https://maps.app.goo.gl/aRGvf659MnZWpxrRA", label: "UBICACIÓN" },
];

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Alterna el menú de navegación en pantallas pequeñas
  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

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
          <nav className="hidden md:flex items-center gap-10 text-sm sm:text-base font-semibold tracking-[0.12em] text-zinc-100/90">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={NAV_LINK_CLASS}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <CartIcon />
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-violet-500/50 bg-zinc-900/80 text-zinc-100 hover:border-cyan-400/70 hover:text-cyan-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition md:hidden"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="menu-movil"
          className="md:hidden border-t border-violet-600/40 px-4 py-3 flex flex-col items-end gap-1 text-right text-sm font-semibold tracking-[0.12em] text-zinc-100/90"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${NAV_LINK_CLASS} rounded-lg px-3 py-3 hover:bg-zinc-900`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
