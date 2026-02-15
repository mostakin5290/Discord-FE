import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Database,
  Zap,
  Box,
  Layers,
  ArrowRight,
  Brain,
  Search,
  Activity,
  ChevronRight,
  ChevronLeft,
  Users,
  Cpu,
  Video,
} from "lucide-react";

const SlideContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-screen bg-slate-950 text-slate-50 overflow-hidden flex flex-col items-center justify-center p-8 relative selection:bg-indigo-500/30 font-sans">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    {children}
  </div>
);

const GlassCard = ({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) => (
  <div className={`relative group ${className}`}>
    {label && (
      <div className="absolute -top-3 left-3 bg-slate-900 px-2 text-[10px] uppercase tracking-widest text-slate-400 border border-slate-700 rounded z-10">
        {label}
      </div>
    )}
    <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 shadow-xl hover:shadow-2xl hover:bg-slate-800/50 transition-all duration-300 h-full w-full">
      {children}
    </div>
  </div>
);

const Node = ({
  icon: Icon,
  label,
  subLabel,
  color = "text-indigo-400",
}: {
  icon: any;
  label: string;
  subLabel?: string;
  color?: string;
}) => (
  <div className="flex flex-col items-center gap-2 z-10 p-2 rounded-lg bg-slate-950/80 border border-slate-800/50 hover:border-indigo-500/30 transition-colors">
    <Icon className={`w-8 h-8 ${color}`} />
    <div className="text-center leading-tight">
      <div className="text-xs font-bold text-slate-200">{label}</div>
      {subLabel && <div className="text-[10px] text-slate-500">{subLabel}</div>}
    </div>
  </div>
);

// --- Slide 1: Tech Stack ---
const Slide1 = () => {
  const stack = [
    {
      name: "Frontend",
      tools: ["React (Vite)", "Redux Toolkit", "Tailwind CSS"],
      icon: Box,
      color: "text-blue-400",
    },
    {
      name: "Backend Layer",
      tools: ["Node.js", "Express", "Socket.IO"],
      icon: Server,
      color: "text-green-500",
    },
    {
      name: "Message Broker",
      tools: ["Apache Kafka", "Zookeeper"],
      icon: Activity,
      color: "text-red-500",
    },
    {
      name: "Data Store",
      tools: ["PostgreSQL (Prisma)", "Redis (Cache/Queue)"],
      icon: Database,
      color: "text-blue-300",
    },
    {
      name: "AI Engine",
      tools: ["Pinecone VectorDB", "Embeddings"],
      icon: Brain,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="flex flex-col items-center z-10 space-y-16 max-w-6xl w-full">
      <div className="text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
        >
          High-Scale Real-Time Architecture
        </motion.h1>
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
            Event-Driven • Microservices Pattern • AI Integrations
        </motion.p>
      </div>

      <div className="grid grid-cols-5 gap-4 w-full">
        {stack.map((group, idx) => (
          <motion.div
            key={group.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <GlassCard className="h-64 flex flex-col items-center text-center justify-between py-6 hover:-translate-y-1" label={group.name}>
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <group.icon className={`w-12 h-12 ${group.color}`} />
                  <ul className="space-y-2">
                    {group.tools.map((t) => (
                        <li key={t} className="text-sm font-medium text-slate-300">{t}</li>
                    ))}
                  </ul>
                </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Slide 2: Message Architecture (Interactive: P2P vs Group) ---
const Slide2 = () => {
    const [viewMode, setViewMode] = useState<'p2p' | 'group'>('p2p');

    // Shared Coordinate System (1200x600 space)
    const pos = {
        sender: { x: 1050, y: 250 },
        lb: { x: 900, y: 300 },
        backend: { x: 650, y: 300 },
        redis: { x: 650, y: 120 },
        producer: { x: 650, y: 480 },
        kafka: { x: 400, y: 480 },
        rtConsumer: { x: 400, y: 300 }, // Realtime Consumer
        dbWriter: { x: 200, y: 480 },
        postgres: { x: 200, y: 300 },
        
        // Receivers
        receiverP2P: { x: 1050, y: 450 }, // For One-on-One
        receiverGroup: { x: 900, y: 500 } // Channel users
    };

    return (
        <div className="flex flex-col w-full h-full p-4 relative">
             <div className="absolute top-0 left-0 p-8 z-30">
                <h2 className="text-3xl font-bold text-indigo-400">Message Architecture</h2>
                
                {/* Toggle Switch */}
                <div className="flex gap-2 mt-6 bg-slate-900/80 p-1 rounded-lg border border-slate-700 w-fit backdrop-blur-md">
                    <button 
                        onClick={() => setViewMode('p2p')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'p2p' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        One-on-One
                    </button>
                    <button 
                        onClick={() => setViewMode('group')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'group' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Group Chat
                    </button>
                </div>

                <div className="mt-4 space-y-4 max-w-lg bg-slate-900/80 p-6 rounded-xl border border-indigo-500/20 backdrop-blur-md min-h-[160px]">
                     {viewMode === 'p2p' ? (
                         <>
                            <p className="text-slate-300 text-sm leading-relaxed mb-2 font-medium">Direct Messaging Flow</p>
                            <p className="text-slate-400 text-xs">
                                Optimized for low-latency bidirectional communication.
                            </p>
                            <ul className="text-xs text-slate-400 space-y-1 mt-2">
                                <li className="flex gap-2"><span className="text-indigo-400">➢</span> WebSocket connection persists for real-time delivery.</li>
                                <li className="flex gap-2"><span className="text-indigo-400">➢</span> Redis caches user session presence (Online/Offline).</li>
                            </ul>
                         </>
                     ) : (
                         <>
                            <p className="text-slate-300 text-sm leading-relaxed mb-2 font-medium">Fan-Out Architecture (Groups)</p>
                             <p className="text-slate-400 text-xs">
                                Efficiently broadcasting to thousands of users in a channel.
                            </p>
                            <ul className="text-xs text-slate-400 space-y-1 mt-2">
                                <li className="flex gap-2"><span className="text-yellow-400">➢</span> <strong>Pub/Sub:</strong> Redis manages high-speed channel distribution.</li>
                                <li className="flex gap-2"><span className="text-blue-400">➢</span> <strong>Batching:</strong> Messages grouped before DB write to prevent spikes.</li>
                            </ul>
                         </>
                     )}
                </div>
           </div>

           {/* Diagram Area */}
           <div className="flex-1 relative mt-[50px] scale-90 origin-top w-full max-w-[1200px] mx-auto h-[600px]">
                
                 {/* --- Common Infrastructure --- */}
                 
                 {/* Sender */}
                 <div style={{ left: pos.sender.x, top: pos.sender.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                      <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <Node icon={Users} label="Sender" color="text-pink-400" />
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                          </div>
                      </div>
                 </div>

                 {/* Load Balancer */}
                 <div style={{ left: pos.lb.x, top: pos.lb.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                      <GlassCard className="rounded-full w-28 h-28 flex items-center justify-center bg-cyan-900/20 border-cyan-500/30">
                          <div className="text-center">
                              <Layers className="w-8 h-8 text-cyan-400 mx-auto mb-1" />
                              <div className="font-bold text-[10px] text-cyan-100">Load Balancer</div>
                          </div>
                      </GlassCard>
                 </div>

                 {/* Backend */}
                 <div style={{ left: pos.backend.x, top: pos.backend.y }} className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
                     <GlassCard className="w-48 h-48 bg-red-900/10 border-red-500/30 flex flex-col items-center justify-center backdrop-blur-md bg-slate-900/80">
                          <Server className="w-12 h-12 text-red-500 mb-2" />
                          <div className="font-bold text-red-100 text-lg">Backend API</div>
                          <div className="text-xs text-red-400 mt-1">Port: 3000</div>
                     </GlassCard>
                 </div>

                 {/* Redis */}
                 <div style={{ left: pos.redis.x, top: pos.redis.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                      <Node icon={Layers} label="Redis" subLabel={viewMode === 'p2p' ? "Session Store" : "Pub/Sub Channel"} color="text-green-400" />
                 </div>

                 {/* Producer */}
                 <div style={{ left: pos.producer.x, top: pos.producer.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                      <Node icon={Zap} label="Producer" subLabel="Async Events" color="text-slate-200" />
                 </div>

                 {/* Kafka */}
                 <div style={{ left: pos.kafka.x, top: pos.kafka.y }} className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
                     <GlassCard className="w-40 h-24 bg-purple-900/10 border-purple-500/30 flex items-center justify-center backdrop-blur-md bg-slate-900/80">
                         <div className="flex flex-col items-center">
                             <Activity className="text-purple-400 w-6 h-6 mb-1" />
                             <div className="font-bold text-purple-100">Kafka</div>
                         </div>
                     </GlassCard>
                 </div>
                 
                 {/* Realtime Consumer */}
                 <div style={{ left: pos.rtConsumer.x, top: pos.rtConsumer.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                      <Node icon={Cpu} label="Realtime" subLabel="Consumer" color="text-yellow-400" />
                 </div>

                 {/* DB Writer */}
                 <div style={{ left: pos.dbWriter.x, top: pos.dbWriter.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                    <GlassCard className="p-3 border-slate-600 bg-slate-800">
                        <div className="font-bold text-xs">DB Writer</div>
                    </GlassCard>
                 </div>
                 
                 {/* Postgres */}
                 <div style={{ left: pos.postgres.x, top: pos.postgres.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                     <div className="flex flex-col gap-2 p-4 border border-blue-500/30 rounded-xl bg-blue-900/10 items-center">
                          <Database className="w-8 h-8 text-blue-400"/>
                          <span className="text-xs font-bold text-blue-200">PostgreSQL</span>
                     </div>
                 </div>

                 {/* --- Dynamic Receivers based on Mode --- */}
                 <AnimatePresence mode="wait">
                     {viewMode === 'p2p' ? (
                         <motion.div 
                            key="p2p-receiver"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            style={{ left: pos.receiverP2P.x, top: pos.receiverP2P.y }} 
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                         >
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <Node icon={Users} label="User 2" subLabel="Receiver" color="text-pink-400" />
                                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                </div>
                            </div>
                         </motion.div>
                     ) : (
                         <motion.div 
                            key="group-receiver"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            style={{ left: pos.sender.x, top: pos.receiverGroup.y }} 
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                         >
                             <div className="p-4 rounded-2xl border border-slate-700 bg-slate-800 shadow-xl w-48 relative">
                                 <div className="absolute -left-12 top-1/2 -translate-y-1/2 bg-slate-700 text-[10px] px-2 py-1 rounded text-slate-300">
                                     WebSocket Fanout
                                 </div>
                                 <div className="text-xs uppercase font-bold text-slate-400 mb-2 border-b border-slate-700 pb-2"># general</div>
                                 <div className="space-y-2">
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                         <span className="text-xs text-slate-200">User 2 (Online)</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                         <span className="text-xs text-slate-200">User 3 (Online)</span>
                                     </div>
                                     <div className="flex items-center gap-2 opacity-50">
                                         <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                                         <span className="text-xs text-slate-200">User 4 (Offline)</span>
                                     </div>
                                 </div>
                             </div>
                         </motion.div>
                     )}
                 </AnimatePresence>

                 {/* --- Connectors (SVG) --- */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                     <defs>
                         <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                             <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                         </marker>
                     </defs>

                     {/* Sender -> LB -> Backend */}
                     <path d={`M ${pos.sender.x-30} ${pos.sender.y} L ${pos.lb.x+40} ${pos.lb.y-20}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
                     <path d={`M ${pos.lb.x-40} ${pos.lb.y} L ${pos.backend.x+90} ${pos.backend.y}`} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

                     {/* Backend Infrastructure */}
                     <path d={`M ${pos.backend.x} ${pos.backend.y-90} L ${pos.redis.x} ${pos.redis.y+40}`} stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                     <path d={`M ${pos.backend.x} ${pos.backend.y+90} L ${pos.producer.x} ${pos.producer.y-40}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
                     <path d={`M ${pos.producer.x-50} ${pos.producer.y} L ${pos.kafka.x+80} ${pos.kafka.y}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
                     <path d={`M ${pos.kafka.x} ${pos.kafka.y-40} L ${pos.rtConsumer.x} ${pos.rtConsumer.y+40}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
                     <path d={`M ${pos.rtConsumer.x+50} ${pos.rtConsumer.y} L ${pos.backend.x-90} ${pos.backend.y}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
                     
                     {/* DB Write Path */}
                     <path d={`M ${pos.kafka.x-80} ${pos.kafka.y} L ${pos.dbWriter.x+50} ${pos.dbWriter.y}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
                     <path d={`M ${pos.dbWriter.x} ${pos.dbWriter.y-30} L ${pos.postgres.x} ${pos.postgres.y+40}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />

                     {/* Delivery Path (Dynamic) */}
                     {viewMode === 'p2p' ? (
                         <>
                            {/* Backend -> LB -> Receiver P2P */}
                            <path d={`M ${pos.backend.x+90} ${pos.backend.y+20} L ${pos.lb.x-40} ${pos.lb.y+20}`} stroke="#64748b" strokeWidth="1" opacity="0.5" />
                            <path d={`M ${pos.lb.x+40} ${pos.lb.y+30} L ${pos.receiverP2P.x-30} ${pos.receiverP2P.y}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
                            
                            {/* Blue particle: Write flow (Slower) */}
                            <MessageParticle 
                                path={`M ${pos.sender.x} ${pos.sender.y} L ${pos.lb.x} ${pos.lb.y} L ${pos.backend.x} ${pos.backend.y} L ${pos.producer.x} ${pos.producer.y} L ${pos.kafka.x} ${pos.kafka.y} L ${pos.dbWriter.x} ${pos.dbWriter.y} L ${pos.postgres.x} ${pos.postgres.y}`} 
                                color="#60a5fa" 
                                duration={8}
                            />
                            {/* Yellow particle: Read/Delivery flow (Slower) */}
                            <MessageParticle 
                                path={`M ${pos.kafka.x} ${pos.kafka.y} L ${pos.rtConsumer.x} ${pos.rtConsumer.y} L ${pos.backend.x} ${pos.backend.y} L ${pos.lb.x} ${pos.lb.y} L ${pos.receiverP2P.x} ${pos.receiverP2P.y}`} 
                                color="#facc15" 
                                delay={4}
                                duration={8}
                            />
                         </>
                     ) : (
                         <>
                             {/* Backend -> Group Fanout Connection */}
                             <path d={`M ${pos.backend.x+90} ${pos.backend.y} C ${pos.backend.x+200} ${pos.backend.y}, ${pos.backend.x+200} ${pos.receiverGroup.y}, ${pos.sender.x-100} ${pos.receiverGroup.y}`} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                             
                             {/* Write Particle */}
                             <MessageParticle 
                                path={`M ${pos.sender.x} ${pos.sender.y} L ${pos.lb.x} ${pos.lb.y} L ${pos.backend.x} ${pos.backend.y} L ${pos.producer.x} ${pos.producer.y} L ${pos.kafka.x} ${pos.kafka.y} L ${pos.dbWriter.x} ${pos.dbWriter.y}`} 
                                color="#60a5fa" 
                                duration={6}
                             />

                             {/* Fanout Particles: Multiple particles hitting different users in the group */}
                             {/* Path 1: To User 2 */}
                             <MessageParticle 
                                path={`M ${pos.kafka.x} ${pos.kafka.y} L ${pos.rtConsumer.x} ${pos.rtConsumer.y} L ${pos.backend.x} ${pos.backend.y} C ${pos.backend.x+200} ${pos.backend.y}, ${pos.backend.x+200} ${pos.receiverGroup.y}, ${pos.sender.x-50} ${pos.receiverGroup.y-20}`} 
                                color="#facc15" 
                                delay={3}
                                duration={6}
                             />
                             {/* Path 2: To User 3 (Slightly different trajectory) */}
                             <MessageParticle 
                                path={`M ${pos.kafka.x} ${pos.kafka.y} L ${pos.rtConsumer.x} ${pos.rtConsumer.y} L ${pos.backend.x} ${pos.backend.y} C ${pos.backend.x+180} ${pos.backend.y+20}, ${pos.backend.x+180} ${pos.receiverGroup.y+20}, ${pos.sender.x-50} ${pos.receiverGroup.y+20}`} 
                                color="#facc15" 
                                delay={3.2}
                                duration={6}
                             />
                         </>
                     )}

                 </svg>
           </div>
        </div>
    )
}

// --- Slide 4: AI Vectorization (Push) ---
const Slide4 = () => {
    // Coordinate System (1200x600 space)
    // Flow: User (Right) -> Backend (Mid) -> Producer (Mid-Down) -> Kafka (Mid-Left) -> Consumer (Left) -> VectorDB (Far Left)
    const pos = {
        user: { x: 1050, y: 300 },
        backend: { x: 800, y: 300 },
        producer: { x: 800, y: 480 },
        kafka: { x: 500, y: 480 },
        vectorConsumer: { x: 250, y: 480 }, // Vectorize
        vectorDB: { x: 250, y: 300 } // Pinecone
    };

    return (
        <div className="flex flex-col w-full h-full p-4 relative">
             <div className="absolute top-0 left-0 p-8 z-20">
                <h2 className="text-3xl font-bold text-purple-400">Intelligent Message Retrieval</h2>
                <div className="mt-4 space-y-4 max-w-lg bg-slate-900/80 p-6 rounded-xl border border-purple-500/20 backdrop-blur-md">
                     <p className="text-slate-400 text-sm leading-relaxed">
                        We don't just store text; we store meaning. Every message is asynchronously processed to enable AI-powered semantic search.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                             <div className="mt-1"><Brain className="w-3 h-3 text-purple-400"/></div>
                             <span><strong>Vectorize Consumer:</strong> dedicated Kafka service transforming text to embeddings.</span>
                        </li>
                        <li className="flex items-start gap-2">
                             <div className="mt-1"><Database className="w-3 h-3 text-pink-400"/></div>
                             <span><strong>Pinecone:</strong> Vector database storing high-dimensional embeddings for fast similarity search.</span>
                        </li>
                    </ul>
                </div>
           </div>

           {/* Diagram based on "Message Vectorization (Push)" flow */}
           <div className="flex-1 relative mt-[50px] scale-90 origin-top w-full max-w-[1200px] mx-auto h-[600px]">
                
                 {/* User & LB */}
                 <div style={{ left: pos.user.x, top: pos.user.y }} className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
                      <div className="flex flex-col items-center">
                          <Users className="w-8 h-8 text-pink-400 mb-2"/>
                          <span className="text-xs font-bold text-slate-300">User</span>
                      </div>
                      <ArrowRight className="text-slate-600 rotate-180" />
                      <div className="w-20 h-20 rounded-full border border-cyan-500/30 bg-cyan-900/10 flex items-center justify-center">
                          <Layers className="text-cyan-400 w-6 h-6" />
                      </div>
                 </div>

                 {/* Backend */}
                 <div style={{ left: pos.backend.x, top: pos.backend.y }} className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
                     <GlassCard className="w-40 h-40 bg-red-900/10 border-red-500/30 flex flex-col items-center justify-center backdrop-blur-md bg-slate-900/80">
                          <Server className="w-10 h-10 text-red-500 mb-2" />
                          <span className="font-bold text-red-100">Backend</span>
                     </GlassCard>
                 </div>

                 {/* Producer */}
                 <div style={{ left: pos.producer.x, top: pos.producer.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                      <Node icon={Zap} label="Producer" color="text-slate-300" />
                 </div>

                 {/* Kafka */}
                 <div style={{ left: pos.kafka.x, top: pos.kafka.y }} className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
                     <GlassCard className="w-48 h-24 bg-purple-900/10 border-purple-500/30 flex items-center justify-center backdrop-blur-md bg-slate-900/80">
                         <div className="font-mono text-purple-300 font-bold">Kafka Cluster</div>
                     </GlassCard>
                 </div>

                 {/* Vectorize Consumer */}
                 <div style={{ left: pos.vectorConsumer.x, top: pos.vectorConsumer.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                     <GlassCard className="w-32 py-4 flex flex-col items-center border-purple-400/30" label="Consumer">
                         <Brain className="w-6 h-6 text-purple-400 mb-2" />
                         <span className="text-xs font-bold">Vectorize</span>
                     </GlassCard>
                 </div>

                 {/* Vector DB Stack */}
                 <div style={{ left: pos.vectorDB.x, top: pos.vectorDB.y }} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 scale-110">
                      <div className="w-32 h-10 bg-pink-900/30 border border-pink-500/50 rounded flex items-center justify-center text-xs font-bold text-pink-200 shadow-lg shadow-pink-900/20">
                          Pinecone DB
                      </div>
                      <div className="w-32 h-2 mx-auto bg-pink-500/20 rounded-full blur-sm"></div>
                 </div>
                
                {/* Overlay Arrows */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
                    <defs>
                       <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                           <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                       </marker>
                    </defs>

                    {/* Backend -> Producer */}
                    <path d={`M ${pos.backend.x} ${pos.backend.y+80} L ${pos.producer.x} ${pos.producer.y-40}`} stroke="#475569" markerEnd="url(#arrow)" />

                    {/* Producer -> Kafka */}
                    <path d={`M ${pos.producer.x-50} ${pos.producer.y} L ${pos.kafka.x+100} ${pos.kafka.y}`} stroke="#475569" markerEnd="url(#arrow)" />

                    {/* Kafka -> Vector Consumer */}
                    <path d={`M ${pos.kafka.x-100} ${pos.kafka.y} L ${pos.vectorConsumer.x+70} ${pos.vectorConsumer.y}`} stroke="#475569" markerEnd="url(#arrow)" />

                    {/* Vector Consumer -> Vector DB */}
                    <path d={`M ${pos.vectorConsumer.x} ${pos.vectorConsumer.y-50} L ${pos.vectorDB.x} ${pos.vectorDB.y+30}`} stroke="#475569" markerEnd="url(#arrow)" />

                    {/* Animation: Message -> Embedding (Slower) */}
                    <MessageParticle 
                        path={`M ${pos.user.x-60} ${pos.user.y} L ${pos.backend.x} ${pos.backend.y} L ${pos.producer.x} ${pos.producer.y} L ${pos.kafka.x} ${pos.kafka.y} L ${pos.vectorConsumer.x} ${pos.vectorConsumer.y} L ${pos.vectorDB.x} ${pos.vectorDB.y}`} 
                        color="#e879f9" 
                        duration={6}
                    />
                </svg>
           </div>
        </div>
    )
}

// --- Slide 5: Rag Query ---
const Slide5 = () => {
     return (
        <div className="flex flex-col w-full h-full p-4 relative">
             <div className="absolute top-0 left-0 p-8">
                <h2 className="text-3xl font-bold text-green-400">RAG Query Flow</h2>
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 max-w-sm">
                    <div className="text-xs text-slate-500 mb-1">User Query</div>
                    <div className="text-sm text-slate-200">"What was the API key we discussed?"</div>
                </div>
           </div>

           <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-8">
                    <Node icon={Users} label="User" color="text-pink-400" />
                    <ArrowRight className="text-slate-600" />
                    <GlassCard className="p-8 flex flex-col items-center gap-4 border-green-500/30">
                        <div className="flex items-center gap-4">
                            <Node icon={Search} label="Embed Query" color="text-yellow-400" />
                            <ArrowRight className="text-slate-600" />
                            <Node icon={Brain} label="Vector Search" color="text-pink-400" />
                        </div>
                        <div className="w-full h-px bg-slate-700 my-2"></div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                             <Database className="w-4 h-4" /> Pinecone Index
                        </div>
                    </GlassCard>
                    <ArrowRight className="text-slate-600" />
                     <GlassCard className="p-6 border-indigo-500/30">
                        <div className="font-bold text-indigo-300 mb-2">LLM Context</div>
                        <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2 rounded">
                            Checking codebase...<br/>
                            Found relevant messages...
                        </div>
                     </GlassCard>

                </div>
           </div>
        </div>
     );
};

// --- Helper Functions ---
const MessageParticle = ({
  path,
  delay = 0,
  color = "white",
  duration = 3,
}: {
  path: string;
  delay?: number;
  color?: string;
  duration?: number;
}) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
      <path
        d={path}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
        fill="transparent"
      />
      <motion.circle
        r="3"
        fill={color}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: delay,
        }}
        style={{ offsetPath: `path('${path}')` }}
      />
    </svg>
  );
};

// --- Slide 6: LiveKit Video Architecture ---
const SlideVideo = () => {
    // Coordinate System based on User Image (Triangle Layout)
    const pos = {
       backend: { x: 300, y: 450 },
       frontend: { x: 900, y: 450 },
       livekit: { x: 600, y: 200 }
    };

    return (
         <div className="flex flex-col w-full h-full p-4 relative">
             <div className="absolute top-0 left-0 p-8 z-30 pointer-events-none">
                <h2 className="text-3xl font-bold text-pink-400">Video & Voice Architecture</h2>
                <div className="mt-4 space-y-4 max-w-lg bg-slate-900/80 p-6 rounded-xl border border-pink-500/20 backdrop-blur-md pointer-events-auto">
                    <p className="text-slate-300 text-sm font-medium">LiveKit Integration</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        The Backend signs an AccessToken via the LiveKit API. The Client (Frontend) then uses this token to connect directly to the LiveKit SFU for high-quality, scalable media streaming.
                    </p>
                </div>
           </div>

            <div className="flex-1 relative mt-[50px] scale-90 origin-top w-full max-w-[1200px] mx-auto h-[600px]">
                
                {/* --- Main Nodes --- */}

                {/* LiveKit (Top Center) */}
                <div style={{ left: pos.livekit.x, top: pos.livekit.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                    <GlassCard className="w-64 h-32 border-pink-500/80 bg-pink-900/30 flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.3)] backdrop-blur-xl">
                        <div className="flex flex-col items-center">
                             <Video className="w-12 h-12 text-pink-300 mb-2 drop-shadow-md" />
                             <span className="font-bold text-3xl text-white drop-shadow-lg">LiveKit</span>
                             <span className="text-xs text-pink-200 mt-1 font-semibold tracking-wide">SFU Media Server</span>
                        </div>
                    </GlassCard>
                </div>

                {/* Backend (Bottom Left) */}
                 <div style={{ left: pos.backend.x, top: pos.backend.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                    <GlassCard className="w-64 h-40 border-indigo-400/50 bg-slate-800 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                        <div className="flex flex-col items-center">
                             <Server className="w-10 h-10 text-indigo-300 mb-2" />
                             <span className="font-bold text-2xl text-indigo-100">Backend</span>
                        </div>
                    </GlassCard>
                    {/* Label Above Backend */}
                    <div className="absolute -top-20 left-0 right-0 text-center w-full">
                         <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/50 shadow-xl backdrop-blur-sm">
                             <p className="text-xs font-bold text-slate-300 leading-relaxed">
                                 Signs accessToken via LiveKit API<br/>for direct streaming authorization
                             </p>
                         </div>
                    </div>
                </div>

                {/* Frontend (Bottom Right) */}
                 <div style={{ left: pos.frontend.x, top: pos.frontend.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                    <GlassCard className="w-64 h-40 border-cyan-400/50 bg-slate-800 flex items-center justify-center shadow-lg shadow-cyan-900/20">
                        <div className="flex flex-col items-center">
                             <Users className="w-10 h-10 text-cyan-300 mb-2" />
                             <span className="font-bold text-2xl text-cyan-100">Frontend</span>
                        </div>
                    </GlassCard>
                </div>


                {/* --- Connections & Flows --- */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                           <path d="M2,2 L10,6 L2,10 L2,2" fill="#94a3b8" />
                        </marker>
                         <marker id="arrow-pink" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                           <path d="M2,2 L10,6 L2,10 L2,2" fill="#f472b6" />
                        </marker>
                    </defs>

                    {/* 1. Backend <-> Frontend (HTTP / WS) */}
                    {/* Upper Line: HTTP */}
                    <path d={`M ${pos.backend.x+130} ${pos.backend.y-25} L ${pos.frontend.x-130} ${pos.frontend.y-25}`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" opacity="0.6" />
                    <rect x={(pos.backend.x + pos.frontend.x) / 2 - 25} y={pos.backend.y - 45} width="50" height="20" rx="4" fill="#0f172a" stroke="#334155" />
                    <text x={(pos.backend.x + pos.frontend.x) / 2} y={pos.backend.y - 31} textAnchor="middle" className="fill-slate-300 text-xs font-bold">HTTP</text>
                    
                    {/* Lower Line: WS */}
                    <path d={`M ${pos.backend.x+130} ${pos.backend.y+25} L ${pos.frontend.x-130} ${pos.frontend.y+25}`} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" opacity="0.6" />
                     <rect x={(pos.backend.x + pos.frontend.x) / 2 - 25} y={pos.backend.y + 35} width="50" height="20" rx="4" fill="#0f172a" stroke="#334155" />
                    <text x={(pos.backend.x + pos.frontend.x) / 2} y={pos.backend.y + 49} textAnchor="middle" className="fill-slate-300 text-xs font-bold">WS</text>


                    {/* 2. Frontend -> LiveKit (WebRTC) */}
                    {/* Diagonal connection */}
                    <path d={`M ${pos.frontend.x-60} ${pos.frontend.y-80} L ${pos.livekit.x+60} ${pos.livekit.y+60}`} stroke="#f472b6" strokeWidth="3" markerEnd="url(#arrow-pink)" />
                    
                    {/* AccessToken Label - positioned clearly away from the line */}
                    <foreignObject x={pos.frontend.x - 160} y={pos.frontend.y - 180} width="220" height="80">
                         <div className="bg-slate-900/90 border border-pink-500/30 p-2 rounded-lg text-right backdrop-blur-md shadow-lg">
                             <div className="text-[11px] font-bold text-pink-300">WebRTC + RoomId</div>
                             <div className="text-[11px] font-bold text-pink-300">+ AccessToken</div>
                         </div>
                    </foreignObject>
                    
                    <foreignObject x={pos.frontend.x + 20} y={pos.frontend.y - 160} width="150" height="40">
                         <div className="text-[10px] text-slate-400 font-mono italic text-left">
                            *Token verified on connect
                         </div>
                    </foreignObject>


                    {/* Animations */}

                    {/* Token Flow: Backend -> Frontend (Blue) */}
                    <MessageParticle 
                        path={`M ${pos.backend.x} ${pos.backend.y} L ${pos.frontend.x} ${pos.frontend.y}`} 
                        color="#60a5fa" 
                        duration={3}
                        delay={0}
                    />

                    {/* Connection Flow: Frontend -> LiveKit (Pink) */}
                    <MessageParticle 
                        path={`M ${pos.frontend.x} ${pos.frontend.y} L ${pos.livekit.x} ${pos.livekit.y}`} 
                        color="#ec4899" 
                        duration={3}
                        delay={1.5}
                    />

                </svg>
            </div>
         </div>
    );
};


// --- Main Component ---
const ArchitecturePage = () => {
    const [slide, setSlide] = useState(0);
    const slides = [<Slide1 />, <Slide2 />, <Slide4 />, <Slide5 />, <SlideVideo />];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") setSlide(p => Math.min(p + 1, slides.length - 1));
            if (e.key === "ArrowLeft") setSlide(p => Math.max(p - 1, 0));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [slides.length]);

    return (
        <SlideContainer>
            <div className="absolute top-8 right-8 flex gap-2 z-50">
                 <button
                    onClick={() => setSlide((p) => Math.max(p - 1, 0))}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition disabled:opacity-50"
                    disabled={slide === 0}
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-300" />
                </button>
                <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-mono text-slate-300 flex items-center">
                    {slide + 1} / {slides.length}
                </div>
                <button
                    onClick={() => setSlide((p) => Math.min(p + 1, slides.length - 1))}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition disabled:opacity-50"
                    disabled={slide === slides.length - 1}
                     aria-label="Next Slide"
                >
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={slide}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex items-center justify-center p-8"
                >
                    {slides[slide]}
                </motion.div>
            </AnimatePresence>
        </SlideContainer>
    );
};

export default ArchitecturePage;
