
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

export default function ProfilePage() {
  return (
    <Layout>
      <div className="container max-w-2xl py-10">
        <Card>
          <ProfileHeader />
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
