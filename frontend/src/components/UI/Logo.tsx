import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 !text-black dark:!text-white text-base font-semibold transition-colors"
    >
      <div className="w-[30px] h-[30px] bg-primary-500 rounded-lg">
        {/*<Image src="/" alt="Logo" width={30} height={30} />*/}
      </div>
      Auto Offer
    </Link>
  );
};
