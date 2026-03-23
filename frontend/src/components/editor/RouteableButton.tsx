import React from 'react';
import { Button } from '@/components/ui/button';
import { useBuilder } from '@/contexts/BuilderContext';

export function RouteableButton({ 
  children, 
  className = '', 
  routeId, 
  defaultStyle = {},
  onClick,
  ...props 
}) {
  const { state } = useBuilder();
  const { page } = state;
  
  // Find the route configuration
  const route = page.footer?.buttonRoutes?.find(r => r.id === routeId);
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    
    if (route) {
      switch (route.type) {
        case 'external':
          if (route.target === '_blank') {
            window.open(route.url, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = route.url;
          }
          break;
          
        case 'internal':
          // Handle internal navigation
          window.location.href = route.url;
          break;
          
        case 'email':
          window.location.href = route.url.startsWith('mailto:') ? route.url : `mailto:${route.url}`;
          break;
          
        case 'phone':
          window.location.href = route.url.startsWith('tel:') ? route.url : `tel:${route.url}`;
          break;
          
        case 'anchor':
          const element = document.querySelector(route.url);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          break;
          
        default:
          if (route.url) {
            window.open(route.url, '_blank', 'noopener,noreferrer');
          }
      }
    }
  };

  return (
    <Button
      className={className}
      style={defaultStyle}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export function RouteableLink({ 
  children, 
  className = '', 
  routeId, 
  style = {},
  onClick,
  ...props 
}) {
  const { state } = useBuilder();
  const { page } = state;
  
  // Find the route configuration
  const route = page.footer?.buttonRoutes?.find(r => r.id === routeId);
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    
    if (route) {
      e.preventDefault();
      
      switch (route.type) {
        case 'external':
          if (route.target === '_blank') {
            window.open(route.url, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = route.url;
          }
          break;
          
        case 'internal':
          window.location.href = route.url;
          break;
          
        case 'email':
          window.location.href = route.url.startsWith('mailto:') ? route.url : `mailto:${route.url}`;
          break;
          
        case 'phone':
          window.location.href = route.url.startsWith('tel:') ? route.url : `tel:${route.url}`;
          break;
          
        case 'anchor':
          const element = document.querySelector(route.url);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          break;
          
        default:
          if (route.url) {
            window.open(route.url, '_blank', 'noopener,noreferrer');
          }
      }
    }
  };

  return (
    <a
      className={className}
      style={style}
      onClick={handleClick}
      href={route?.url || '#'}
      target={route?.type === 'external' ? route.target || '_blank' : '_self'}
      rel={route?.type === 'external' ? 'noopener noreferrer' : ''}
      {...props}
    >
      {children}
    </a>
  );
}