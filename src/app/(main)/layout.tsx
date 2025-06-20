import NavbarSimple from "@/components/common/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <NavbarSimple />
      {children}
    </main>
  );
}
