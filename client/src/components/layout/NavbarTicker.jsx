const tickerHook = "BE TAKEN SERIOUSLY ONLINE";

function NavbarTicker() {
  return (
    <div className="h-7 overflow-hidden border-y border-[#C4A77D]/15 bg-[#080808]/94">
      <div className="wd-navbar-ticker-track flex h-full w-max items-center">
        <span className="flex h-full items-center gap-4 px-5 text-[0.64rem] font-bold uppercase tracking-[0.26em] text-[#D9D4CC]/80">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C4A77D]" />
          {tickerHook}
        </span>
      </div>
    </div>
  );
}

export default NavbarTicker;
