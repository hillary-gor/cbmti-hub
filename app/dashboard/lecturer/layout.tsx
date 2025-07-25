import LecturerShellLayout from "./LecturerShellLayout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LecturerShellLayout>{children}</LecturerShellLayout>;
}
