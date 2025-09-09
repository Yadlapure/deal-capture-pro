import { useState, useEffect } from 'react';
import { ClientVisit } from '@/types';

export function useClientVisits(marketingPersonId?: string) {
  const [visits, setVisits] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load visits from localStorage
    const storedVisits = localStorage.getItem('clientVisits');
    if (storedVisits) {
      const allVisits: ClientVisit[] = JSON.parse(storedVisits);
      const filteredVisits = marketingPersonId 
        ? allVisits.filter(visit => visit.marketingPersonId === marketingPersonId)
        : allVisits;
      setVisits(filteredVisits);
    }
    setIsLoading(false);
  }, [marketingPersonId]);

  const addVisit = (visit: Omit<ClientVisit, 'id'>) => {
    const newVisit: ClientVisit = {
      ...visit,
      id: Date.now().toString(),
    };
    
    const updatedVisits = [...visits, newVisit];
    setVisits(updatedVisits);
    
    // Save to localStorage
    const allVisits = JSON.parse(localStorage.getItem('clientVisits') || '[]');
    allVisits.push(newVisit);
    localStorage.setItem('clientVisits', JSON.stringify(allVisits));
    
    return newVisit;
  };

  const updateVisit = (visitId: string, updates: Partial<ClientVisit>) => {
    const updatedVisits = visits.map(visit =>
      visit.id === visitId ? { ...visit, ...updates } : visit
    );
    setVisits(updatedVisits);
    
    // Update localStorage
    const allVisits: ClientVisit[] = JSON.parse(localStorage.getItem('clientVisits') || '[]');
    const allUpdatedVisits = allVisits.map(visit =>
      visit.id === visitId ? { ...visit, ...updates } : visit
    );
    localStorage.setItem('clientVisits', JSON.stringify(allUpdatedVisits));
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