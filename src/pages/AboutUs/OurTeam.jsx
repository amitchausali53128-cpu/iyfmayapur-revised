import React from "react";
import { motion } from "motion/react";
import Img1 from "../../assets/OurTeam/Img1.png";
import Img2 from "../../assets/OurTeam/Img2.png";
import Img3 from "../../assets/OurTeam/Img3.png";
import Img4 from "../../assets/OurTeam/Img4.png";
import Img5 from "../../assets/OurTeam/Img5.png";
import Img6 from "../../assets/OurTeam/Img6.png";

const team=[
  {name:"Hg Subhekshna Prabhu ji",image:Img1,role:"Co Director"},
  {name:"Hg Tirthanga Nitai Prabhu ji",image:Img2,role:"Chief Advisor"},
  {name:"Nitaichandra Nimai Prabhu ji",image:Img3,role:"Chairman"},
  {name:"Hg Achyut Nam Das",image:Img4,role:"Secretary"},
  {name:"Hg Istadeva Gopal Das",image:Img5,role:"Executive Secretary"},
  {name:"Hg Somapati Prabhu ji",image:Img6,role:"Educational Coordinator"}
];

const OurTeam=()=>(
<section className="relative overflow-hidden bg-[#103c2d] py-10 md:py-14">
  <style>{`
    @keyframes teamScroll{
      from{transform:translateX(0)}
      to{transform:translateX(-1512px)}
    }
    .team-track{animation:teamScroll 35s linear infinite}
    .team-track:hover{animation-play-state:paused}
  `}</style>

  <div className="absolute left-0 top-0 h-3 w-full bg-linear-to-r from-[#f5c451] via-[#fff1a8] to-[#f5c451] opacity-90"/>
  <div className="absolute -top-10 left-1/2 h-20 w-[110%] -translate-x-1/2 rounded-[50%] bg-[#f7f3e8]"/>

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,196,81,.10),transparent_50%)]"/>

  <div className="relative mx-auto max-w-6xl px-5 pt-4">
    <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-7 flex items-end justify-between gap-5">
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.25em] text-[#f5c451]">Our Team</p>
        <h2 className="font-serif text-2xl font-semibold text-white md:text-3xl lg:text-4xl">
          Guided by Devotion. <span className="text-[#f5c451]">United by a Vision.</span>
        </h2>
        <p className="mt-1 text-xs text-white/60 md:text-sm">Meet the dedicated souls who are working tirelessly to inspire and empower youth.</p>
      </div>

    </motion.div>

    <div className="overflow-hidden px-1 py-2">
      <div className="team-track flex w-max gap-3">
        {[...team,...team].map((member,i)=>(
          <motion.div key={`${member.name}-${i}`} whileHover={{ y: -5 }} className="h-80 w-55 shrink-0 overflow-hidden rounded-xl border border-[#d7b84b]/40 bg-[#174737] shadow-lg">

            <div className="flex h-62.5 items-center justify-center overflow-hidden bg-[#f1eee5]">
              <img src={member.image} alt={member.name} className="h-full w-full object-contain transition duration-500"/>
            </div>

            <div className="flex items-center justify-between gap-2 px-3 py-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-white md:text-sm">{member.name}</h3>
                <p className="mt-1 truncate text-[12px] text-white/55 md:text-xs">{member.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>

  <div className="absolute bottom-0 left-0 h-3 w-full bg-linear-to-r from-[#f5c451] via-[#fff1a8] to-[#f5c451] opacity-90"/>
  <div className="absolute -bottom-9 left-1/2 h-20 w-[110%] -translate-x-1/2 rounded-[50%] bg-[#f7f3e8]"/>
</section>
);

export default OurTeam;