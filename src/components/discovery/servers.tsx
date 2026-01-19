import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearIsSearching, clearSearchQuery, clearSearchResults, fetchAllServers } from "@/store/slices/discoverySlice";
import { type AppDispatch, type RootState } from "@/store/types";
import { ArrowLeft, FastForward, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface ServerCategory {
    label: string;
    title: string;
    subtitle: string;
    catlogSubtitle: string;
}

const serverCategories: ServerCategory[] = [
    {
        label: "Home",
        title: "Discover the best servers on Discord",
        catlogSubtitle: "From gaming, to music, to learning, there's a place for you.",
        subtitle: "Featured Servers",
    },
    {
        label: "Gaming",
        title: "Games and Gaming Servers",
        catlogSubtitle: "Games and Gaming Servers",
        subtitle: "Games and Gaming Servers",
    },
    {
        label: "Music",
        title: "Music and Audio Servers",
        catlogSubtitle: "Music and Audio Servers",
        subtitle: "Music and Audio Servers",
    },
    {
        label: "Learning",
        title: "Learning and Education Servers",
        catlogSubtitle: "Learning and Education Servers",
        subtitle: "Learning and Education Servers",
    },
    {
        label: "Science",
        title: "Science and Technology Servers",
        catlogSubtitle: "Science and Technology Servers",
        subtitle: "Science and Technology Servers",
    },
    {
        label: "Technology",
        title: "Technology and Engineering Servers",
        catlogSubtitle: "Technology and Engineering Servers",
        subtitle: "Technology and Engineering Servers",
    },
];

const Servers = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { featuredServers, isLoading, error, isSearching, searchResults, searchQuery } = useSelector((state: RootState) => state.discovery);
    const [category, setCategory] = useState<string>("Home");

    console.log(searchResults, isSearching);

    useEffect(() => {
        dispatch(fetchAllServers());
        setCategory("Home");
    }, [dispatch]);

    const handleCategoryClick = (category: string) => {
        setCategory(category);
    }

    const handleBack = () => {
        dispatch(clearSearchResults());
        dispatch(clearIsSearching());
        dispatch(clearSearchQuery());
        setCategory("Home");
    }

    return (
        <div className="flex-1 flex flex-col">
            {!isSearching && (
                <>
                    <div className="flex flex-col h-80 bg-[#555aff] items-center justify-between px-10">
                        {/* Header nav */}
                        <div className="flex items-center justify-start w-full h-10 border-b border-[#d8d8d8] px-3 gap-5">
                            <div className="flex items-center gap-2">
                                <FastForward size={20} fill="white" className="text-[#ffffff]" />
                            </div>

                            <div className="flex items-center gap-2">
                                {serverCategories.map((category, idx: number) => (
                                    <Button onClick={() => handleCategoryClick(category.label)} key={idx} variant="outline" size="sm" className="text-white text-[14px] bg-transparent hover:bg-transparent border-none">
                                        <span className="text-white text-[14px] hover:underline transition-all duration-300 cursor-pointer">{category.label}</span>
                                    </Button>
                                ))}

                            </div>
                        </div>

                        <div className="mx-auto xl:mx-0 pb-1.5 pr-0 lg:pr-8 2xl:pr-0 lg:max-w-[unset] relative w-full mb-20">
                            <h2 className="heading--h1 is_2024 leading-0">{serverCategories.find((val) => val.label === category)?.title}</h2>
                            <p className="text-[16px] font-sans tracking-tight font-medium text-[#e0e0e0] leading-0">{serverCategories.find((val) => val.label === category)?.catlogSubtitle}</p>
                        </div>
                    </div>

                    <div className="flex flex-col h-full bg-[#1b1b1b] rounded-lg p-4 gap-4">
                        <h3 className="font-bold text-white text-[18px]">{serverCategories.find((val) => val.label === category)?.subtitle}</h3>
                        {/* Server Cards */}

                        <div className="grid grid-cols-4 gap-4">

                            {featuredServers.map((server, idx: number) => (
                                <div className="w-70 bg-[#26272c] rounded-[8px] overflow-hidden shadow-lg" key={idx}>
                                    {/* Banner Image */}
                                    <div className="relative h-32 bg-gradient-to-r from-purple-600 via-blue-500 to-orange-400">
                                        {server?.bannerUrl && (
                                            <img
                                                src={server?.bannerUrl || ""}
                                                alt="Server banner"
                                                className="w-full h-full object-cover"
                                            />
                                        )}

                                        {/* Server Icon */}
                                        <div className="absolute -bottom-6 left-5">
                                            <img
                                                src={server?.imageUrl || ""}
                                                alt="Server icon"
                                                className="w-19 h-19 rounded-[10px] object-cover border-5 border-[#26272c] shadow-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="pt-12 px-4 pb-4">
                                        {/* Server Name */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                            <h2 className="text-white font-bold text-xl">{server?.name}</h2>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 py-2">
                                            {server?.bio}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-gray-300">{server?.members?.length} Online</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                                <span className="text-gray-300">{server?.members?.length} Members</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </>
            )}

            {isSearching && (
                <>
                    <div className="flex flex-col h-full bg-[#1b1b1b] rounded-lg p-4 gap-4">
                        <div className="flex items-center justify-start w-full h-10 border-b border-[#d8d8d8] px-3 gap-5">
                            <Button onClick={handleBack} variant="outline" size="sm" className="text-white text-[14px] bg-transparent border-none hover:text-[#dbdee1] transition-all duration-200 hover:scale-103 active:scale-95 hover:bg-[#26272c]">
                                <ArrowLeft size={20} fill="white" className="text-[#ffffff]" />
                                <span className="text-white text-[14px] hover:underline transition-all duration-300 cursor-pointer">Back</span>
                            </Button>
                        </div>
                        <div className="mx-auto xl:mx-0 pb-1.5 pr-0 lg:pr-8 2xl:pr-0 lg:max-w-[unset] relative w-full mb-5">
                            <h2 className="heading--h1 is_2024 leading-0">Search Results</h2>
                            <p className="text-[16px] font-sans tracking-tight font-medium text-[#e0e0e0] leading-0">Search results for ' {searchQuery} ' {searchResults.length > 1 ? "servers" : "server"}</p>
                        </div>
                        {isLoading ? (
                            <div className="flex items-center justify-center col-span-4 h-100">
                                <Loader2 size={20} className="animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-4">
                                {searchResults.length > 0 ? searchResults.map((server, idx: number) => (
                                    <div className="w-70 bg-[#26272c] rounded-[8px] overflow-hidden shadow-lg" key={idx}>
                                        {/* Banner Image */}
                                        <div className="relative h-32 bg-gradient-to-r from-purple-600 via-blue-500 to-orange-400">
                                            {server?.bannerUrl && (
                                                <img
                                                    src={server?.bannerUrl || ""}
                                                    alt="Server banner"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}

                                            {/* Server Icon */}
                                            <div className="absolute -bottom-6 left-5">
                                                <img
                                                    src={server?.imageUrl || ""}
                                                    alt="Server icon"
                                                    className="w-19 h-19 rounded-[10px] object-cover border-5 border-[#26272c] shadow-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="pt-12 px-4 pb-4">
                                            {/* Server Name */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                <h2 className="text-white font-bold text-xl">{server?.name}</h2>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-3 py-2">
                                                {server?.bio}
                                            </p>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    <span className="text-gray-300">{server?.members?.length} Online</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                                    <span className="text-gray-300">{server?.members?.length} Members</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                    :
                                    <div className="flex items-center justify-center col-span-4 h-100">
                                        {<p className="text-gray-400 text-sm">No results found</p>}
                                    </div>}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Servers;