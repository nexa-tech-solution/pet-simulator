type AppContainerProps = {
  children?: React.ReactNode;
  className?: string;
  hasPadding?: boolean;
};

export default function AppContainer({ children, className, hasPadding }: AppContainerProps) {
  return (
    <div className='w-full'>
      <div className={`w-full mb-16 ${hasPadding ? 'px-16' : ''}`}>
        <div className={`max-w-full mt-8 ${className}`}>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
