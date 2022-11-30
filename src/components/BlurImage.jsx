import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function BlurImage({ imageUrl }) {
  const [isLoading, setLoading] = useState(true);
  return (
    <Link href="/marketplace">
      <div className="group cursor-pointer">
        <div className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            alt=""
            src={imageUrl}
            layout="fill"
            objectFit="cover"
            className={cn(
              "rounded-t-[7px] object-cover object-top duration-700 ease-in-out group-hover:opacity-75",
              isLoading
                ? "scale-110 blur-2xl grayscale"
                : "scale-100 blur-0 grayscale-0"
            )}
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
      </div>
    </Link>
  );
}
