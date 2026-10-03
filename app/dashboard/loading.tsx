import { PageSkeleton } from "@/components/Skeleton";

// Makes dashboard routes prefetchable and gives every tab tap instant feedback.
export default function Loading() {
  return <PageSkeleton />;
}
