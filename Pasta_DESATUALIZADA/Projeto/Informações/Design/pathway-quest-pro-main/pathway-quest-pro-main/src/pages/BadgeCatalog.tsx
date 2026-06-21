import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Award, ChevronRight, Star, Hexagon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge-variant";
import AppLayout from "@/components/AppLayout";
import { mockBadges, TIER_CONFIG, SERVICE_LINES, type Badge } from "@/lib/mock-data";

const BadgeCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceLine, setSelectedServiceLine] = useState<string | null>(null);

  const filteredBadges = mockBadges.filter((badge) => {
    const matchesSearch =
      badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesServiceLine = !selectedServiceLine || badge.serviceLine === selectedServiceLine;
    return matchesSearch && matchesServiceLine;
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Catálogo de Badges</h1>
          <p className="text-muted-foreground mt-1">
            Explora os badges disponíveis e candidata-te
          </p>
        </motion.div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedServiceLine === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedServiceLine(null)}
              className={selectedServiceLine === null ? "gradient-primary text-primary-foreground" : ""}
            >
              Todos
            </Button>
            {SERVICE_LINES.map((sl) => (
              <Button
                key={sl}
                variant={selectedServiceLine === sl ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedServiceLine(sl)}
                className={selectedServiceLine === sl ? "gradient-primary text-primary-foreground" : ""}
              >
                {sl}
              </Button>
            ))}
          </div>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((badge, i) => (
            <BadgeCard key={badge.id} badge={badge} index={i} />
          ))}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-16">
            <Hexagon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum badge encontrado</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const BadgeCard = ({ badge, index }: { badge: Badge; index: number }) => {
  const tierConfig = TIER_CONFIG[badge.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Card className="border border-border shadow-card hover:shadow-card-hover transition-all group cursor-pointer overflow-hidden">
        {/* Top stripe */}
        <div className="h-1.5 gradient-primary" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="h-11 w-11 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <Award className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1.5">
              {badge.isPremium && (
                <StatusBadge variant="premium" label="Premium" />
              )}
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${tierConfig.color}`}>
                {badge.tierCode}
              </span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-snug group-hover:text-accent transition-colors">
            {badge.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
            {badge.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs font-medium text-foreground">{badge.points} pts</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Ver detalhes
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgeCatalog;
