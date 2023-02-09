import * as React from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ClientOnly: React.FunctionComponent<ClientOnlyProps> = ({
  children,
  ...props
}) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...props}>{children}</div>;
};

export default ClientOnly;
