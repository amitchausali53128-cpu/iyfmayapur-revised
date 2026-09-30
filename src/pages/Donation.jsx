import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  FiArrowRight, FiBookOpen, FiCheckCircle, FiDownload, FiGift,
  FiHeart, FiHome, FiLock, FiMail, FiMapPin, FiPhone, FiShield, FiUsers
} from "react-icons/fi";
import { cloudinaryAsset } from "../lib/cloudinary";
import HeroImg from "../assets/DonationHero.png";

const amounts = [501,1100,2100,3001,4001,5001];

const initialForm = {
  amount:"",first_name:"",middle_name:"",last_name:"",email:"",mobile:"",
  pan_card:"",address_1:"",address_2:"",pin_code:"",district:"",
  city:"",state:"",country:"India"
};

const images = {
  education:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Gita_Bhavan_-_ISKCON_Campus_-_Mayapur_-_Nadia_2017-08-15_2023.JPG",
  youth:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Kirtan_-_ISKCON_Campus_-_Nadia_2017-08-15_2309.JPG",
  food:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Visitors_Waiting_For_Prasad_-_ISKCON_Campus_-_Mayapur_-_Nadia_20170815123655.jpg",
  festival:"https://commons.wikimedia.org/wiki/Special:Redirect/file/JANMASTAMI_MAHA_AVISHEK_ISKCON_(1).jpg",
  seva:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Prasadam2.jpg",
  kirtan:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Kirtan_-_ISKCON_Campus_-_Nadia_2017-08-15_2308.JPG",
  program:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Book_And_Life_Membership_Stal_-_ISKCON_Campus_-_Mayapur_-_Nadia_2017-08-15_1877.JPG",
  support:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Radha_Krishna_ISKCON_Mayapur.jpg"
};

const supportCards = [
  [images.education,FiBookOpen,"Spiritual Education","Supporting youth through Bhagavad Gita study, spiritual classes and value-based learning."],
  [images.youth,FiUsers,"Youth Empowerment","Helping young devotees grow spiritually, discover their purpose and serve society."],
  [images.food,FiGift,"Food & Seva","Supporting prasadam distribution and meaningful devotional seva activities."],
  [images.festival,FiHeart,"Festivals & Outreach","Supporting kirtan, festivals, spiritual gatherings and outreach programs."]
];

const serviceCards = [
  [images.seva,"One-Time Donation","Make a single contribution towards spiritual education, seva and youth initiatives."],
  [images.kirtan,"Monthly Support","Become a regular supporter and help sustain our spiritual services throughout the year."],
  [images.program,"Sponsor a Program","Support Bhagavad Gita classes, youth programs, festivals and spiritual activities."],
  [images.support,"General Support","Contribute towards the overall development of IYF Mayapur and its devotional mission."]
];

const impactItems = [
  [FiUsers,"500+","Youth Engaged","Through various spiritual programs"],
  [FiBookOpen,"100+","Study Sessions","Conducted every year"],
  [FiGift,"50,000+","Prasadam Served","To devotees and visitors"],
  [FiHeart,"10+","Major Festivals","Supported annually"]
];

const fieldIcons = {
  first_name:FiUsers,middle_name:FiUsers,last_name:FiUsers,email:FiMail,
  mobile:FiPhone,pan_card:FiShield,address_1:FiHome,address_2:FiHome,
  pin_code:FiMapPin,district:FiMapPin,city:FiMapPin,state:FiMapPin,country:FiMapPin
};

const inputStyles =
  "w-full rounded-xl border border-[#dce8df] bg-[#f9fcf9] px-4 py-3 text-sm text-[#183e3b] outline-none transition-all placeholder:text-[#a0aaa5] focus:border-[#08745e] focus:bg-white focus:ring-4 focus:ring-[#08745e]/10";

async function readApiResponse(response){
  const body=await response.text();
  if(!body.trim()) throw new Error(response.ok?"The payment server returned an empty response.":"The payment server is unavailable. Start it with `npm run payment-server` and try again.");
  try{return JSON.parse(body)}catch{throw new Error("The payment server returned an invalid response. Please try again.")}
}

function Leaf({className=""}){
  return <motion.div animate={{y:[0,-10,0],rotate:[0,6,-3,0]}} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}} className={`pointer-events-none absolute ${className}`}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M9 38C10 21 21 9 39 10C38 28 27 39 9 38Z" fill="#8DAE78" opacity=".35"/>
      <path d="M11 37C19 29 27 20 37 11" stroke="#52744B" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
    </svg>
  </motion.div>
}

function Heading({eyebrow,children,description}){
  return <motion.div initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}} className="mx-auto max-w-3xl text-center">
    <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#16735f]">{eyebrow}</p>
    <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#173b38] sm:text-4xl lg:text-[44px]">{children}</h2>
    {description&&<p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#68756f] sm:text-base">{description}</p>}
  </motion.div>
}

function Field({label,name,value,onChange,required=false,type="text",full=false}){
  const Icon=fieldIcons[name]||FiHeart;
  return <label className={full?"block sm:col-span-2":"block"}>
    <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#43524c]"><Icon className="text-[#08745e]"/>{label}</span>
    <input required={required} type={type} name={name} value={value} onChange={onChange} inputMode={name==="mobile"?"numeric":undefined} className={inputStyles}/>
  </label>
}

export default function Donation(){
  const [form,setForm]=useState(initialForm);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [payment,setPayment]=useState(null);
  const [paymentToken,setPaymentToken]=useState("");

  /* PAYMENT LOGIC — UNCHANGED */
  useEffect(()=>{
    const search=new URLSearchParams(window.location.search);
    const token=search.get("payment_token");

    if(token){
      setPaymentToken(token);
      fetch(`/api/payment/status?token=${encodeURIComponent(token)}`)
        .then(async response=>{
          const data=await readApiResponse(response);
          if(!response.ok) throw new Error(data.error||"Unable to verify payment.");
          setPayment(data);
        })
        .catch(err=>setError(err.message));
      return;
    }

    const referenceId=search.get("reference_id");
    if(!referenceId)return;

    fetch(`/api/payment/status/${encodeURIComponent(referenceId)}`)
      .then(async response=>{
        const data=await readApiResponse(response);
        if(!response.ok) throw new Error(data.error||"Unable to verify payment.");
        setPayment(data);
      })
      .catch(err=>setError(err.message));
  },[]);

  const updateField=e=>setForm(current=>({...current,[e.target.name]:e.target.value}));

  const beginPayment=async e=>{
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      const response=await fetch("/api/payment/initiate",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });

      const data=await readApiResponse(response);

      if(!response.ok)throw new Error(data.error||"Unable to start payment.");
      if(!data.payment_url)throw new Error("The payment server did not return a checkout URL.");

      window.location.assign(data.payment_url);
    }catch(err){
      setError(err.message);
      setLoading(false);
    }
  };

  if(payment?.status==="success")return(
    <div className="min-h-screen bg-[#fffaf0] px-5 py-10">
      <section className="flex min-h-[80vh] items-center justify-center">
        <motion.div initial={{opacity:0,y:40,scale:.96}} animate={{opacity:1,y:0,scale:1}} className="w-full max-w-2xl rounded-[30px] bg-white p-7 text-center shadow-[0_25px_80px_rgba(20,60,45,.12)] sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f5e9] text-4xl text-[#08745e]"><FiCheckCircle/></div>
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[.3em] text-[#08745e]">Payment Successful</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#173b38] sm:text-5xl">{payment.first_name?`Thank you, ${payment.first_name}.`:"Thank you for your offering."}</h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#68756f]">Your contribution helps us serve and inspire the youth community of Sridham Mayapur.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f4f8f4] p-4 text-left"><span className="text-xs text-[#7b8781]">Donation amount</span><strong className="mt-1 block text-lg text-[#173b38]">₹{Number(payment.amount).toLocaleString("en-IN")}</strong></div>
            <div className="rounded-2xl bg-[#f4f8f4] p-4 text-left"><span className="text-xs text-[#7b8781]">Reference</span><strong className="mt-1 block break-all text-sm text-[#173b38]">{payment.reference_id}</strong></div>
          </div>

          <a className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#08745e] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#05634f]" href={paymentToken?`/api/payment/receipt?token=${encodeURIComponent(paymentToken)}`:`/api/payment/receipt/${encodeURIComponent(payment.reference_id)}`}>
            <FiDownload/> Download PDF receipt
          </a>
        </motion.div>
      </section>
    </div>
  );

  if(payment&&payment.status!=="success")return(
    <div className="min-h-screen bg-[#fffaf0] px-5 py-10">
      <section className="flex min-h-[80vh] items-center justify-center">
        <motion.div initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} className="w-full max-w-2xl rounded-[30px] bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3df] text-3xl text-[#bd8120]"><FiHeart/></div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[.3em] text-[#08745e]">Payment Not Completed</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#173b38]">We could not confirm your donation.</h1>
          <p className="mt-5 leading-7 text-[#68756f]">No receipt has been issued. Please retry, or contact IYF Mayapur with reference <strong>{payment.reference_id}</strong>.</p>
          <a href="/donation" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08745e] px-7 py-3.5 font-bold text-white">Try Again <FiArrowRight/></a>
        </motion.div>
      </section>
    </div>
  );

  return(
    <div className="overflow-x-clip bg-[#fffdf8] text-[#183e3b]">

      {/* HERO */}
      <section className="relative h-[500px] overflow-hidden sm:h-[520px]">
        <motion.img
          initial={{scale:1.03}}
          animate={{scale:1}}
          transition={{duration:1.4}}
          src={HeroImg}
          alt="Mayapur temple"
          className="absolute inset-0 h-full w-full object-cover object-center "
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062d25]/95 via-[#062d25]/65 to-[#062d25]/10"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
        <Leaf className="right-[12%] top-[15%] hidden lg:block"/>

        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] items-center px-5 sm:px-8 lg:px-12">
          <motion.div initial={{opacity:0,x:-45}} animate={{opacity:1,x:0}} transition={{duration:.8}} className="max-w-[650px] text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.25em] backdrop-blur-md">
              <span className="text-[#f5d477]">✦</span> Support IYF Mayapur
            </div>

            <h1 className="font-serif text-4xl font-semibold leading-[.96] tracking-[-.04em] sm:text-5xl lg:text-[68px]">
              Be a Part of<br/>Something <span className="text-[#f5c957] italic">Divine</span>.
            </h1>

            <p className="mt-5 max-w-[560px] text-sm leading-7 text-white/85 sm:text-base">
              Your generous contribution helps us empower youth, spread spiritual knowledge, and serve the mission of Sri Sri Radha Madhava in Mayapur.
            </p>

            <motion.a whileHover={{scale:1.05,x:5}} href="#donate" className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#f5c957] px-7 py-3.5 text-sm font-bold text-[#183e3b]">
              Donate Now <FiArrowRight/>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* WHY SUPPORT */}
      <section className="relative overflow-hidden bg-[#fffdf8] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <Leaf className="left-4 top-8 opacity-60"/>
        <Heading eyebrow="Why Your Support Matters" description="Your contribution directly supports meaningful initiatives that inspire, educate and empower youth in their spiritual journey.">
          Together We Can Create a <span className="text-[#16735f] italic">Brighter Future</span>
        </Heading>

        <div className="mx-auto mt-11 grid max-w-[1200px] grid-cols-2 gap-7 lg:grid-cols-4 lg:gap-5">
          {supportCards.map(([image,Icon,title,text],i)=>(
            <motion.article key={title} initial={{opacity:0,y:45}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} whileHover={{y:-9}} className="group overflow-hidden rounded-[18px] bg-white  shadow-xl/30">
              <div className="relative h-[175px] overflow-hidden sm:h-[260px]">
                <motion.img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" whileHover={{scale:1.1}} transition={{duration:.8}}/>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"/>
                {/* <div className="absolute -bottom-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-[#fffdf8] text-2xl text-[#d99d22] shadow-lg"><Icon/></div> */}
              </div>
              <div className="min-h-[155px] px-1.5 pb-2 pt-2 text-center sm:px-2">
                <h3 className="italic text-lg font-semibold text-[#d99d22] sm:text-xl">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#68756f] sm:text-sm sm:leading-6">{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* WAYS TO SERVE */}
      <section className="relative overflow-hidden bg-[#edf6ef] px-5 py-8 sm:px-8 lg:px-12 lg:py-8">
        <Leaf className="left-[3%] top-[25%] opacity-50"/>
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#15705e]">Ways You Can Serve</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#173b38] sm:text-4xl">Different Ways to <span className="text-[#16735f] italic">Make an Impact</span></h2>
            </div>
            <p className="max-w-[350px] text-sm leading-6 text-[#65736d]">Every contribution, big or small, helps us continue our services and expand our reach.</p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
  {serviceCards.map(([image, title, text], i) => (
    <motion.article
      key={title}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative h-[230px] overflow-hidden rounded-[18px] shadow-xl/30 sm:h-[280px]"
    >
      <motion.img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        whileHover={{ scale: 1.07 }}
        transition={{ duration: 0.8 }}
      />

      {/* Image overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071c18]/95 via-[#071c18]/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-semibold leading-tight text-white sm:text-2xl">
              {title}
            </h3>

            <p className="mt-1.5 line-clamp-2 max-w-[230px] text-[10px] leading-4 text-white/80 sm:text-xs sm:leading-5">
              {text}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  ))}
</div>
        </div>
      </section>

      {/* DONATION */}
      <section id="donate" className="relative bg-[#fffdf8] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] items-start gap-8 lg:grid-cols-[1.08fr_.92fr]">

          {/* FORM */}
          <motion.form initial={{opacity:0,x:-45}} whileInView={{opacity:1,x:0}} viewport={{once:true}} onSubmit={beginPayment} className="rounded-[26px] border border-[#e5eee7] bg-white p-5 shadow-xl/30 sm:p-7 lg:p-8">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf6ef] text-xl text-[#08745e]"><FiHeart/></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#15705e]">Make a Donation</p>
                <h2 className="mt-1 font-serif text-3xl font-semibold text-[#173b38] sm:text-4xl">Donate <span className="text-[#16735f] italic">Securely</span></h2>
                <p className="mt-2 text-sm leading-6 text-[#68756f]">Support the mission with your generous contribution.</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f5faf6] p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#08745e] text-sm font-bold text-white">1</span>
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#08745e]">Your Offering</p><h3 className="font-serif text-xl font-semibold text-[#173b38]">Choose an amount</h3></div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {amounts.map(amount=><button key={amount} type="button" onClick={()=>setForm(f=>({...f,amount:String(amount)}))} className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${Number(form.amount)===amount?"border-[#08745e] bg-[#08745e] text-white shadow-lg":"border-[#dce8df] bg-white text-[#176b45] hover:border-[#08745e]"}`}>₹{amount.toLocaleString("en-IN")}</button>)}
              </div>

              <label className="mt-3 block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#43524c]"><FiGift className="text-[#08745e]"/> Custom amount (₹) *</span>
                <input required min="1" step="1" type="number" name="amount" value={form.amount} onChange={updateField} placeholder="Enter amount" className={inputStyles}/>
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-[#edf2ee] bg-white p-1">
              <div className="mb-5 flex items-center gap-3 px-3 pt-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#08745e] text-sm font-bold text-white">2</span>
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#08745e]">Donor Details</p><h3 className="font-serif text-xl font-semibold text-[#173b38]">Tell us about yourself</h3></div>
              </div>

              <div className="grid grid-cols-1 gap-4 px-3 pb-3 sm:grid-cols-2">
                <Field label="First name *" name="first_name" required value={form.first_name} onChange={updateField}/>
                <Field label="Middle name" name="middle_name" value={form.middle_name} onChange={updateField}/>
                <Field label="Last name *" name="last_name" required value={form.last_name} onChange={updateField}/>
                <Field label="Email *" name="email" type="email" required value={form.email} onChange={updateField}/>
                <Field label="Mobile *" name="mobile" required value={form.mobile} onChange={updateField}/>
                <Field label="PAN card (required for 80G)" name="pan_card" value={form.pan_card} onChange={updateField}/>
                <Field label="Address line 1 *" name="address_1" required full value={form.address_1} onChange={updateField}/>
                <Field label="Address line 2" name="address_2" full value={form.address_2} onChange={updateField}/>
                <Field label="PIN / postal code *" name="pin_code" required value={form.pin_code} onChange={updateField}/>
                <Field label="District *" name="district" required value={form.district} onChange={updateField}/>
                <Field label="City *" name="city" required value={form.city} onChange={updateField}/>
                <Field label="State *" name="state" required value={form.state} onChange={updateField}/>
                <Field label="Country *" name="country" required full value={form.country} onChange={updateField}/>
              </div>
            </div>

            {error&&<p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">{error}</p>}

            <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#08745e] px-6 py-4 text-sm font-bold text-white shadow-xl/30 transition hover:bg-[#05634f] disabled:opacity-60">
              <FiLock/>{loading?"Connecting securely…":`Proceed to pay ₹${Number(form.amount||0).toLocaleString("en-IN")}`}{!loading&&<FiArrowRight/>}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#7b8781]"><FiShield className="text-[#08745e]"/> Secure one-time payment</div>
            <p className="mt-1 text-center text-[10px] leading-5 text-[#929b96]">You’ll continue to Mayapur Treasury’s secure payment page. This is a one-time donation and will not recur.</p>
          </motion.form>

          {/* CHAITANYA — DESKTOP STICKY */}
          <aside className="donation-story self-start lg:sticky lg:top-6 ">
            <div className="donation-story__image ">
              <img src={cloudinaryAsset("/donation/Chaitanya-Mahaprabhu.webp",{width:700, crop:"limit"})} alt="Chaitanya Mahaprabhu" loading="lazy" decoding="async"/>
            </div>
            <FiHeart aria-hidden="true"/>
            <h2>Your offering makes service possible.</h2>
            <p>Every donation is securely processed by the ISKCON Mayapur Treasury payment gateway.</p>
            <span><FiLock aria-hidden="true"/> Secure one-time payment</span>
          </aside>

        </div>
      </section>

      {/* IMPACT */}
      <section className="relative overflow-hidden bg-[#fffdf8] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <Leaf className="left-[4%] top-[35%] opacity-40"/>
        <Heading eyebrow="Your Impact" description="With the support of generous well-wishers like you, we continue to serve and inspire.">
          Together We Are Making a <span className="text-[#16735f] italic">Difference</span>
        </Heading>

        <div className="mx-auto mt-9 grid max-w-[1200px] grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {impactItems.map(([Icon,value,title,text],i)=>(
            <motion.div key={title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} whileHover={{y:-7}} className="rounded-[18px] bg-white p-4 shadow-xl/30 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf6ef] text-xl text-[#08745e]"><Icon/></div>
                <div><p className="text-2xl font-bold text-[#08745e] sm:text-3xl">{value}</p><h3 className="font-serif text-sm font-semibold text-[#173b38] sm:text-base">{title}</h3></div>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-[#748079]">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative h-[360px] overflow-hidden sm:h-[300px]">
        <motion.img initial={{scale:1.03}} whileInView={{scale:1}} viewport={{once:true}} transition={{duration:1.4}} src={HeroImg} alt="Mayapur" className="absolute inset-0 h-full w-full object-cover object-center"/>
        <div className="absolute inset-0 bg-[#062d25]/78"/>
        <Leaf className="left-[12%] top-[20%] opacity-60"/>

        <div className="relative z-10 flex h-full items-center justify-center px-5 text-center">
          <motion.div initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#f5d477]">Be a Part of the Mission</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">Serve. Support. <span className="text-[#f5c957] italic">Inspire.</span></h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">Your contribution helps us continue our seva and expand our initiatives to reach and inspire youth.</p>
            <a href="#donate" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#f5c957] px-8 py-4 text-sm font-bold text-[#183e3b]">Donate Now <FiArrowRight/></a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}