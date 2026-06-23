import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import UserManagementView from "../components/UserManagementView";
import { useAuth } from "../hooks/useAuth";

export default function UsersPage() {
  const { currentUser, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!['admin', 'teacher'].includes(currentUser?.role)) {
      router.replace('/');
    }
  }, [isReady, currentUser, router]);

  if (!isReady || !['admin', 'teacher'].includes(currentUser?.role)) {
    return null;
  }

  return (
    <Layout>
      <UserManagementView />
    </Layout>
  );
}
