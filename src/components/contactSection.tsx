import { motion } from "framer-motion";

export function ContactSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative contact-section h-[150px] md:h-[300px] w-full overflow-hidden rounded-3xl shadow-2xl border border-white/5"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/abstract-flow-shape.png')] bg-cover bg-center opacity-30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-4">
          Have an idea?
        </h2>

        <p className="text-md md:text-lg text-white/80 max-w-lg drop-shadow-md">
          Whether it's a creative spark, a new project, or a wild AI experiment — 
          let's bring it to life together!
        </p>

        <motion.a
          href="himanshusangshetty@gmail.com"
          className="mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </motion.a>
      </div>

      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-3xl" />
    </motion.div>
  );
}
