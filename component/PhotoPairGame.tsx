"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const imageList = [
  "/game-photos/1.avif",
  "/game-photos/2.avif",
  "/game-photos/3.avif",
  "/game-photos/4.avif",
  "/game-photos/5.avif",
  "/game-photos/6.avif",
  "/game-photos/7.avif",
  "/game-photos/8.avif",
  "/game-photos/9.avif",
  "/game-photos/10.avif",
  "/game-photos/11.avif",
  "/game-photos/12.avif",
  "/game-photos/13.avif",
  "/game-photos/14.avif",
  "/game-photos/15.avif",
  "/game-photos/16.avif",
  "/game-photos/17.avif",
  "/game-photos/18.avif",
];

const imagePairs = imageList.flatMap((image) => [image, image]);

const shuffleArray = (array: string[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

type PhotoPairGameProps = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({ handleShowProposal }: PhotoPairGameProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Shuffle only on client to avoid hydration mismatch
  useEffect(() => {
    setShuffledImages(shuffleArray(imagePairs));
    setIsMounted(true);
  }, []);

  const handleClick = async (index: number) => {
    if (
      selected.length === 2 ||
      matched.includes(index) ||
      selected.includes(index)
    )
      return;

    if (selected.length === 1) {
      const firstIndex = selected[0];
      setSelected((prev) => [...prev, index]);

      if (shuffledImages[firstIndex] === shuffledImages[index]) {
        setMatched((prev) => [...prev, firstIndex, index]);
        setSelected([]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIncorrect([firstIndex, index]);
        setTimeout(() => setIncorrect([]), 1000);
        setTimeout(() => setSelected([]), 1000);
      }
    } else {
      setSelected([index]);
    }
  };

  useEffect(() => {
    if (isMounted && matched.length === imagePairs.length) {
      handleShowProposal();
    }
  }, [matched, handleShowProposal, isMounted]);

  // ✅ Don't render until client-side shuffle is done
  if (!isMounted) return null;

  return (
    <>
      <head>
        {imageList.map((src) => (
          <link
            key={src}
            rel="preload"
            as="image"
            href={src}
            fetchPriority="high"
          />
        ))}
      </head>
      <div className="grid grid-cols-9 gap-1 lg:gap-2 max-w-[95vw] mx-auto place-items-center">
        {/* ✅ Preload using link tags instead of hidden Image components */}
        <div aria-hidden="true" className="hidden">
          {imageList.map((src) => (
            <link key={src} rel="preload" as="image" href={src} />
          ))}
        </div>

        {heartLayout.flat().map((index, i) =>
          index !== null ? (
            <motion.div
              key={i}
              className="w-[11vh] h-[11vh] lg:w-20 lg:h-20 relative cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => handleClick(index)}
              style={{ perspective: "1000px" }}
            >
              {/* Back of card */}
              {!selected.includes(index) && !matched.includes(index) && (
                <motion.div
                  className="w-full h-full bg-gray-300 rounded-sm lg:rounded-md absolute z-10"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ backfaceVisibility: "hidden" }}
                />
              )}

              {/* Front of card */}
              {(selected.includes(index) || matched.includes(index)) && (
                <motion.div
                  className="w-full h-full absolute"
                  initial={{ rotateY: -180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image
                    src={shuffledImages[index]}
                    alt={`Image ${index + 1}`}
                    fill
                    className="rounded-sm lg:rounded-md object-cover"
                    priority={index < 12} // ✅ prioritize first 12 cards
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                  />
                </motion.div>
              )}

              {/* Incorrect flash */}
              {incorrect.includes(index) && (
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full bg-red-500 rounded-sm lg:rounded-md" />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div key={i} className="w-[11vh] h-[11vh] lg:w-20 lg:h-20" />
          ),
        )}
      </div>
    </>
  );
}