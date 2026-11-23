import React from 'react';
import { NavLink } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-12 flex justify-center">
      <EmptyState
        icon={<Compass className="w-10 h-10 text-vayu-accent-link" />}
        title="Page Not Found (404)"
        description="The air quality route or page you requested does not exist or has moved."
        action={
          <NavLink to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Return Home
            </Button>
          </NavLink>
        }
      />
    </div>
  );
};
