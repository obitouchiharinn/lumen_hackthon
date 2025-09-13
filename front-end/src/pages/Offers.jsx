import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const offerColors = [
  "bg-gradient-to-tr from-pink-500 to-yellow-400",
  "bg-gradient-to-tr from-blue-500 to-cyan-400",
  "bg-gradient-to-tr from-purple-500 to-indigo-400",
  "bg-gradient-to-tr from-green-500 to-lime-400",
  "bg-gradient-to-tr from-red-500 to-orange-400",
];

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("offers").select("name, code, description");
      if (!error) setOffers(data || []);
      setLoading(false);
    };
    fetchOffers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-amber-400 drop-shadow-lg">
        <span role="img" aria-label="gift">🎁</span> Hot Offers For You
      </h2>
      {loading ? (
        <div className="text-center text-xl animate-pulse">Loading...</div>
      ) : offers.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">No offers available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl shadow-xl p-8 text-white flex flex-col items-center justify-center transition-transform hover:scale-105 ${offerColors[idx % offerColors.length]}`}
            >
              <div className="absolute top-4 right-4 text-3xl opacity-30 select-none pointer-events-none">
                🎉
              </div>
              <div className="text-2xl font-bold mb-2 tracking-tight drop-shadow-lg flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
                {offer.name}
              </div>
              <div className="text-lg font-mono bg-white/20 px-4 py-2 rounded-xl mb-3 border border-white/30 tracking-widest shadow-inner">
                {offer.code}
              </div>
              {offer.description && (
                <div className="text-sm text-white/90 text-center mb-2 italic">
                  {offer.description}
                </div>
              )}
              <button
                className="mt-4 px-6 py-2 rounded-full bg-white/90 text-gray-900 font-semibold shadow hover:bg-white hover:text-black transition-all border border-white/30"
                onClick={() => {
                  navigator.clipboard.writeText(offer.code);
                }}
              >
                Copy Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
