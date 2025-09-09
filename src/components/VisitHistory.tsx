import { useState } from 'react';
import { FiArrowLeft, FiCalendar, FiMapPin, FiCheck, FiClock, FiEye, FiFilter } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClientVisits } from '@/hooks/useClientVisits';
import { ClientVisit } from '@/types';

interface VisitHistoryProps {
  onBack: () => void;
}

export function VisitHistory({ onBack }: VisitHistoryProps) {
  const { visits } = useClientVisits();
  const [selectedVisit, setSelectedVisit] = useState<ClientVisit | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'draft'>('all');

  const filteredVisits = visits.filter(visit => {
    if (filterStatus === 'all') return true;
    return visit.status === filterStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalValue = (visit: ClientVisit) => {
    return visit.products.reduce((sum, product) => sum + product.finalizedRate, 0);
  };

  if (selectedVisit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        {/* Header */}
        <header className="bg-card shadow-card border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button variant="ghost" onClick={() => setSelectedVisit(null)} className="mr-4">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Visit Details</h1>
                <p className="text-sm text-muted-foreground">{selectedVisit.clientName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Visit Details */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedVisit.clientName}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    {selectedVisit.businessLocation}
                  </CardDescription>
                </div>
                <Badge variant={selectedVisit.status === 'submitted' ? 'default' : 'secondary'}>
                  {selectedVisit.status === 'submitted' ? (
                    <>
                      <FiCheck className="w-3 h-3 mr-1" />
                      Submitted
                    </>
                  ) : (
                    <>
                      <FiClock className="w-3 h-3 mr-1" />
                      Draft
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Visit Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Visit Date</p>
                  <p className="text-foreground">{formatDate(selectedVisit.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-foreground font-semibold">${getTotalValue(selectedVisit).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Products Count</p>
                  <p className="text-foreground">{selectedVisit.products.length}</p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Products Discussed</h3>
                <div className="space-y-4">
                  {selectedVisit.products.map((product, index) => (
                    <Card key={product.id} className="bg-muted/50 shadow-sm border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-foreground">{product.name}</h4>
                          <span className="text-lg font-semibold text-primary">
                            ${product.finalizedRate.toFixed(2)}
                          </span>
                        </div>
                        {product.remarks && (
                          <p className="text-sm text-muted-foreground mt-2">{product.remarks}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedVisit.submittedAt && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-success">
                    <FiCheck className="w-4 h-4 inline mr-1" />
                    Submitted to admin team on {new Date(selectedVisit.submittedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Visit History</h1>
                <p className="text-sm text-muted-foreground">All your client visits</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visits</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredVisits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisits.map((visit) => (
              <Card key={visit.id} className="bg-gradient-card shadow-card border-0 hover:shadow-soft transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground truncate">{visit.clientName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <FiMapPin className="w-3 h-3 mr-1" />
                        {visit.businessLocation}
                      </p>
                    </div>
                    <Badge variant={visit.status === 'submitted' ? 'default' : 'secondary'} className="ml-2">
                      {visit.status === 'submitted' ? (
                        <>
                          <FiCheck className="w-3 h-3 mr-1" />
                          Submitted
                        </>
                      ) : (
                        <>
                          <FiClock className="w-3 h-3 mr-1" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground">{formatDate(visit.date)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Products:</span>
                      <span className="text-foreground">{visit.products.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Value:</span>
                      <span className="text-foreground font-semibold">${getTotalValue(visit).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedVisit(visit)}
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="text-center py-12">
              <FiCalendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filterStatus === 'all' ? 'No visits recorded' : `No ${filterStatus} visits`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {filterStatus === 'all' 
                  ? 'Start by adding your first client visit.' 
                  : `You don't have any ${filterStatus} visits yet.`}
              </p>
              <Button onClick={onBack}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}