import Header from "@/components/Header/Header.tsx";

const OnboardingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col bg-[#f8f8f8]">
      <Header headerPurpose="onboarding" />
      <div className="flex min-h-[calc(100vh-65px)]">{children}</div>
    </div>
  );
};

export default OnboardingLayout;
