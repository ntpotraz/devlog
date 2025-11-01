type DevlogProps = {
  className?: string;
};

function Devlog({ className = "" }: DevlogProps) {
  return (
    <div
      className={`flex w-full items-center justify-center gap-6 text-orange-300 ${className}`.trim()}
    >
      <h1 className="devFont my-0 text-2xl tracking-[0.55em] drop-shadow-[0_0_16px_rgba(255,124,45,0.35)] sm:text-3xl md:text-[40px]">
        devlog
      </h1>
    </div>
  );
}

export default Devlog;
