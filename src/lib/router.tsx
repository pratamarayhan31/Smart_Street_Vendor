import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  query: Record<string, string>;
  navigate: (path: string, query?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  query: {},
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHash, setCurrentHash] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.replace('#', '') || '/';
    }
    return '/';
  });

  const parseRoute = (hashString: string) => {
    const [rawPath, rawQuery] = hashString.split('?');
    const path = rawPath || '/';
    const query: Record<string, string> = {};
    if (rawQuery) {
      new URLSearchParams(rawQuery).forEach((val, key) => {
        query[key] = val;
      });
    }
    return { path, query };
  };

  const { path, query } = parseRoute(currentHash);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentHash(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPath: string, newQuery?: Record<string, string>) => {
    let url = newPath;
    if (newQuery && Object.keys(newQuery).length > 0) {
      const params = new URLSearchParams(newQuery).toString();
      url = `${newPath}?${params}`;
    }
    window.location.hash = url;
    setCurrentHash(url);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ path, query, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

export const Link: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}> = ({ href, className, children, onClick, title }) => {
  const { navigate } = useRouter();

  return (
    <a
      href={`#${href}`}
      title={title}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
};

