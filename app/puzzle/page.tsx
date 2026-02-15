"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PhotoPairGame from "@/component/PhotoPairGame";
import ValentinesProposal from "@/component/ValentinesProposal";
import TextFooter from "@/component/TextFooter";
import OrientationGuard from "@/component/OrientationGuard";

const ANIM_DURATION = 2;

export default function Puzzle() {
  const [showValentinesProposal, setShowValentinesProposal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleShowProposal = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowValentinesProposal(true);
    }, ANIM_DURATION * 1000);
  };

  return (
    <>
      {Array.from({ length: 18 }, (_, i) => (
        <link
          key={i}
          rel="preload"
          as="image"
          href={`/game-photos/${i + 1}.avif`}
        />
      ))}
      <OrientationGuard>
        <main className="flex items-center justify-center min-h-screen bg-black overflow-hidden relative">
          {!showValentinesProposal ? (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isTransitioning ? 0 : 1 }}
              transition={{ duration: ANIM_DURATION }}
              className="flex flex-col items-center"
            >
              <PhotoPairGame handleShowProposal={handleShowProposal} />
              <div className="mt-4 md:mt-0">
                <TextFooter />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ANIM_DURATION }}
            >
              <ValentinesProposal />
            </motion.div>
          )}
        </main>
      </OrientationGuard>
    </>
  );
}
