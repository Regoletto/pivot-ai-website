import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check, Compass, Layers, LineChart, MessagesSquare, Sparkles, Target } from "lucide-react";
import ScrollReveal from "./components/ScrollReveal";

const ASSET_VERSION = "20260530-mobile-video";
const VIDEO_URL = `${import.meta.env.BASE_URL}assets/ai-adoption-hero.mp4?v=${ASSET_VERSION}`;
const POSTER_URL = `${import.meta.env.BASE_URL}assets/ai-adoption-hero-poster.jpg?v=${ASSET_VERSION}`;
const MOBILE_VIDEO_QUERY = "(max-width: 767px)";

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function NavItem({ children, href }) {
  const [cycle, setCycle] = useState(0);

  return (
    <a
      href={href}
      onMouseEnter={() => setCycle((value) => value + 1)}
      onMouseLeave={() => setCycle((value) => value + 1)}
      className="group relative flex items-center justify-center overflow-hidden py-1 text-white/64 transition-colors duration-300 hover:text-white"
    >
      {cycle === 0 ? (
        <span>{children}</span>
      ) : (
        <>
          <span key={`out-${cycle}`} className="animate-fly-out-up block">
            {children}
          </span>
          <span key={`in-${cycle}`} className="animate-fly-in-up absolute left-0 top-1 block">
            {children}
          </span>
        </>
      )}
    </a>
  );
}

function BrandMark({ compact = false }) {
  return (
    <a href="#top" className="flex items-center gap-3 text-white">
      <span className="grid h-9 w-9 place-items-center border border-white/16 bg-white/8 backdrop-blur-[40px]">
        <span className="h-3.5 w-3.5 border border-white/80 bg-white/10 shadow-[0_0_28px_rgba(255,255,255,0.28)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[13px] font-bold tracking-[0.12em]">PIVOT AI</span>
        {!compact && <span className="mt-1 text-[10px] tracking-[0.18em] text-white/42">智跃</span>}
      </span>
    </a>
  );
}

function ArrowButton({ children, light = false }) {
  const [arrowCycle, setArrowCycle] = useState(0);

  return (
    <a
      href="#contact"
      onMouseEnter={() => setArrowCycle((value) => value + 1)}
      onMouseLeave={() => setArrowCycle((value) => value + 1)}
      className="group flex cursor-pointer items-stretch gap-1"
    >
      <span
        className={`px-7 py-5 font-mono text-[12px] font-bold tracking-[-0.01em] transition-colors duration-300 ${
          light ? "bg-white text-black group-hover:bg-white/84" : "bg-white/8 text-white/90 backdrop-blur-[80px] group-hover:bg-white group-hover:text-black"
        }`}
      >
        {children}
      </span>
      <span
        className={`relative grid w-[68px] place-items-center overflow-hidden transition-colors duration-300 ${
          light ? "bg-white text-black group-hover:bg-white/84" : "bg-white/8 text-white backdrop-blur-[80px] group-hover:bg-white group-hover:text-black"
        }`}
      >
        {arrowCycle === 0 ? (
          <ArrowRight className="h-5 w-5" />
        ) : (
          <>
            <ArrowRight key={`arrow-out-${arrowCycle}`} className="animate-fly-out absolute h-5 w-5" />
            <ArrowRight key={`arrow-in-${arrowCycle}`} className="animate-fly-in absolute h-5 w-5" />
          </>
        )}
      </span>
    </a>
  );
}

function GlassPanel({ icon: Icon, label, title, body, meta }) {
  return (
    <Reveal className="border border-white/10 bg-[#1A1A1A]/42 p-6 backdrop-blur-[70px]">
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">{label}</span>
        <Icon className="h-5 w-5 text-white/70" />
      </div>
      <h3 className="text-xl font-medium leading-tight text-white">{title}</h3>
      <p className="mt-5 text-[15px] leading-relaxed text-white/68">{body}</p>
      {meta && <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-white/34">{meta}</p>}
    </Reveal>
  );
}

function Step({ number, title, english, body }) {
  return (
    <Reveal className="border-t border-white/14 py-7">
      <div className="grid gap-5 md:grid-cols-[120px_1fr]">
        <div className="font-mono text-[12px] text-white/38">{number}</div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/36">{english}</p>
          <h3 className="mt-3 text-2xl font-medium text-white">{title}</h3>
          <p className="mt-4 max-w-[680px] text-[16px] leading-relaxed text-white/66">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function App() {
  const videoRef = useRef(null);
  const screen3Ref = useRef(null);
  const lastVideoTimeRef = useRef(0);
  const isEndLockedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileVideo, setIsMobileVideo] = useState(false);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_VIDEO_QUERY);
    const syncMobileVideo = () => setIsMobileVideo(mediaQuery.matches);

    syncMobileVideo();
    mediaQuery.addEventListener("change", syncMobileVideo);
    return () => mediaQuery.removeEventListener("change", syncMobileVideo);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const handleVideoReady = () => setIsLoaded(true);
    const fallbackTimer = window.setTimeout(handleVideoReady, 2500);
    video.addEventListener("loadedmetadata", handleVideoReady);
    video.addEventListener("canplay", handleVideoReady);
    video.addEventListener("canplaythrough", handleVideoReady);
    video.load();
    return () => {
      window.clearTimeout(fallbackTimer);
      video.removeEventListener("loadedmetadata", handleVideoReady);
      video.removeEventListener("canplay", handleVideoReady);
      video.removeEventListener("canplaythrough", handleVideoReady);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMobileVideo) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => {});
      return;
    }

    video.pause();
  }, [isMobileVideo]);

  useEffect(() => {
    if (!isLoaded) return undefined;
    if (isMobileVideo) return undefined;
    const video = videoRef.current;
    if (!video || !video.duration) return undefined;

    const handleScroll = () => {
      if (!screen3Ref.current || video.seeking) return;
      const rect = screen3Ref.current.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const stopScroll = Math.max(1, absoluteTop - window.innerHeight * 0.2);
      const scrollFraction = Math.max(0, Math.min(1, window.scrollY / stopScroll));
      const finalFrameTime = Math.max(0, video.duration - 0.05);

      if (scrollFraction >= 0.995) {
        if (!isEndLockedRef.current) {
          video.currentTime = finalFrameTime;
          lastVideoTimeRef.current = finalFrameTime;
          isEndLockedRef.current = true;
        }
        return;
      }

      isEndLockedRef.current = false;
      const targetTime = Math.min(finalFrameTime, scrollFraction * finalFrameTime);
      if (Math.abs(targetTime - lastVideoTimeRef.current) < 0.025) return;
      video.currentTime = targetTime;
      lastVideoTimeRef.current = targetTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoaded, isMobileVideo]);

  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-black text-white">
      {!isLoaded && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black">
          <div className="text-center">
            <div className="font-mono text-[10px] tracking-[0.28em] text-white/50">LOADING</div>
            <div className="mt-8 h-px w-64 overflow-hidden bg-white/10">
              <div className="h-full w-1/3 animate-pulse bg-white" />
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-74"
          muted
          playsInline
          preload="auto"
          autoPlay={isMobileVideo}
          loop={isMobileVideo}
          poster={POSTER_URL}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_12%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.36)_48%,rgba(0,0,0,0.7))]" />
        <div className="grain-overlay absolute inset-0 opacity-70" />
      </div>

      <motion.header
        style={{ y: headerY }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-1/2 top-0 z-20 flex w-[90%] -translate-x-1/2 items-center justify-between py-4 md:py-6 lg:py-8"
      >
        <BrandMark />
        <div className="hidden items-stretch bg-[#1A1A1A]/40 backdrop-blur-[80px] lg:flex">
          <nav className="flex w-[520px] items-center justify-between px-6 font-mono text-xs tracking-[-0.01em]">
            <NavItem href="#adoption">POSITIONING</NavItem>
            <NavItem href="#services">SERVICES</NavItem>
            <NavItem href="#mkt">MKT MVP</NavItem>
            <NavItem href="#method">METHOD</NavItem>
            <NavItem href="#contact">CONTACT</NavItem>
          </nav>
          <a
            href="#contact"
            className="w-[188px] bg-white px-6 py-5 text-center font-mono text-xs font-bold leading-4 tracking-[-0.01em] text-black transition-colors hover:bg-gray-200"
          >
            预约 AI 诊断
          </a>
        </div>
      </motion.header>

      <main className="relative z-10 pointer-events-none">
        <section className="pointer-events-auto relative mx-auto h-screen w-[90%] pb-12 pt-24 md:pt-28 lg:pt-32">
          <div className="absolute bottom-[132px] left-0 max-w-[900px] md:bottom-[88px] lg:bottom-[82px]">
              <Reveal delay={0.2}>
                <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white/46">
                  Pivot AI · Enterprise AI Adoption Partner
                </p>
                <h1 className="text-[clamp(2.2rem,5.7vw,5.7rem)] font-medium leading-[1.03] tracking-tight text-white">
                  把 AI 变成
                  <br />
                  业务增长能力
                </h1>
              </Reveal>
            </div>

            <div className="absolute left-0 top-[48%] w-[calc(100vw-64px)] max-w-[340px] -translate-y-1/2 text-left md:left-auto md:right-0 md:top-[42%] md:w-[520px] md:max-w-[520px] md:text-right">
              <Reveal delay={0.3}>
                <p className="min-w-0 break-words text-[0.95rem] font-normal leading-[1.48] text-white/66 md:text-[clamp(1rem,1.45vw,1.34rem)]">
                  智跃帮助企业从一个高价值场景开始，用
                  <span className="font-semibold text-white"> AI 机会诊断、企业 AI 教练和场景化 AI 产品 </span>
                  把 AI 导入真实流程，创造营收、效率和成本结果。
                </p>
              </Reveal>
            </div>

            <div className="absolute bottom-12 left-0 md:left-auto md:right-0">
              <Reveal delay={0.4}>
                <ArrowButton>预约 AI 机会诊断</ArrowButton>
              </Reveal>
            </div>
        </section>

        <div className="h-[160px] w-full" />

        <section id="adoption" className="pointer-events-auto mx-auto flex min-h-screen w-[90%] flex-col justify-center py-12">
          <div className="w-full max-w-[1240px]">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur
              baseRotation={3}
              blurStrength={4}
              textClassName="max-w-[1180px] text-[clamp(1.9rem,4.1vw,4.15rem)] leading-[1.12] font-medium tracking-tight text-white w-full break-words"
            >
              企业不缺 AI 工具，{"\n"}缺的是把正确场景、团队习惯和业务指标连起来。{"\n"}智跃陪企业从第一个可验证场景开始，跑出增长、效率和成本结果。
            </ScrollReveal>

            <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-12">
              <Reveal className="md:col-span-4">
                <div className="flex items-center gap-4">
                  <BrandMark compact />
                </div>
                <p className="mt-6 max-w-[260px] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/46">
                  From AI Awareness to Business Impact
                </p>
              </Reveal>

              <Reveal delay={0.15} className="md:col-span-4">
                <h3 className="text-xl font-medium text-white">定位 / Positioning</h3>
                <p className="mt-5 text-[15px] leading-relaxed text-white/76">
                  智跃不是单纯卖工具，而是企业 AI 采用伙伴。我们帮助管理层判断从哪里开始，也帮助团队把 AI 真正用起来。
                </p>
              </Reveal>

              <Reveal delay={0.3} className="md:col-span-4">
                <h3 className="text-xl font-medium text-white">产品入口 / Use Case Products</h3>
                <p className="mt-5 text-[15px] leading-relaxed text-white/76">
                  MKT MVP 是智跃的第一个标准化产品，先从 Marketing、Sales 和 Growth 场景验证 AI 对业务判断的价值。
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <div className="h-[160px] w-full" />

        <section id="services" className="pointer-events-auto mx-auto w-[90%] py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/42">What We Do</p>
              <h2 className="mt-5 max-w-[520px] text-[clamp(2rem,4.6vw,4.7rem)] font-medium leading-[1.05] tracking-tight">
                一套从判断到采用的 AI 落地系统
              </h2>
              <p className="mt-8 max-w-[520px] text-[17px] leading-relaxed text-white/64">
                很多企业已经知道 AI 重要，但真正卡住的是场景选择、团队使用和结果衡量。智跃把这三件事放在同一套方法里推进。
              </p>
            </Reveal>

            <div id="method" className="space-y-0">
              <Step
                number="01"
                english="Discover"
                title="诊断最值得先做的 AI 场景"
                body="从营收、效率、成本和管理压力出发，筛选最容易验证价值、最适合作为第一步的 AI use case。"
              />
              <Step
                number="02"
                english="Pilot"
                title="用试点跑出可见结果"
                body="不做大而全转型，先用 4-8 周完成一个场景试点，让团队看到 AI 如何改变真实工作输出。"
              />
              <Step
                number="03"
                english="Coach"
                title="让团队真的持续使用"
                body="用企业 AI 教练机制训练团队，把 prompt、workflow、SOP 和复盘节奏沉淀下来，避免工具上线后闲置。"
              />
              <Step
                number="04"
                english="Productize"
                title="把成功场景产品化"
                body="将验证有效的场景沉淀为 AI Agent、内部工具或标准化产品，让成功经验可以被复制、扩展和长期使用。"
              />
            </div>
          </div>
        </section>

        <section id="mkt" className="pointer-events-auto mx-auto w-[90%] py-20">
          <div className="border border-white/10 bg-black/30 p-[clamp(24px,4vw,56px)] backdrop-blur-[70px]">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <Reveal>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/42">Current Product</p>
                <h2 className="mt-5 text-[clamp(2rem,4.4vw,4.5rem)] font-medium leading-[1.03] tracking-tight">
                  MKT MVP
                  <br />
                  AI 市场与客户情报 Agent
                </h2>
                <p className="mt-8 max-w-[620px] text-[17px] leading-relaxed text-white/66">
                  MKT MVP 是智跃的第一个标准化 AI 产品。它从企业的产品、服务或能力出发，读取外部公开信号，帮助 Marketing 和 Sales 更早判断市场机会、客户需求与切入方式。
                </p>
                <div className="mt-10">
                  <ArrowButton>用一个产品方向跑样例</ArrowButton>
                </div>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2">
                <GlassPanel
                  icon={Target}
                  label="Who"
                  title="客户是谁"
                  body="识别正在出现需求信号的行业、客户群和潜在重点客户，让销售不只依赖既有名单。"
                  meta="Customer Direction"
                />
                <GlassPanel
                  icon={Compass}
                  label="Where"
                  title="客户在哪里"
                  body="判断客户信号来自哪些区域、渠道、社群、新闻、招聘或行业场景，帮助团队找到线索来源。"
                  meta="Market Signals"
                />
                <GlassPanel
                  icon={MessagesSquare}
                  label="What"
                  title="客户要什么"
                  body="提取真实痛点、用户问题、竞品教育方向和业务压力，把外部资料转成客户语言。"
                  meta="Demand Intelligence"
                />
                <GlassPanel
                  icon={LineChart}
                  label="How"
                  title="怎么切入"
                  body="把外部证据转成销售开场问题、内容主题、活动方向和下一步动作。"
                  meta="Go-To-Market Action"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pointer-events-auto mx-auto w-[90%] py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <GlassPanel
              icon={Layers}
              label="01 / Consulting"
              title="AI 轻咨询"
              body="帮助企业找到最值得先做的 AI 场景，明确业务优先级、落地路径、试点范围和验证指标。"
              meta="AI Opportunity Scan"
            />
            <GlassPanel
              icon={Sparkles}
              label="02 / Coaching"
              title="企业 AI 教练"
              body="陪伴管理层和团队把 AI 用进日常工作，建立可持续的使用习惯、工作流和内部 AI champion。"
              meta="Enterprise AI Coaching"
            />
            <GlassPanel
              icon={Check}
              label="03 / Products"
              title="AI 产品与 Agent"
              body="从 MKT MVP 开始，后续可根据客户需求沉淀销售情报、知识管理、内容审核、项目管理等场景化 Agent。"
              meta="Use Case Products"
            />
          </div>
        </section>

        <section id="contact" ref={screen3Ref} className="pointer-events-auto mx-auto w-[90%] pb-16 pt-16">
          <footer className="border border-white/10 bg-[#1A1A1A]/60 p-[clamp(32px,4vw,64px)] backdrop-blur-[80px]">
            <div className="flex flex-wrap items-end justify-between gap-10 border-b border-white/10 pb-[clamp(48px,4vw,80px)]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/36">Build Your First AI Use Case</p>
                <h2 className="mt-5 max-w-[760px] text-[clamp(2rem,4.5vw,3.9rem)] font-medium leading-[1.05] tracking-tight">
                  先从一个能验证价值的 AI 场景开始
                </h2>
                <p className="mt-6 max-w-[620px] text-[16px] leading-relaxed text-white/60">
                  预约一次 AI 机会诊断。我们会与你一起判断：哪个场景最值得先做、如何试点、需要哪些团队参与、如何衡量业务结果。
                </p>
              </div>
              <ArrowButton light>预约 AI 机会诊断</ArrowButton>
            </div>

            <div className="grid gap-[clamp(32px,3vw,48px)] pt-[clamp(48px,4vw,64px)] sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <BrandMark />
                <p className="mt-6 max-w-[240px] text-[13px] leading-relaxed text-white/42">
                  AI Consulting + AI Coaching + Use Case Products for measurable business impact.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30">Company</h3>
                <div className="mt-5 space-y-3 text-[14px] text-white/60">
                  <a className="block hover:text-white" href="#adoption">关于我们</a>
                  <a className="block hover:text-white" href="#method">方法论</a>
                  <a className="block hover:text-white" href="#contact">联系我们</a>
                </div>
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30">Services</h3>
                <div className="mt-5 space-y-3 text-[14px] text-white/60">
                  <a className="block hover:text-white" href="#services">AI 轻咨询</a>
                  <a className="block hover:text-white" href="#services">企业 AI 教练</a>
                  <a className="block hover:text-white" href="#services">AI Agent 定制</a>
                </div>
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30">Products</h3>
                <div className="mt-5 space-y-3 text-[14px] text-white/60">
                  <a className="block hover:text-white" href="#mkt">MKT MVP</a>
                  <span className="block text-white/28">Sales Intelligence Agent / Future</span>
                  <span className="block text-white/28">Knowledge Agent / Future</span>
                </div>
              </div>
            </div>

            <div className="mt-14 flex flex-wrap justify-between gap-5 border-t border-white/10 pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/25">2026 Pivot AI 智跃. All rights reserved.</p>
              <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.1em] text-white/25">
                <a href="#top" className="hover:text-white/60">Privacy</a>
                <a href="#top" className="hover:text-white/60">Terms</a>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
