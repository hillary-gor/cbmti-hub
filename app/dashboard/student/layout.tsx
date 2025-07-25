import StudentShellLayout from "./StudentShellLayout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentShellLayout>{children}</StudentShellLayout>;
}
