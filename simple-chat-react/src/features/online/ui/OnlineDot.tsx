import { useOnline } from '../lib/useOnline';

interface OnlineDotProps {
  userId?: number | null;
  size?: number;
}

export const OnlineDot = ({ userId, size = 10 }: OnlineDotProps) => {
  if (userId === null || userId === undefined) {
    return null;
  }

  const isOnline = useOnline(userId);
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: isOnline ? '#4caf50' : '#9e9e9e',
      transition: 'background-color 0.2s'
    }} />
  );
};
