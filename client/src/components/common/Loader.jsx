function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-8 text-center">
      <div>
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#C69A4E]" />
        <p className="mt-4 text-sm text-[#94A3B8]">{text}</p>
      </div>
    </div>
  );
}

export default Loader;