import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      {/* 1. Correctly size images in modern formats like webp 
      2. Prevents layour shits, forces us to insert height and width
      3. Enable lazy loading, to prefetch or not larger size images
      */}
      <Image
        src={logo}
        height="60"
        quality={50}
        width="60"
        priority={false}
        alt="The Wild Oasis logo"
      />
      <span className="text-xl font-semibold text-primary-100">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
