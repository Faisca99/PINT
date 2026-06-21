import { motion } from "framer-motion";
import { Award, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge-variant";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { mockSubmissions, type BadgeStatus } from "@/lib/mock-data";

const SubmissionsPage = () => {
  const statusCounts = {
    all: mockSubmissions.length,
    open: mockSubmissions.filter((s) => s.status === "open").length,
    submitted: mockSubmissions.filter((s) => s.status === "submitted").length,
    in_validation: mockSubmissions.filter((s) => s.status === "in_validation").length,
    closed: mockSubmissions.filter((s) => s.status === "closed").length,
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Minhas Candidaturas</h1>
              <p className="text-muted-foreground mt-1">Acompanha o estado dos teus pedidos</p>
            </div>
            <Button className="gradient-primary text-primary-foreground">
              <Award className="h-4 w-4 mr-2" />
              Nova Candidatura
            </Button>
          </div>
        </motion.div>

        {/* Status overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Submetidas", count: statusCounts.submitted, icon: Clock, color: "text-info" },
            { label: "Em Validação", count: statusCounts.in_validation, icon: AlertCircle, color: "text-warning" },
            { label: "Aprovadas", count: mockSubmissions.filter((s) => s.result === "approved").length, icon: CheckCircle2, color: "text-success" },
            { label: "Rejeitadas", count: mockSubmissions.filter((s) => s.result === "rejected").length, icon: XCircle, color: "text-destructive" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <Card className="border border-border shadow-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <div className="text-xl font-bold text-foreground">{stat.count}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Submissions list */}
        <Tabs defaultValue="all">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">Todas ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="closed">Fechadas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-3">
            {mockSubmissions.map((sub, i) => (
              <SubmissionRow key={sub.id} submission={sub} index={i} />
            ))}
          </TabsContent>
          <TabsContent value="pending" className="mt-4 space-y-3">
            {mockSubmissions.filter((s) => s.status !== "closed").map((sub, i) => (
              <SubmissionRow key={sub.id} submission={sub} index={i} />
            ))}
          </TabsContent>
          <TabsContent value="closed" className="mt-4 space-y-3">
            {mockSubmissions.filter((s) => s.status === "closed").map((sub, i) => (
              <SubmissionRow key={sub.id} submission={sub} index={i} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

const SubmissionRow = ({ submission, index }: { submission: typeof mockSubmissions[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 * index }}
  >
    <Card className="border border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Award className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">{submission.badge.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {submission.badge.area} · {submission.badge.tierCode} · Submetido a {submission.submittedAt}
            </div>
            {submission.comment && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground italic">{submission.comment}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge
            variant={submission.status === "closed" ? submission.result as any : submission.status as any}
          />
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default SubmissionsPage;
