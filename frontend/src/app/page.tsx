import { PageContent } from "@/components/PageContent";
import { PageTransition } from "@/components/ui/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <PageContent />
    </PageTransition>
  );
}
