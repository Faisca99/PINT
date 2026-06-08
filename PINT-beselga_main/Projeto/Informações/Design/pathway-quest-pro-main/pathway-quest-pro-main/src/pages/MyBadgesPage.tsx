import { motion } from "framer-motion";
import {
  Award,
  ExternalLink,
  Download,
  Share2,
  CheckCircle2,
  Shield,
  Calendar,
  Star,
  Hexagon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { mockUserBadges, TIER_CONFIG } from "@/lib/mock-data";

const MyBadgesPage = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Meus Badges</h1>
          <p className="text-muted-foreground mt-1">
            Os teus badges obtidos e certificações verificáveis
          </p>
        </motion.div>

        {mockUserBadges.length === 0 ? (
          <div className="text-center py-20">
            <Hexagon className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ainda sem badges</h3>
            <p className="text-muted-foreground text-sm">
              Candidata-te a um badge para começar a tua coleção!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockUserBadges.map((ub, i) => {
              const tierConfig = TIER_CONFIG[ub.badge.tier];
              return (
                <motion.div
                  key={ub.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Card className="border border-border shadow-card hover:shadow-card-hover transition-all overflow-hidden">
                    <div className="h-2 gradient-primary" />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                          <Award className="h-7 w-7 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-foreground leading-snug">
                            {ub.badge.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ub.badge.area} · {ub.badge.serviceLine}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${tierConfig.color}`}>
                              {tierConfig.label}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-warning font-medium">
                              <Star className="h-3 w-3" />
                              {ub.badge.points} pts
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Obtido a {ub.earnedAt}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Verificado</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                          <Shield className="h-3.5 w-3.5" />
                          <span>{ub.verificationCode}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <Share2 className="h-3.5 w-3.5 mr-1.5" />
                          LinkedIn
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Público
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyBadgesPage;
