import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiSave, FiSend } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useClientVisits } from '@/hooks/useClientVisits';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface VisitEntryFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function VisitEntryForm({ onBack, onSuccess }: VisitEntryFormProps) {
  const { user } = useAuth();
  const { addVisit } = useClientVisits();
  const { toast } = useToast();
  
  const [clientName, setClientName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState<Omit<Product, 'id'>[]>([
    { name: '', finalizedRate: 0, remarks: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduct = () => {
    setProducts([...products, { name: '', finalizedRate: 0, remarks: '' }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, field: keyof Omit<Product, 'id'>, value: string | number) => {
    const updatedProducts = products.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const validateForm = () => {
    if (!clientName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the client name.",
        variant: "destructive",
      });
      return false;
    }

    if (!businessLocation.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter the business location.",
        variant: "destructive",
      });
      return false;
    }

    const hasValidProduct = products.some(p => p.name.trim() && p.finalizedRate > 0);
    if (!hasValidProduct) {
      toast({
        title: "Missing Product Information",
        description: "Please add at least one product with a name and rate.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const validProducts = products
        .filter(p => p.name.trim())
        .map((p, index) => ({
          id: `${Date.now()}-${index}`,
          ...p,
        }));

      addVisit({
        clientName: clientName.trim(),
        businessLocation: businessLocation.trim(),
        date,
        products: validProducts,
        marketingPersonId: user!.id,
        marketingPersonName: user!.name,
        status: 'draft',
      });

      toast({
        title: "Draft Saved",
        description: "Your visit details have been saved as draft.",
        variant: "default",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save visit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const validProducts = products
        .filter(p => p.name.trim())
        .map((p, index) => ({
          id: `${Date.now()}-${index}`,
          ...p,
        }));

      addVisit({
        clientName: clientName.trim(),
        businessLocation: businessLocation.trim(),
        date,
        products: validProducts,
        marketingPersonId: user!.id,
        marketingPersonName: user!.name,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      });

      toast({
        title: "Visit Submitted Successfully!",
        description: "Your client visit details have been sent to the admin team.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit visit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">New Client Visit</h1>
              <p className="text-sm text-muted-foreground">Log your client meeting details</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
            <CardDescription>
              Enter the details of your client visit and the products discussed
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="clientName" className="text-sm font-medium text-foreground">
                  Client Name *
                </label>
                <Input
                  id="clientName"
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="businessLocation" className="text-sm font-medium text-foreground">
                  Business Location *
                </label>
                <Input
                  id="businessLocation"
                  placeholder="Enter business address or location"
                  value={businessLocation}
                  onChange={(e) => setBusinessLocation(e.target.value)}
                  className="shadow-sm"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="date" className="text-sm font-medium text-foreground">
                  Visit Date *
                </label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="shadow-sm max-w-xs"
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Products Discussed</h3>
                <Button variant="outline" onClick={addProduct} size="sm">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <div className="space-y-4">
                {products.map((product, index) => (
                  <Card key={index} className="bg-muted/50 shadow-sm border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-sm font-medium text-foreground">
                          Product #{index + 1}
                        </h4>
                        {products.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Product Name *
                          </label>
                          <Input
                            placeholder="Enter product name"
                            value={product.name}
                            onChange={(e) => updateProduct(index, 'name', e.target.value)}
                            className="shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Finalized Rate ($) *
                          </label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            value={product.finalizedRate || ''}
                            onChange={(e) => updateProduct(index, 'finalizedRate', parseFloat(e.target.value) || 0)}
                            className="shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-foreground">
                            Remarks / Notes
                          </label>
                          <Textarea
                            placeholder="Additional notes about this product discussion..."
                            value={product.remarks}
                            onChange={(e) => updateProduct(index, 'remarks', e.target.value)}
                            className="shadow-sm resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex-1"
              >
                <FiSave className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                <FiSend className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit to Admin'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}