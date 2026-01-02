import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
    return (
        <section className="py-24 bg-background px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-5xl font-[900] font-logo text-white uppercase mb-4 tracking-tight drop-shadow-md">
                        Got Questions?
                    </h2>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border-white/5 bg-card/30 backdrop-blur-sm rounded-xl px-6 hover:bg-card/50 transition-colors">
                        <AccordionTrigger className="text-white hover:no-underline hover:text-primary font-bold text-lg py-6">
                            Is Discord really free?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-base pb-6 leading-relaxed">
                            Yes! Core features like unlimited servers, channels, and voice chat are completely free. We make money through Nitro, an optional subscription that gives you enhancements like profile customization and bigger file uploads. We don't sell your data.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2" className="border-white/5 bg-card/30 backdrop-blur-sm rounded-xl px-6 hover:bg-card/50 transition-colors">
                        <AccordionTrigger className="text-white hover:no-underline hover:text-primary font-bold text-lg py-6">
                            How do I join a server?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-base pb-6 leading-relaxed">
                            You can join servers through invite links sent by friends, or find public communities using our Server Discovery feature. Once you're in, you can start chatting immediately.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-white/5 bg-card/30 backdrop-blur-sm rounded-xl px-6 hover:bg-card/50 transition-colors">
                         <AccordionTrigger className="text-white hover:no-underline hover:text-primary font-bold text-lg py-6">
                            Is it safe for my child?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-base pb-6 leading-relaxed">
                           We take safety seriously. We have robust privacy controls, a Family Center tool for parents, and a dedicated Safety Center. You control who can DM you and which servers you join.
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="item-4" className="border-white/5 bg-card/30 backdrop-blur-sm rounded-xl px-6 hover:bg-card/50 transition-colors">
                        <AccordionTrigger className="text-white hover:no-underline hover:text-primary font-bold text-lg py-6">
                            Can I use Discord on Mac/Windows/Linux?
                        </AccordionTrigger>
                         <AccordionContent className="text-gray-400 text-base pb-6 leading-relaxed">
                            Absolutely. We have native apps for Mac, Windows, Linux, iOS, and Android. You can also run Discord directly in your web browser.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};

export default FAQSection;
