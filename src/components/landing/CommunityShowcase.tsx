import { Music, Gamepad2, GraduationCap, Code2, Palette, Mic } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CommunityShowcase = () => {
    // Premium Bento Card Component using Shadcn Card
    const BentoCard = ({ title, desc, icon: Icon, color, className, delay, tags }: any) => (
        <Card 
            className={`group relative overflow-hidden bg-card/40 border-white/5 hover:border-white/10 hover:bg-card/60 transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full backdrop-blur-sm ${className}`}
            style={{ animationDelay: delay }}
        >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 p-32 opacity-10 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-20`} style={{ background: color }} />
            
            <CardHeader className="relative z-10 pb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2 font-logo">{title}</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed group-hover:text-gray-200 transition-colors">
                    {desc}
                </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 mt-auto">
                 {tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-none transition-colors">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                
                <div className="flex items-center text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-primary">
                    Join Server →
                </div>
            </CardContent>
        </Card>
    );

    return (
        <section className="py-32 bg-background px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-[900] font-logo text-white uppercase mb-6 tracking-tight drop-shadow-lg">
                        Find Your <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">People</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-body">
                        From gaming to music, learning to chilling. There's a place for you.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:min-h-[600px]">
                    {/* Large Card - Gaming */}
                    <div className="md:col-span-2 md:row-span-2">
                         <BentoCard 
                            title="Gaming Hubs" 
                            desc="Low-latency voice channels, stream to friends, and organize raids. The heart of Discord."
                            icon={Gamepad2}
                            color="#8b5cf6" 
                            tags={["FPS", "RPG", "MMO", "Esports"]}
                        />
                    </div>
                    
                    {/* Medium Card - Music */}
                    <div className="md:col-span-1 md:row-span-1">
                        <BentoCard 
                            title="Music & Lo-Fi" 
                            desc="Listen together with Spotify integration and bots."
                            icon={Music}
                            color="#ec4899"
                            tags={["Lofi", "Hip Hop", "Pop"]}
                        />
                    </div>

                    {/* Small Cards Row */}
                     <div className="md:col-span-1 md:row-span-1">
                        <BentoCard 
                            title="Study Groups" 
                            desc="Share screens and focus together."
                            icon={GraduationCap}
                            color="#22c55e"
                            tags={["Programming", "Science", "Math"]}
                        />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                     <BentoCard 
                        title="Artists & Creators" 
                        desc="Share your work in high quality channels."
                        icon={Palette}
                        color="#eab308"
                    />
                     <BentoCard 
                        title="Tech Communities" 
                        desc="Get help with code and build projects."
                        icon={Code2}
                        color="#ef4444"
                    />
                     <BentoCard 
                        title="Just Hanging Out" 
                        desc="Casual voice chats for late night talks."
                        icon={Mic}
                        color="#ffffff"
                    />
                </div>
            </div>
        </section>
    )
}

export default CommunityShowcase;
