const FeatureSection = () => {
  const features = [
    {
      title: "Create an invite-only place where you belong",
      description: "Discord servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.",
      imageColor: "#5865F2", // Blurple
      align: "right"
    },
    {
      title: "Where hanging out is easy",
      description: "Grab a seat in a voice channel when you're free. Friends in your server can see you're around and instantly pop in to talk without having to call.",
      imageColor: "#23A559", // Green
      align: "left"
    },
    {
      title: "From few to a fandom",
      description: "Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more.",
      imageColor: "#FEE75C", // Yellow
      align: "right"
    },
    {
      title: "Reliable tech for staying close",
      description: "Low-latency voice and video feels like you're in the same room. Wave hello over video, watch friends stream their games, or gather up and have a drawing session with screen share.",
      imageColor: "#EB459E", // Pink
      align: "left"
    }
  ];

  return (
    <section className="bg-background py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
              feature.align === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-6 animate-slide-in-up">
              <h2 className="text-3xl md:text-5xl font-[900] font-logo text-white leading-tight">
                {feature.title}
              </h2>
              <p className="text-lg text-[#B5BAC1] font-body leading-relaxed max-w-lg">
                {feature.description}
              </p>
            </div>

            {/* Visual/UI Mock Content */}
            <div className="flex-1 w-full animate-float">
                {/* Abstract UI representation */}
                <div 
                    className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105 duration-500"
                    style={{ backgroundColor: `${feature.imageColor}20` }}
                >
                    {/* Fake UI Elements */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-black/10 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>

                    {/* Content Area Mock */}
                    <div className="p-8 h-full flex items-center justify-center">
                        <div 
                            className="w-3/4 h-3/4 rounded-xl shadow-lg flex items-center justify-center text-white/20"
                            style={{ backgroundColor: feature.imageColor }}
                        >
                            <span className="font-logo font-black text-6xl opacity-50">UI</span>
                        </div>
                    </div>

                    {/* Floating Bubble Mock */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
