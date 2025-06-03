import Image from "next/image";
import Link from "next/link";
// if we don't want to declare the width and height, we can import image in this way
import bg from "@/public/bg.png";

export default function Home() {
  return (
    <main className="mt-24 ">
      <Image
        src={bg}
        // fill: means image will occupy all space
        fill
        // placeholder as blur, image will be blur until it loads!!
        placeholder="blur"
        quality={80}
        // this class "object-cover" must be used for IMAGE component instead of background property of CSS
        className="object-cover object-top"
        alt="Mountains and forests with two cabins"
        priority={true}
      />

      <div className="relative z-10 text-center">
        <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
          Welcome to paradise.
        </h1>
        <Link
          href="/cabins"
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Explore luxury cabins
        </Link>
      </div>
    </main>
  );
}
