// src/app/auth/password-reset/[uid]/[token]/page.tsx
import ResetPasswordForm from "@features/users/ResetPasswordForm";

type PageProps = {
  params: Promise<{
    uid: string;
    token: string;
  }>;
};

export default async function Page(props: PageProps) {
  const { uid, token } = await props.params;

  return <ResetPasswordForm uid={uid} token={token} />;
}
