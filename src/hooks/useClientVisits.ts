import { useState, useEffect } from 'react';
import { ClientVisit } from '@/types';

export function useClientVisits() {
  const [visits, setVisits] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load visits from localStorage
    const storedVisits = localStorage.getItem('clientVisits');
    if (storedVisits) {
      const allVisits: ClientVisit[] = JSON.parse(storedVisits);
      setVisits(allVisits);
    }
    setIsLoading(false);
  }, []);

  const addVisit = (visit: Omit<ClientVisit, 'id'>) => {
    const newVisit: ClientVisit = {
      ...visit,
      id: Date.now().toString(),
    };
    
    const updatedVisits = [...visits, newVisit];
    setVisits(updatedVisits);
    
    // Save to localStorage
    localStorage.setItem('clientVisits', JSON.stringify(updatedVisits));
    
    return newVisit;
  };

  const updateVisit = (visitId: string, updates: Partial<ClientVisit>) => {
    const updatedVisits = visits.map(visit =>
      visit.id === visitId ? { ...visit, ...updates } : visit
    );
    setVisits(updatedVisits);
    
    // Update localStorage
    localStorage.setItem('clientVisits', JSON.stringify(updatedVisits));
  };

  const submitVisit = (visitId: string) => {
    updateVisit(visitId, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    });
  };

  return {
    visits,
    isLoading,
    addVisit,
    updateVisit,
    submitVisit,
  };
}