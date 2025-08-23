
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { useAgendaFilters } from '@/hooks/client-portal/modulo-agenda/useAgendaFilters';

interface AgendaFiltersProps {
  filters: {
    professionalIds: string[];
    specialtyIds: string[];
    insuranceIds: string[];
    locationIds: string[];
    status: string[];
    type: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const AgendaFilters: React.FC<AgendaFiltersProps> = ({ filters, onFiltersChange }) => {
  const { data: filterOptions, isLoading } = useAgendaFilters();

  const statusOptions = [
    { id: 'scheduled', name: 'Agendado', color: '#8B5CF6' },
    { id: 'in_progress', name: 'Em andamento', color: '#F59E0B' },
    { id: 'completed', name: 'Concluído', color: '#10B981' },
    { id: 'cancelled', name: 'Cancelado', color: '#EF4444' },
  ];

  const typeOptions = [
    { id: 'consultation', name: 'Consulta', color: '#3B82F6' },
    { id: 'procedure', name: 'Procedimento', color: '#8B5CF6' },
    { id: 'surgery', name: 'Cirurgia', color: '#DC2626' },
  ];

  const updateFilter = (filterType: string, value: string, checked: boolean) => {
    const currentValues = filters[filterType as keyof typeof filters] || [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v: string) => v !== value);
    }

    onFiltersChange({
      ...filters,
      [filterType]: newValues,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      professionalIds: [],
      specialtyIds: [],
      insuranceIds: [],
      locationIds: [],
      status: [],
      type: [],
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profissionais */}
        <div>
          <Label className="text-sm font-medium">Profissionais</Label>
          <div className="mt-2 space-y-2">
            {filterOptions?.professionals.map((professional) => (
              <div key={professional.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`professional-${professional.id}`}
                  checked={filters.professionalIds.includes(professional.id)}
                  onCheckedChange={(checked) => 
                    updateFilter('professionalIds', professional.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`professional-${professional.id}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: professional.color }}
                  />
                  {professional.name}
                  <span className="text-xs text-muted-foreground">
                    ({professional.specialty})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Especialidades */}
        <div>
          <Label className="text-sm font-medium">Especialidades</Label>
          <div className="mt-2 space-y-2">
            {filterOptions?.specialties.map((specialty) => (
              <div key={specialty.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialty-${specialty.id}`}
                  checked={filters.specialtyIds.includes(specialty.id)}
                  onCheckedChange={(checked) => 
                    updateFilter('specialtyIds', specialty.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`specialty-${specialty.id}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: specialty.color }}
                  />
                  {specialty.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <div className="mt-2 space-y-2">
            {statusOptions.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status.id}`}
                  checked={filters.status.includes(status.id)}
                  onCheckedChange={(checked) => 
                    updateFilter('status', status.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`status-${status.id}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  {status.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tipo */}
        <div>
          <Label className="text-sm font-medium">Tipo</Label>
          <div className="mt-2 space-y-2">
            {typeOptions.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={filters.type.includes(type.id)}
                  onCheckedChange={(checked) => 
                    updateFilter('type', type.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`type-${type.id}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Convênios */}
        <div>
          <Label className="text-sm font-medium">Convênios</Label>
          <div className="mt-2 space-y-2">
            {filterOptions?.insurances.map((insurance) => (
              <div key={insurance.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`insurance-${insurance.id}`}
                  checked={filters.insuranceIds.includes(insurance.id)}
                  onCheckedChange={(checked) => 
                    updateFilter('insuranceIds', insurance.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`insurance-${insurance.id}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: insurance.color }}
                  />
                  {insurance.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Localizações */}
        <div>
          <Label className="text-sm font-medium">Localização</Label>
          <div className="mt-2 space-y-2">
            {filterOptions?.locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location.id}`}
                  checked={filters.locationIds.includes(location.id)}
                  onCheckedChange={(checked) => 
                    updateFilter('locationIds', location.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`location-${location.id}`}
                  className="text-sm cursor-pointer"
                >
                  {location.name}
                  <div className="text-xs text-muted-foreground">
                    {location.address}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgendaFilters;
