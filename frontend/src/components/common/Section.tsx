import { cn } from "@/utils/cn";
import { Wrapper } from "@/components/common/Wrapper";
import { Title } from "@/components/common/Title";
import { ReactNode } from "react";

type SectionProps = {
  children?: ReactNode;
  id?: string;
  wrapperClasses?: string;
  title?: string;
  className?: string;
};

export const Section = ({
  children,
  id,
  wrapperClasses,
  title,
  className,
}: SectionProps) => {
  return (
    <section id={id} className={cn(className, "py-20 scroll-mt-16")}>
      <Wrapper className={wrapperClasses || ""}>
        {!!title && <Title className="mb-12">{title}</Title>}
        {children}
      </Wrapper>
    </section>
  );
};
