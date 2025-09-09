import { useState } from 'react';
import { FiPlus, FiCalendar, FiUser, FiMapPin, FiCheck, FiClock } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useClientVisits } from '@/hooks/useClientVisits';
import { VisitEntryForm } from './VisitEntryForm';
import { VisitHistory } from './VisitHistory';

type DashboardView = 'overview' | 'new-visit' | 'history';

export function Dashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const { user, logout } = useAuth();
  const { visits } = useClientVisits(user?.id);

  const recentVisits = visits.slice(0, 3);
  const submittedCount = visits.filter(v => v.status === 'submitted').length;
  const draftCount = visits.filter(v => v.status === 'draft').length;

  const handleBackToOverview = () => {
    setCurrentView('overview');
  };

  if (currentView === 'new-visit') {
    return <VisitEntryForm onBack={handleBackToOverview} onSuccess={handleBackToOverview} />;
  }

  if (currentView === 'history') {
    return <VisitHistory onBack={handleBackToOverview} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-button">
                <FiUser className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Marketing Portal</h1>
                <p className="text-sm text-muted-foreground">Client Visit Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" onClick={logout} size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 shadow-soft">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-primary-foreground/80 mb-4">
              Ready to log your client visits? Track your meetings and deals efficiently.
            </p>
            <Button 
              variant="premium" 
              size="lg"
              onClick={() => setCurrentView('new-visit')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <FiPlus className="w-5 h-5" />
              Add New Client Visit
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
                  <p className="text-2xl font-bold text-foreground">{visits.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-success">{submittedCount}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold text-warning">{draftCount}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Visits & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Visits */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Visits
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('history')}
                >
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Your latest client interactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentVisits.length > 0 ? (
                <div className="space-y-4">
                  {recentVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          visit.status === 'submitted' ? 'bg-success' : 'bg-warning'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {visit.clientName}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <FiMapPin className="w-3 h-3 mr-1" />
                          {visit.businessLocation}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(visit.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No visits recorded yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setCurrentView('new-visit')}
                  >
                    Add Your First Visit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="default" 
                className="w-full justify-start"
                onClick={() => setCurrentView('new-visit')}
              >
                <FiPlus className="w-4 h-4 mr-3" />
                Log New Client Visit
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCurrentView('history')}
              >
                <FiCalendar className="w-4 h-4 mr-3" />
                View Visit History
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                disabled
              >
                <FiUser className="w-4 h-4 mr-3" />
                Export Reports (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}