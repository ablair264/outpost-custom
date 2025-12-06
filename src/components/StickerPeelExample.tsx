import StickerPeel from './StickerPeel';

export default function StickerPeelExample() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <StickerPeel
        imageSrc="/images/sticker.webp"
        text="OUTPOST"
        textColor="#FFD700"
        textStroke="#1a1a1a"
        textSize={28}
        textRotate={-2}
        width={240}
        rotate={43}
        peelBackHoverPct={13}
        peelBackActivePct={40}
        shadowIntensity={0.6}
        lightingIntensity={0.1}
        initialPosition={{ x: -100, y: 100 }}
      />
    </div>
  );
}
