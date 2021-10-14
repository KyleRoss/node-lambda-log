import React, { createContext, useState, useEffect, useMemo } from 'react';
import apiVersions from '@/docs/versions';

export const ApiVersionContext = createContext();
ApiVersionContext.displayName = 'ApiVersionContext';


export const ApiVersionProvider = ({ children }) => {
  const [version, setVersion] = useState(apiVersions[0].value);

  useEffect(() => {
    localStorage.setItem('lambda-log-version', version);
  }, [version]);

  useEffect(() => {
    const savedVersion = localStorage.getItem('lambda-log-version');
    setVersion(savedVersion || apiVersions[0].value);
  }, []);


  const data = useMemo(() => {
    return {
      version,
      setVersion,
      apiVersions
    };
  }, [version]);

  return (
    <ApiVersionContext.Provider value={data}>{children}</ApiVersionContext.Provider>
  );
};
