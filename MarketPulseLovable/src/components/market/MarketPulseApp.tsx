import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { ASSETS, APP_ASSETS, MOCK_TRANSLATIONS } from "@/data/assets";
import { TRANSLATIONS } from "@/data/translations";
import { SplashScreen } from "@/components/market/SplashScreen";
import { OnboardingScreen } from "@/components/market/OnboardingScreen";
import { useMarketData } from "@/hooks/useMarketData";

// Layout & Section Components
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { SearchDropdown } from "./layout/SearchDropdown";
import { BottomNav } from "./layout/BottomNav";
import { DashboardTab } from "./sections/DashboardTab";
import { WatchlistTab } from "./sections/WatchlistTab";
import { MarketsTab } from "./sections/MarketsTab";
import { CommunityTab } from "./sections/CommunityTab";
import { ProfileTab } from "./sections/ProfileTab";

// Modal Components
import { CommentSheet } from "./modals/CommentSheet";
import { MyCommentsSheet } from "./modals/MyCommentsSheet";
import { DetailedPointSheet } from "./modals/DetailedPointSheet";

// Types
import { Comment, MarketPoint, SentimentCluster } from "@/types/market";

export default function MarketPulseApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [isExitingSplash, setIsExitingSplash] = useState(false);
  const [isSplashPressed, setIsSplashPressed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAssetId, setSelectedAssetId] = useState("BTC");
  const [selectedPoint, setSelectedPoint] = useState<MarketPoint | null>(null);
  const [detailedPoint, setDetailedPoint] = useState<MarketPoint | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [timeframe, setTimeframe] = useState("1D");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [language, setLanguage] = useState("English");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  const [communityTab, setCommunityTab] = useState("community");
  const [profilePage, setProfilePage] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(() => {
    try { return localStorage.getItem("profilePicture"); } catch { return null; }
  });

  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfilePicture(result);
      localStorage.setItem("profilePicture", result);
    };
    reader.readAsDataURL(file);
  };

  const [trendingExpanded, setTrendingExpanded] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [trendingTimeframe, setTrendingTimeframe] = useState("Daily");
  const [commentsTimeframe, setCommentsTimeframe] = useState("Daily");

  const [watchlistAssets, setWatchlistAssets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("watchlistAssets");
      return saved ? JSON.parse(saved) : ["AAPL", "TSLA", "NVDA", "BTC", "GOLD", "ETH", "SOL", "NASDAQ"];
    } catch (e) {
      console.error("Failed to parse watchlistAssets from localStorage", e);
      return ["AAPL", "TSLA", "NVDA", "BTC", "GOLD", "ETH", "SOL", "NASDAQ"];
    }
  });

  const [pinnedAssets, setPinnedAssets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("pinnedAssets");
      return saved ? JSON.parse(saved) : ["BTC", "AAPL", "GOLD"];
    } catch (e) {
      console.error("Failed to parse pinnedAssets from localStorage", e);
      return ["BTC", "AAPL", "GOLD"];
    }
  });

  const [isEditPinned, setIsEditPinned] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [watchlistLayout, setWatchlistLayout] = useState<"list" | "grid">("list");
  const [showNewsBubbles, setShowNewsBubbles] = useState(true);
  const [showAIConsensus, setShowAIConsensus] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Comment system
  const [userComments, setUserComments] = useState<Comment[]>(() => {
    try { const s = localStorage.getItem("userComments"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [commentChartIdx, setCommentChartIdx] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentSentiment, setCommentSentiment] = useState("Neutral");
  const [chartCrosshair, setChartCrosshair] = useState<{ idx: number; price: number; x: number; y: number } | null>(null);
  const [showMyComments, setShowMyComments] = useState(false);

  useEffect(() => { localStorage.setItem("userComments", JSON.stringify(userComments)); }, [userComments]);

  const activeAsset = useMemo(() => ASSETS.find((a) => a.id === selectedAssetId) || ASSETS[0], [selectedAssetId]);
  const fallbackData = useMemo(() => activeAsset.data[timeframe] || activeAsset.data["1D"], [activeAsset, timeframe]);
  const activeTranslations = (MOCK_TRANSLATIONS[selectedAssetId] || []) as MarketPoint[];

  const {
    chartData: activeData,
    price: livePrice,
    change: liveChange,
    isUp: liveIsUp,
    isLive,
  } = useMarketData({
    assetId: selectedAssetId,
    timeframe,
    fallbackData,
    fallbackPrice: activeAsset.price,
    fallbackChange: activeAsset.change,
    fallbackIsUp: activeAsset.isUp,
  });

  useEffect(() => { setAiAnalysis(null); setChartCrosshair(null); }, [selectedAssetId]);
  useEffect(() => { setChartCrosshair(null); }, [timeframe]);
  useEffect(() => { localStorage.setItem("watchlistAssets", JSON.stringify(watchlistAssets)); }, [watchlistAssets]);
  useEffect(() => { localStorage.setItem("pinnedAssets", JSON.stringify(pinnedAssets)); }, [pinnedAssets]);

  const activeUserComments = useMemo(() => userComments.filter((c) => c.assetId === selectedAssetId && c.timeframe === timeframe), [userComments, selectedAssetId, timeframe]);
  const allAssetUserComments = useMemo(() => userComments.filter((c) => c.assetId === selectedAssetId), [userComments, selectedAssetId]);

  // Sentiment clustering
  const sentimentClusters = useMemo<SentimentCluster[]>(() => {
    if (activeUserComments.length === 0) return [];
    if (!activeData || activeData.length === 0) return [];
    const minVal = Math.min(...activeData);
    const maxVal = Math.max(...activeData);
    const priceRange = maxVal - minVal;
    const clusterThreshold = priceRange * 0.08;
    const sorted = [...activeUserComments].sort((a, b) => (a.price || 0) - (b.price || 0));
    const clusters: any[] = [];
    let current = { comments: [sorted[0]], priceSum: sorted[0].price || 0, idxSum: sorted[0].chartIndex || 0 };
    
    for (let i = 1; i < sorted.length; i++) {
      const price = sorted[i].price || 0;
      const avgPrice = current.priceSum / current.comments.length;
      if (Math.abs(price - avgPrice) < clusterThreshold) {
        current.comments.push(sorted[i]);
        current.priceSum += price;
        current.idxSum += sorted[i].chartIndex || 0;
      } else {
        const avgP = current.priceSum / current.comments.length;
        const avgI = Math.round(current.idxSum / current.comments.length);
        const pos = current.comments.filter(c => c.sentiment === "Positive").length;
        const neg = current.comments.filter(c => c.sentiment === "Negative").length;
        clusters.push({ comments: current.comments, avgPrice: avgP, avgIdx: avgI, sentiment: pos > neg ? "Positive" : neg > pos ? "Negative" : "Neutral", count: current.comments.length });
        current = { comments: [sorted[i]], priceSum: price, idxSum: sorted[i].chartIndex || 0 };
      }
    }
    const avgPResult = current.priceSum / current.comments.length;
    const avgIResult = Math.round(current.idxSum / current.comments.length);
    const posFinal = current.comments.filter(c => c.sentiment === "Positive").length;
    const negFinal = current.comments.filter(c => c.sentiment === "Negative").length;
    clusters.push({ comments: current.comments, avgPrice: avgPResult, avgIdx: avgIResult, sentiment: posFinal > negFinal ? "Positive" : negFinal > posFinal ? "Negative" : "Neutral", count: current.comments.length });
    return clusters.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [activeUserComments, activeData]);

  const handleChartTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chartCrosshair) { setChartCrosshair(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const idx = Math.round(((xPct - 4) / 92) * (activeData.length - 1));
    const clampedIdx = Math.max(0, Math.min(activeData.length - 1, idx));
    const price = activeData[clampedIdx];
    const getX = (i: number) => 4 + (i / (activeData.length - 1)) * 92;
    const getY = (v: number) => {
      const minV = Math.min(...activeData) * 0.995;
      const maxV = Math.max(...activeData) * 1.005;
      return 8 + (100 - ((v - minV) / (maxV - minV)) * 100) * 0.84;
    };
    setChartCrosshair({ idx: clampedIdx, price, x: getX(clampedIdx), y: getY(price) });
    setSelectedPoint(null);
  };

  const openCommentSheet = () => {
    if (!chartCrosshair) return;
    setCommentChartIdx(chartCrosshair.idx);
    setCommentText("");
    setCommentSentiment("Neutral");
    setShowCommentSheet(true);
  };

  const submitComment = () => {
    if (!commentText.trim() || commentChartIdx === null) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      assetId: selectedAssetId,
      timeframe,
      chartIndex: commentChartIdx,
      price: activeData[commentChartIdx],
      text: commentText.trim(),
      sentiment: commentSentiment,
      timestamp: new Date().toISOString(),
      user: "@You",
      likes: 0,
    };
    setUserComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setShowCommentSheet(false);
    setChartCrosshair(null);
  };

  const deleteComment = (id: string) => {
    setUserComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handlePointClick = (point: MarketPoint) => {
    if (selectedPoint?.idx === point.idx) {
      setDetailedPoint(point);
    } else {
      setSelectedPoint(point);
      setSentimentFilter("All");
    }
  };

  const handleSplashClick = () => {
    setIsSplashPressed(true);
    setTimeout(() => {
      setIsExitingSplash(true);
      setTimeout(() => setShowSplash(false), 700);
    }, 1200);
  };

  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiAnalysis(
        `${activeAsset.name} is currently trading at $${activeAsset.price.toLocaleString()} with a ${activeAsset.change} change. ` +
        `Market sentiment appears ${activeAsset.isUp ? "bullish" : "bearish"} in the short term. ` +
        `Key support and resistance levels should be monitored for potential breakout or breakdown scenarios.`
      );
      setIsAnalyzing(false);
    }, 1500);
  };

  if (showSplash) {
    return <SplashScreen isExitingSplash={isExitingSplash} isSplashPressed={isSplashPressed} onSplashClick={handleSplashClick} t={t} />;
  }

  if (!isLoggedIn) {
    return <OnboardingScreen onLogin={() => setIsLoggedIn(true)} language={language} setLanguage={setLanguage} t={t} />;
  }

  return (
    <div className="min-h-screen bg-[var(--mp-bg)] flex justify-center overflow-x-hidden">
      <div className="w-full max-w-[430px] min-h-screen text-foreground font-sans selection:bg-[var(--mp-cyan)]/30 relative shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col animate-in fade-in duration-700 overflow-x-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: `url(${APP_ASSETS.mainBackground})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />

        <Header t={t} isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} setIsMenuOpen={setIsMenuOpen} />
        
        <SearchDropdown isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />

        <Sidebar 
          isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} 
          isEditPinned={isEditPinned} setIsEditPinned={setIsEditPinned}
          pinnedAssets={pinnedAssets} setPinnedAssets={setPinnedAssets}
          menuSearch={menuSearch} setMenuSearch={setMenuSearch}
          selectedAssetId={selectedAssetId} setSelectedAssetId={setSelectedAssetId}
          setActiveTab={setActiveTab} t={t}
        />

        <main className="relative z-20 pt-[110px] pb-32 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <DashboardTab 
                activeAsset={activeAsset} livePrice={livePrice} liveChange={liveChange} liveIsUp={liveIsUp} isLive={isLive}
                language={language} t={t} activeData={activeData} chartCrosshair={chartCrosshair}
                handleChartTap={handleChartTap} openCommentSheet={openCommentSheet}
                showNewsBubbles={showNewsBubbles} setShowNewsBubbles={setShowNewsBubbles}
                showAIConsensus={showAIConsensus} setShowAIConsensus={setShowAIConsensus}
                activeTranslations={activeTranslations} selectedPoint={selectedPoint} handlePointClick={handlePointClick}
                sentimentClusters={sentimentClusters} setShowMyComments={setShowMyComments}
                activeUserComments={activeUserComments} allAssetUserComments={allAssetUserComments}
                timeframe={timeframe} setTimeframe={setTimeframe} aiAnalysis={aiAnalysis}
                isAnalyzing={isAnalyzing} generateAIAnalysis={generateAIAnalysis} setIsMenuOpen={setIsMenuOpen}
              />
            )}

            {activeTab === "watchlist" && (
              <WatchlistTab 
                t={t} watchlistLayout={watchlistLayout} setWatchlistLayout={setWatchlistLayout}
                watchlistAssets={watchlistAssets} setSelectedAssetId={setSelectedAssetId} setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "markets" && (
              <MarketsTab 
                t={t} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                expandedCategory={expandedCategory} setExpandedCategory={setExpandedCategory}
                watchlistAssets={watchlistAssets} setWatchlistAssets={setWatchlistAssets}
                setSelectedAssetId={setSelectedAssetId} setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "community" && (
              <CommunityTab 
                t={t} communityTab={communityTab} setCommunityTab={setCommunityTab}
                trendingExpanded={trendingExpanded} setTrendingExpanded={setTrendingExpanded}
                trendingTimeframe={trendingTimeframe} setTrendingTimeframe={setTrendingTimeframe}
                commentsExpanded={commentsExpanded} setCommentsExpanded={setCommentsExpanded}
                commentsTimeframe={commentsTimeframe} setCommentsTimeframe={setCommentsTimeframe}
                setSelectedAssetId={setSelectedAssetId} setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "profile" && (
              <ProfileTab 
                t={t} language={language} setLanguage={setLanguage} profilePage={profilePage} setProfilePage={setProfilePage}
                profilePicture={profilePicture} handleProfilePicture={handleProfilePicture}
                userComments={userComments} watchlistAssets={watchlistAssets} pinnedAssets={pinnedAssets}
                autoTranslate={autoTranslate} setAutoTranslate={setAutoTranslate}
                showLanguageMenu={showLanguageMenu} setShowLanguageMenu={setShowLanguageMenu}
                setIsLoggedIn={setIsLoggedIn} deleteComment={deleteComment}
              />
            )}
          </AnimatePresence>
        </main>

        <CommentSheet 
          showCommentSheet={showCommentSheet} setShowCommentSheet={setShowCommentSheet}
          language={language} activeAsset={activeAsset} commentChartIdx={commentChartIdx}
          activeData={activeData} commentSentiment={commentSentiment} setCommentSentiment={setCommentSentiment}
          commentText={commentText} setCommentText={setCommentText} submitComment={submitComment}
        />

        <MyCommentsSheet 
          showMyComments={showMyComments} setShowMyComments={setShowMyComments}
          language={language} activeAsset={activeAsset} allAssetUserComments={allAssetUserComments}
          deleteComment={deleteComment}
        />

        <DetailedPointSheet 
          detailedPoint={detailedPoint} setDetailedPoint={setDetailedPoint}
          setSelectedPoint={setSelectedPoint} t={t} sentimentFilter={sentimentFilter}
          setSentimentFilter={setSentimentFilter} activeUserComments={activeUserComments}
          deleteComment={deleteComment}
        />

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setProfilePage={setProfilePage} />
      </div>
    </div>
  );
}
